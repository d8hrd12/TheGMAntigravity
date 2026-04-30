import type { Player } from '../../../models/Player';
import { NBA } from './Calibration';

export interface TurnoverResult {
  isTurnover: boolean;
  isSteal: boolean;
  stealerId?: string;
}

export function checkTurnover(handler: Player, defenseLineup: Player[], stamina: number = 100): TurnoverResult {
  const def = defenseLineup.find(p => p.position === handler.position) ?? defenseLineup[0];

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

  // Baseline noise: offensive fouls, shot clock, bad reads
  // Calibrated so total TO rate ≈ 15/100 possessions (league average)
  const baseNoise = 0.095;

  return { isTurnover: Math.random() < handlerRisk + fatigueMod + baseNoise, isSteal: false };
}
