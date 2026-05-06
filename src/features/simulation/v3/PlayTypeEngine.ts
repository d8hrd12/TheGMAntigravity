import type { Player } from '../../../models/Player';
import { BASE_USAGE } from './Calibration';
import type { OffensiveFocus } from '../TacticsTypes';
import { FOCUS_BONUSES } from '../TacticsTypes';

export type PlayType =
  | 'ISO' | 'DRIVE' | 'POST' | 'PNR_BALL' | 'PNR_ROLL'
  | 'SPOT_3' | 'CATCH_3' | 'ASSISTED_MID' | 'TRANSITION';

export interface PlayTypeResult {
  playType: PlayType;
  shooter: Player;
  assister?: Player;
  zone: 'RIM' | 'MID' | 'THREE';
  bonusAccuracy: number;
}

// Position usage caps — prevents any one player from monopolizing shots
const POS_CAP: Record<string, number> = { PG: 0.28, SG: 0.26, SF: 0.23, PF: 0.20, C: 0.20 };

export function scoringSkill(p: Player): number {
  const s = [p.attributes.finishing, p.attributes.midRange, p.attributes.threePointShot].sort((a, b) => b - a);
  return s[0] * 0.60 + s[1] * 0.30 + s[2] * 0.10;
}

/** Calculate usage weights. Stars get more possessions but are capped per position. */
export function calculateUsageWeights(lineup: Player[]): Map<string, number> {
  const weights = new Map<string, number>();
  let total = 0;

  lineup.forEach(p => {
    const sk = scoringSkill(p);
    const cap = POS_CAP[p.position] ?? 0.22;
    // Elite playmakers (Jokic, Doncic) act as primary initiators → PG-level touch rate
    const isInitiator = p.attributes.playmaking >= 92 && p.attributes.basketballIQ >= 92;
    const base = isInitiator ? 0.285 : (BASE_USAGE[p.position] ?? 0.20);
    const w = Math.min(base * Math.pow(sk / 75, 1.5), cap);
    weights.set(p.id, w);
    total += w;
  });

  weights.forEach((v, k) => weights.set(k, v / total));
  return weights;
}

function weightedPick<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) { r -= o.weight; if (r <= 0) return o.value; }
  return options[options.length - 1].value;
}

/** Select play type and resolve shooter/assister based on player attributes */
export function selectPlayType(handler: Player, lineup: Player[], isTransition = false, offensiveFocus?: OffensiveFocus): PlayTypeResult {
  const a = handler.attributes;
  const pos = handler.position;
  const isBig = pos === 'C' || pos === 'PF';
  const isGuard = pos === 'PG' || pos === 'SG';

  if (isTransition) return { playType: 'TRANSITION', shooter: handler, zone: 'RIM', bonusAccuracy: 0.12 };

  const teammates = lineup.filter(p => p.id !== handler.id);

  // Elite initiators (Jokic/Doncic) pass 65% of their handler possessions → high assist counts
  // Regular guards/wings pass 45%
  const isInitiator = a.playmaking >= 92 && a.basketballIQ >= 92;
  const passChance = isInitiator ? 0.65 : 0.45;

  if (Math.random() < passChance && teammates.length > 0) {
    // Power-law weighted pass recipient: stars receive proportionally more
    const total = teammates.reduce((s, p) => s + Math.pow(scoringSkill(p) / 100, 2) * 100, 0);
    let r = Math.random() * total;
    let recipient = teammates[teammates.length - 1];
    for (const p of teammates) {
      r -= Math.pow(scoringSkill(p) / 100, 2) * 100;
      if (r <= 0) { recipient = p; break; }
    }

    // Determine zone for recipient — apply offensive focus bias
    const ra = recipient.attributes;
    let finW = ra.finishing;
    let midW = ra.midRange;
    let threeW = ra.threePointShot;
    if (offensiveFocus) {
      const fb = FOCUS_BONUSES[offensiveFocus];
      finW *= (fb.drive ?? fb.post ?? 1.0);
      midW *= (fb.shot ?? 1.0);
      threeW *= (fb.shot ?? 1.0) * (offensiveFocus === 'Perimeter' ? 1.2 : 1.0);
    }
    const tot = finW + midW + threeW;
    const rv = Math.random() * tot;
    const zone: 'RIM' | 'MID' | 'THREE' = rv < finW ? 'RIM' : rv < finW + midW ? 'MID' : 'THREE';

    // Assisted shot bonus: open catch-and-shoot is more accurate
    const bonusAccuracy = zone === 'THREE' ? 0.07 : zone === 'RIM' ? 0.05 : 0.04;

    // Play type based on recipient position & zone
    let playType: PlayType = zone === 'RIM' ? 'PNR_ROLL' : zone === 'THREE' ? 'SPOT_3' : 'ASSISTED_MID';
    if (recipient.position === 'PG' || recipient.position === 'SG') {
      playType = zone === 'THREE' ? 'CATCH_3' : 'ISO';
    }

    return { playType, shooter: recipient, assister: handler, zone, bonusAccuracy };
  }

  // Handler shoots — build play type options from attributes
  // Apply coach offensive focus bonuses
  const fb = offensiveFocus ? FOCUS_BONUSES[offensiveFocus] : { drive: 1.0, shot: 1.0, pass: 1.0, post: 1.0 };
  const options: { value: PlayType; weight: number }[] = [];

  if (!isBig) {
    options.push({ value: 'ISO',    weight: (a.ballHandling * 0.35 + a.midRange * 0.35 + a.threePointShot * 0.15 + a.basketballIQ * 0.15) / 100 * 0.7 * (fb.shot ?? 1.0) });
    options.push({ value: 'DRIVE',  weight: (a.athleticism * 0.45 + a.finishing * 0.35 + a.ballHandling * 0.20) / 100 * 0.9 * (fb.drive ?? 1.0) });
  }
  if (isBig) {
    options.push({ value: 'POST',   weight: (a.finishing * 0.70 + a.interiorDefense * 0.30) / 100 * 0.8 * (fb.post ?? 1.0) });
  }
  options.push({ value: 'PNR_BALL', weight: (a.ballHandling * 0.45 + a.playmaking * 0.30 + a.basketballIQ * 0.25) / 100 * 0.6 * (fb.pass ?? 1.0) });
  if (a.threePointShot >= 65) {
    const perimeterBoost = offensiveFocus === 'Perimeter' ? 1.3 : 1.0;
    options.push({ value: 'SPOT_3', weight: (a.threePointShot * 0.70 + a.basketballIQ * 0.30) / 100 * (isGuard ? 0.65 : 0.45) * perimeterBoost });
  }

  const playType: PlayType = weightedPick(options.length > 0 ? options : [{ value: 'ISO' as PlayType, weight: 1 }]);

  // Determine zone from play type and shooter attributes
  let zone: 'RIM' | 'MID' | 'THREE';
  let bonusAccuracy = 0;

  if (playType === 'DRIVE' || playType === 'POST' || playType === 'PNR_ROLL') {
    zone = 'RIM'; bonusAccuracy = playType === 'DRIVE' ? 0.03 : 0.02;
  } else if (playType === 'SPOT_3' || playType === 'CATCH_3') {
    zone = 'THREE'; bonusAccuracy = 0.05;
  } else {
    // ISO or PNR_BALL: choose zone based on shooter skill ratio
    const prefer3 = a.threePointShot / (a.threePointShot + a.midRange + 1);
    zone = Math.random() < prefer3 * 1.1 ? 'THREE' : 'MID';
    bonusAccuracy = 0;
  }

  return { playType, shooter: handler, zone, bonusAccuracy };
}
