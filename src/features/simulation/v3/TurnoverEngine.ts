import type { Player } from '../../../models/Player';
import { NBA } from './Calibration';
import type { DefensiveStrategy } from '../TacticsTypes';
import { DEFENSIVE_SCHEME_EFFECTS } from '../TacticsTypes';

export interface TurnoverResult {
  isTurnover: boolean;
  isSteal: boolean;
  stealerId?: string;
}

export function checkTurnover(handler: Player, defenseLineup: Player[], stamina: number = 100, defenseScheme?: DefensiveStrategy, morale: number = 50): TurnoverResult {
  const def = defenseLineup.find(p => p.position === handler.position) ?? defenseLineup[0];

  // Defensive scheme forced turnover bonus (Full Court Press)
  const scheme = defenseScheme ? DEFENSIVE_SCHEME_EFFECTS[defenseScheme] : null;
  const schemeTOBonus = scheme?.turnoverForced ?? 0;
  if (schemeTOBonus > 0 && Math.random() < schemeTOBonus) {
    // Scheme-forced turnover (press, trap)
    const stealer = defenseLineup.reduce((b, p) =>
      p.attributes.stealing > b.attributes.stealing ? p : b
    );
    return { isTurnover: true, isSteal: true, stealerId: stealer.id };
  }

  // On-ball steal: top-tier defenders only
  const stealProb = Math.max(0,
    (def.attributes.stealing - 60) * 0.0011 +
    (def.attributes.perimeterDefense - 60) * 0.0006
  );
  if (Math.random() < stealProb) return { isTurnover: true, isSteal: true, stealerId: def.id };

  // Team pressure steal (best defender anticipates)
  const bestDef = defenseLineup.reduce((b, p) =>
    (p.attributes.stealing + p.attributes.basketballIQ) > (b.attributes.stealing + b.attributes.basketballIQ) ? p : b
  );
  const teamPressure = Math.max(0, (bestDef.attributes.stealing - 75) * 0.0004 + (bestDef.attributes.basketballIQ - 75) * 0.0002);
  if (Math.random() < teamPressure) return { isTurnover: true, isSteal: true, stealerId: bestDef.id };

  // Ball-handler risk (poor playmaking/IQ)
  const handlerRisk = Math.max(0,
    (75 - handler.attributes.playmaking) * 0.0014 +
    (70 - handler.attributes.ballHandling) * 0.0010
  );

  // Fatigue increases errors
  const fatigueMod = stamina < 50 ? (50 - stamina) * 0.0003 : 0;

  // Morale modifier: unhappy players make more careless mistakes
  let moraleMod = 0;
  if (morale < 30) moraleMod = 0.03;
  else if (morale < 50) moraleMod = 0.015;

  // Baseline noise: offensive fouls, shot clock, bad reads
  // Calibrated so total TO rate ≈ 15/100 possessions (league average)
  const baseNoise = 0.095;

  return { isTurnover: Math.random() < handlerRisk + fatigueMod + moraleMod + baseNoise, isSteal: false };
}
