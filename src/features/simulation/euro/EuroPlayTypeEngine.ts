/**
 * EuroPlayTypeEngine.ts — EuroLeague play-type selection & usage
 *
 * EuroLeague hallmarks vs NBA:
 *   - More structured half-court offense (pin-downs, DHOs, off-ball cuts)
 *   - More post play, mid-range post-up
 *   - Fewer ISO plays from one-on-one creators
 *   - More ball movement → higher assist rate (~19 vs NBA ~26 but per fewer possessions → same ratio)
 *   - Less transition basketball
 *   - PNR/Pick-and-roll is core but less dominant than NBA
 */

import type { Player } from '../../../models/Player';
import { EURO_BASE_USAGE, EURO_USAGE_CAP } from './EuroCalibration';
import type { OffensiveFocus } from '../TacticsTypes';
import { FOCUS_BONUSES } from '../TacticsTypes';

export type EuroPlayType =
  | 'ISO'
  | 'DRIVE'
  | 'POST_UP'
  | 'PNR_BALL'
  | 'PNR_ROLL'
  | 'SPOT_3'
  | 'CATCH_3'
  | 'DHO'          // Dribble hand-off — common in EuroLeague
  | 'PIN_DOWN'     // Pin-down cut for wing shooter — very Euro
  | 'OFF_BALL_CUT' // Backdoor / cut to basket
  | 'ASSISTED_MID';

export interface EuroPlayTypeResult {
  playType: EuroPlayType;
  shooter: Player;
  assister?: Player;
  zone: 'RIM' | 'MID' | 'THREE';
  bonusAccuracy: number;
}

export function euroScoringSkill(p: Player): number {
  const s = [p.attributes.finishing, p.attributes.midRange, p.attributes.threePointShot].sort((a, b) => b - a);
  // EuroLeague: mid-range matters more, slight re-weighting
  return s[0] * 0.55 + s[1] * 0.35 + s[2] * 0.10;
}

/** Calculate usage weights for a Euro lineup.
 *  More evenly distributed than NBA — EL is team-centric. */
export function calculateEuroUsageWeights(lineup: Player[]): Map<string, number> {
  const weights = new Map<string, number>();
  let total = 0;

  lineup.forEach(p => {
    const sk = euroScoringSkill(p);
    const cap = EURO_USAGE_CAP[p.position] ?? 0.22;
    // Elite EL creators (Sloukas, Shane Larkin types) — high IQ + playmaking
    const isCreator = p.attributes.playmaking >= 88 && p.attributes.basketballIQ >= 88;
    const base = isCreator ? 0.22 : (EURO_BASE_USAGE[p.position] ?? 0.18);
    // Flat power law to ensure volume doesn't concentrate on one star
    const w = Math.min(base * Math.pow(sk / 75, 0.7), cap);
    weights.set(p.id, w);
    total += w;
  });

  weights.forEach((v, k) => weights.set(k, v / total));
  return weights;
}

function weightedPick<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return options[options.length - 1].value;
}

/** Pick best recipient from teammates using skill-weighted random */
function pickPassRecipient(teammates: Player[]): Player {
  const scores = teammates.map(p => ({
    p,
    score: Math.pow(euroScoringSkill(p) / 100, 1.8) * 100 + Math.random() * 12,
  }));
  scores.sort((a, b) => b.score - a.score);
  // EuroLeague: Ball moves to the open man, not just the star.
  // 35% chance best option, 30% second, 20% third, 15% others
  const roll = Math.random();
  if (roll < 0.35 || scores.length === 1) return scores[0].p;
  if (roll < 0.65 || scores.length === 2) return scores[1].p;
  if (roll < 0.85 || scores.length === 3) return scores[2].p;
  return scores[Math.min(scores.length - 1, 3 + Math.floor(Math.random() * 2))].p;
}

/** Determine zone for a shot based on recipient's attributes and EL tendencies */
function zoneForRecipient(recipient: Player, offensiveFocus?: OffensiveFocus): 'RIM' | 'MID' | 'THREE' {
  const ra = recipient.attributes;
  let finW = ra.finishing * 0.9;    // EL: less rim emphasis
  let midW = ra.midRange  * 1.15;   // EL: mid-range is premium
  let threeW = ra.threePointShot;

  if (offensiveFocus) {
    const fb = FOCUS_BONUSES[offensiveFocus];
    finW   *= (fb.drive ?? fb.post ?? 1.0);
    midW   *= (fb.shot ?? 1.0);
    threeW *= (fb.shot ?? 1.0) * (offensiveFocus === 'Perimeter' ? 1.15 : 1.0);
  }

  const tot = finW + midW + threeW;
  const rv = Math.random() * tot;
  return rv < finW ? 'RIM' : rv < finW + midW ? 'MID' : 'THREE';
}

/**
 * Core EuroLeague play-type selection.
 *
 * EL philosophy:
 *  - Ball moves frequently (high pass chance)
 *  - Big men post up more
 *  - Pin-down / DHO / off-ball cuts are prominent
 *  - Less hero-ball / late-clock ISO
 */
export function selectEuroPlayType(
  handler: Player,
  lineup: Player[],
  offensiveFocus?: OffensiveFocus
): EuroPlayTypeResult {
  const a = handler.attributes;
  const pos = handler.position;
  const isBig = pos === 'C' || pos === 'PF';
  const isGuard = pos === 'PG' || pos === 'SG';
  const teammates = lineup.filter(p => p.id !== handler.id);

  // ----------------------------------------------------------------
  // BALL MOVEMENT PHASE — EL passes ball more than NBA
  // Guards: 55% pass chance, Wings: 50%, Bigs: 45%
  // Elite creators (playmaking + IQ): 68%
  // ----------------------------------------------------------------
  // Elite creators (playmaking + IQ): 82% (up from 68%)
  const isCreator = a.playmaking >= 88 && a.basketballIQ >= 88;
  const passChance = isCreator ? 0.82
    : isGuard ? 0.65
    : isBig   ? 0.50
    : 0.58;  // SF/Wing

  if (Math.random() < passChance && teammates.length > 0) {
    const recipient = pickPassRecipient(teammates);
    const ra = recipient.attributes;
    const zone = zoneForRecipient(recipient, offensiveFocus);

    // Bonus accuracy on assisted shots (EL: very low to keep PPG realistic)
    const bonusAccuracy = zone === 'THREE' ? 0.015
      : zone === 'RIM'   ? 0.020
      : 0.010;

    // Play type from context
    let playType: EuroPlayType;
    const rPos = recipient.position;
    if (rPos === 'C' || rPos === 'PF') {
      // Big man: post-up or cut
      playType = zone === 'RIM'
        ? (Math.random() < 0.5 ? 'OFF_BALL_CUT' : 'PNR_ROLL')
        : 'POST_UP';
    } else if (zone === 'THREE') {
      // Wing/guard: spot-up 3 or catch-3 off pin-down
      playType = Math.random() < 0.55 ? 'SPOT_3' : 'PIN_DOWN';
    } else if (zone === 'RIM') {
      // Guard/wing cut
      playType = Math.random() < 0.5 ? 'OFF_BALL_CUT' : 'DHO';
    } else {
      // Mid — DHO or assisted mid
      playType = Math.random() < 0.45 ? 'DHO' : 'ASSISTED_MID';
    }

    return { playType, shooter: recipient, assister: handler, zone, bonusAccuracy };
  }

  // ----------------------------------------------------------------
  // SELF-CREATION PHASE — handler takes own shot
  // ----------------------------------------------------------------
  const fb = offensiveFocus ? FOCUS_BONUSES[offensiveFocus] : { drive: 1.0, shot: 1.0, pass: 1.0, post: 1.0 };
  const options: { value: EuroPlayType; weight: number }[] = [];

  if (isBig) {
    // Bigs: post-up heavy, PNR roll
    options.push({ value: 'POST_UP',  weight: (a.finishing * 0.65 + a.midRange * 0.25 + a.athleticism * 0.10) / 100 * 1.0 * (fb.post ?? 1.0) });
    options.push({ value: 'PNR_BALL', weight: (a.ballHandling * 0.40 + a.playmaking * 0.35 + a.basketballIQ * 0.25) / 100 * 0.5 * (fb.pass ?? 1.0) });
    if (a.threePointShot >= 60) {
      options.push({ value: 'SPOT_3', weight: (a.threePointShot * 0.75 + a.basketballIQ * 0.25) / 100 * 0.3 });
    }
  }

  if (!isBig) {
    // Guards/Wings: PNR, drive, ISO, spot-3
    options.push({ value: 'PNR_BALL', weight: (a.ballHandling * 0.40 + a.playmaking * 0.35 + a.basketballIQ * 0.25) / 100 * 0.8 * (fb.pass ?? 1.0) });
    options.push({ value: 'DRIVE',    weight: (a.athleticism * 0.40 + a.finishing * 0.35 + a.ballHandling * 0.25) / 100 * 0.75 * (fb.drive ?? 1.0) });
    options.push({ value: 'ISO',      weight: (a.ballHandling * 0.35 + a.midRange * 0.35 + a.basketballIQ * 0.30) / 100 * 0.55 * (fb.shot ?? 1.0) });
    if (a.threePointShot >= 65) {
      const perimBoost = offensiveFocus === 'Perimeter' ? 1.2 : 1.0;
      options.push({ value: 'SPOT_3', weight: (a.threePointShot * 0.70 + a.basketballIQ * 0.30) / 100 * 0.60 * perimBoost });
    }
    options.push({ value: 'DHO',      weight: (a.ballHandling * 0.45 + a.playmaking * 0.35 + a.basketballIQ * 0.20) / 100 * 0.45 });
  }

  const playType: EuroPlayType = weightedPick(
    options.length > 0 ? options : [{ value: 'PNR_BALL' as EuroPlayType, weight: 1 }]
  );

  // ----------------------------------------------------------------
  // Zone selection from play type
  // ----------------------------------------------------------------
  let zone: 'RIM' | 'MID' | 'THREE';
  let bonusAccuracy = 0;

  switch (playType) {
    case 'DRIVE':
    case 'OFF_BALL_CUT':
    case 'PNR_ROLL':
      zone = 'RIM';
      bonusAccuracy = playType === 'DRIVE' ? 0.03 : 0.04;
      break;
    case 'POST_UP':
      // Post up: mix of rim and mid-post (EL post play goes mid more often)
      zone = Math.random() < 0.55 ? 'MID' : 'RIM';
      bonusAccuracy = 0.02;
      break;
    case 'SPOT_3':
    case 'CATCH_3':
    case 'PIN_DOWN':
      zone = 'THREE';
      bonusAccuracy = playType === 'PIN_DOWN' ? 0.04 : 0.03;
      break;
    case 'DHO':
      // DHO can generate 3 or mid
      zone = Math.random() < 0.45 ? 'THREE' : 'MID';
      bonusAccuracy = 0.05;
      break;
    case 'PNR_BALL':
      // Ball-handler: mix of mid and 3
      {
        const prefer3 = a.threePointShot / (a.threePointShot + a.midRange + 1);
        zone = Math.random() < prefer3 ? 'THREE' : 'MID';
        bonusAccuracy = 0;
      }
      break;
    case 'ASSISTED_MID':
      zone = 'MID';
      bonusAccuracy = 0.05;
      break;
    default: // ISO
      {
        const prefer3 = a.threePointShot / (a.threePointShot + a.midRange + 1);
        zone = Math.random() < prefer3 * 0.9 ? 'THREE' : 'MID';
        bonusAccuracy = 0;
      }
  }

  return { playType, shooter: handler, zone, bonusAccuracy };
}
