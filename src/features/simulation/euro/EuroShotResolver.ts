/**
 * EuroShotResolver.ts — EuroLeague shot resolution engine
 *
 * Key EL differences from NBA:
 *  - Lower rim% (0.585 vs NBA 0.640) — less athletic finishing
 *  - Higher mid% (0.455 vs NBA 0.430) — more skilled post/mid execution
 *  - Similar 3P% (0.356 vs NBA 0.365)
 *  - More fouls drawn (aggressive defense, hand-checks more legal)
 *  - Foul-out at 5 (tracked externally by match engine)
 *  - Team foul bonus after 5th team foul per quarter
 *  - Blocks very rare (1.3/game) — EL has few elite rim protectors
 */

import type { Player } from '../../../models/Player';
import { EURO } from './EuroCalibration';
import type { EuroPlayTypeResult } from './EuroPlayTypeEngine';
import type { DefensiveStrategy } from '../TacticsTypes';
import { DEFENSIVE_SCHEME_EFFECTS } from '../TacticsTypes';

export interface EuroShotResult {
  made: boolean;
  zone: 'RIM' | 'MID' | 'THREE';
  foul: boolean;
  andOne: boolean;
  blocked: boolean;
  blockerId?: string;
  points: number;
  ftAttempts: number;
  /** foul committed by which defender — for personal foul tracking */
  foulDefenderId?: string;
}

function getShooterAttr(shooter: Player, zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM')   return shooter.attributes.finishing;
  if (zone === 'THREE') return shooter.attributes.threePointShot;
  return shooter.attributes.midRange;
}

function getDefenderAttr(defender: Player, zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM') {
    // EL: interior defense + a smaller blocking component
    return defender.attributes.interiorDefense * 0.72 + defender.attributes.blocking * 0.28;
  }
  // EL: perimeter defense matters most on 3s and mids
  return defender.attributes.perimeterDefense * 0.80 + defender.attributes.stealing * 0.20;
}

function getBasePct(zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM')   return EURO.RIM_PCT;
  if (zone === 'THREE') return EURO.THREE_FG_PCT;
  return EURO.MID_PCT;
}

const FOUL_BY_PLAY: Record<string, number> = {
  DRIVE:        EURO.FOUL_DRIVE,
  POST_UP:      EURO.FOUL_POST,
  PNR_ROLL:     EURO.FOUL_PNR_ROLL,
  ISO:          EURO.FOUL_ISO,
  PNR_BALL:     EURO.FOUL_ISO,
  SPOT_3:       EURO.FOUL_SPOT3,
  CATCH_3:      EURO.FOUL_CATCH3,
  ASSISTED_MID: EURO.FOUL_MID,
  DHO:          EURO.FOUL_MID,
  PIN_DOWN:     EURO.FOUL_SPOT3,
  OFF_BALL_CUT: EURO.FOUL_DRIVE,
};

export function resolveEuroShot(
  play: EuroPlayTypeResult,
  defenseLineup: Player[],
  teamFouls: number,         // defending team's foul count this quarter
  stamina: number = 100,
  coachOffBonus: number = 0,
  coachDefBonus: number = 0,
  defenseScheme?: DefensiveStrategy,
  morale: number = 50,
  isHome: boolean = false,   // home court shooting bonus
): EuroShotResult {
  const { shooter, zone, bonusAccuracy, playType } = play;

  // Best positional defender against this shooter
  const defender = defenseLineup.find(p => p.position === shooter.position) ?? defenseLineup[0];

  // ----------------------------------------------------------------
  // DEFENSIVE SCHEME EFFECTS
  // ----------------------------------------------------------------
  const scheme = defenseScheme ? DEFENSIVE_SCHEME_EFFECTS[defenseScheme] : null;
  const rimProtMod  = scheme?.rimProtection ?? 1.0;
  const perimContMod = scheme?.perimeterContest ?? 1.0;

  // ----------------------------------------------------------------
  // BLOCK CHECK (RIM only)
  // EuroLeague blocks are very rare — only elite shot-blockers factor in
  // League average: 1.3 blocks/game = ~0.009/possession
  // ----------------------------------------------------------------
  const bestBlocker = defenseLineup.reduce((b, p) =>
    p.attributes.blocking > b.attributes.blocking ? p : b
  );
  // Block probability scaling: Drastically increased to hit 1.8 BPG leader target
  const blockProb = zone === 'RIM'
    ? Math.max(0, (bestBlocker.attributes.blocking - 50) / (99 - 50) * 0.48 * rimProtMod)
    : 0;

  // ----------------------------------------------------------------
  // SHOT ACCURACY CALCULATION
  // ----------------------------------------------------------------
  const shooterAttr = getShooterAttr(shooter, zone);
  const defenderAttr = getDefenderAttr(defender, zone);
  const base = getBasePct(zone);

  // Skill edge: each 1-point attribute gap = ~0.65% shot% change
  // EL: defense is much more suffocating
  const skillEdge = (shooterAttr - defenderAttr) / 100 * 0.65;

  // Fatigue penalty (only kicks in below 50 stamina)
  const fatiguePenalty = stamina < 50 ? (50 - stamina) * 0.0010 : 0;

  // Coach modifier
  const coachMod = coachOffBonus - coachDefBonus;

  // Morale modifier
  let moraleMod = 0;
  if (morale >= 80)      moraleMod =  0.020;
  else if (morale >= 50) moraleMod =  0.000;
  else if (morale >= 30) moraleMod = -0.018;
  else                   moraleMod = -0.035;

  // Defensive scheme zone modifier
  let schemeMod = 0;
  if (scheme) {
    if (zone === 'RIM')   schemeMod = -(rimProtMod - 1.0) * 0.07;
    else if (zone === 'THREE') schemeMod = -(perimContMod - 1.0) * 0.07;
    else if (zone === 'MID' && scheme.midrangeModifier) schemeMod = scheme.midrangeModifier * 0.04;
  }

  // Home court boost
  const homeMod = isHome ? EURO.HOME_SHOOT_BOOST : -EURO.AWAY_SHOOT_PENALTY;

  const finalProb = Math.max(0.10, Math.min(0.88,
    base + skillEdge + bonusAccuracy - fatiguePenalty + coachMod + moraleMod + schemeMod + homeMod
  ));
  const made = Math.random() < finalProb;

  // ----------------------------------------------------------------
  // BLOCK RESOLUTION (only on misses at rim)
  // ----------------------------------------------------------------
  if (!made && zone === 'RIM' && Math.random() < blockProb) {
    return {
      made: false, zone, foul: false, andOne: false,
      blocked: true, blockerId: bestBlocker.id, points: 0, ftAttempts: 0
    };
  }

  // ----------------------------------------------------------------
  // FOUL RESOLUTION
  // EuroLeague: team bonus kicks in on 5th team foul per quarter
  // Defenders with poor IQ or high foul tendency foul more
  // ----------------------------------------------------------------
  const baseFoulChance = (FOUL_BY_PLAY[playType] ?? 0.07) * (scheme?.foulRisk ?? 1.0);

  // Defender foul tendency modifier — aggressive defenders foul more
  const defFoulTendency = defender.tendencies?.defensiveAggression ?? 70;
  const defFoulMod = (defFoulTendency - 70) / 70 * 0.03;

  // Shooter foul-drawing tendency — athletic drivers draw more fouls
  const attackRating = zone === 'RIM'
    ? (shooter.attributes.athleticism * 0.5 + shooter.attributes.finishing * 0.5)
    : shooter.attributes.midRange;
  const foulDrawMod = (attackRating - 75) / 75 * 0.015;

  const foulChance = Math.max(0, baseFoulChance + defFoulMod + foulDrawMod);

  // Team foul bonus: after 5th team foul per quarter, all missed shots in key area → 2 FTs
  const inBonus = teamFouls >= EURO.TEAM_FOUL_BONUS;
  const foulOccurred = !made && Math.random() < foulChance;
  const bonusFoul = !made && !foulOccurred && inBonus && Math.random() < 0.10;
  const hasFoul = foulOccurred || bonusFoul;

  // And-1 probability (lower than NBA — different officiating)
  const andOne = made && zone === 'RIM' && Math.random() < EURO.AND_ONE_RIM;

  const ftAttempts = hasFoul ? (zone === 'THREE' ? 3 : 2) : andOne ? 1 : 0;
  const points = made ? (zone === 'THREE' ? 3 : 2) : 0;

  // Which defender fouled (for personal foul tracking → foul-out at 5)
  const foulDefenderId = hasFoul ? defender.id : undefined;

  return { made, zone, foul: hasFoul, andOne, blocked: false, points, ftAttempts, foulDefenderId };
}

export function resolveEuroFreeThrows(
  shooter: Player,
  attempts: number,
  pressure: number = 0  // 0-1: clutch pressure modifier
): { made: number; missed: number } {
  // EL FT%: based on freeThrow attribute, with small pressure penalty
  const basePct = shooter.attributes.freeThrow / 100;
  const pressurePenalty = pressure * 0.04;
  const pct = Math.max(0.50, Math.min(0.98, basePct - pressurePenalty));
  let made = 0;
  for (let i = 0; i < attempts; i++) {
    if (Math.random() < pct) made++;
  }
  return { made, missed: attempts - made };
}
