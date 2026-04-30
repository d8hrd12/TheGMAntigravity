import type { Player } from '../../../models/Player';
import { NBA } from './Calibration';
import type { PlayTypeResult } from './PlayTypeEngine';

export interface ShotResult {
  made: boolean;
  zone: 'RIM' | 'MID' | 'THREE';
  foul: boolean;
  andOne: boolean;
  blocked: boolean;
  blockerId?: string;
  points: number;
  ftAttempts: number;
}

function getShooterAttr(shooter: Player, zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM')   return shooter.attributes.finishing;
  if (zone === 'THREE') return shooter.attributes.threePointShot;
  return shooter.attributes.midRange;
}

function getDefenderAttr(defender: Player, zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM') return defender.attributes.interiorDefense * 0.65 + defender.attributes.blocking * 0.35;
  return defender.attributes.perimeterDefense;
}

function getBasePct(zone: 'RIM' | 'MID' | 'THREE'): number {
  if (zone === 'RIM')   return NBA.RIM_PCT;
  if (zone === 'THREE') return NBA.THREE_FG_PCT;
  return NBA.MID_PCT;
}

const FOUL_BY_PLAY: Record<string, number> = {
  DRIVE: NBA.FOUL_DRIVE, POST: NBA.FOUL_POST, PNR_ROLL: NBA.FOUL_PNR_ROLL,
  ISO: NBA.FOUL_ISO, PNR_BALL: NBA.FOUL_ISO,
  SPOT_3: NBA.FOUL_SPOT3, CATCH_3: NBA.FOUL_CATCH3,
  ASSISTED_MID: NBA.FOUL_MID, TRANSITION: NBA.FOUL_DRIVE,
};

export function resolveShot(
  play: PlayTypeResult,
  defenseLineup: Player[],
  teamFouls: number,
  stamina: number = 100,
): ShotResult {
  const { shooter, zone, bonusAccuracy, playType } = play;
  const defender = defenseLineup.find(p => p.position === shooter.position) ?? defenseLineup[0];

  // --- Block check (RIM only, on misses) ---
  const bestBlocker = defenseLineup.reduce((b, p) => p.attributes.blocking > b.attributes.blocking ? p : b);
  const blockProb = zone === 'RIM'
    ? Math.max(0, (bestBlocker.attributes.blocking - 50) / (99 - 50) * 0.18)
    : 0;

  // --- Shot accuracy ---
  const shooterAttr = getShooterAttr(shooter, zone);
  const defenderAttr = getDefenderAttr(defender, zone);
  const base = getBasePct(zone);
  const skillEdge = (shooterAttr - defenderAttr) / 100 * 0.28;
  const fatiguePenalty = stamina < 50 ? (50 - stamina) * 0.0012 : 0;
  const finalProb = Math.max(0.10, Math.min(0.90, base + skillEdge + bonusAccuracy - fatiguePenalty));
  const made = Math.random() < finalProb;

  // Apply block only on misses
  if (!made && zone === 'RIM' && Math.random() < blockProb) {
    return { made: false, zone, foul: false, andOne: false, blocked: true, blockerId: bestBlocker.id, points: 0, ftAttempts: 0 };
  }

  // --- Foul check ---
  const foulChance = FOUL_BY_PLAY[playType] ?? 0.06;
  const inBonus = teamFouls >= 5;
  const foulOccurred = !made && Math.random() < foulChance;
  const bonusFoul = !made && !foulOccurred && inBonus && Math.random() < 0.08;
  const hasFoul = foulOccurred || bonusFoul;

  // And-1
  const andOne = made && zone === 'RIM' && Math.random() < NBA.AND_ONE_RIM;

  const ftAttempts = hasFoul ? (zone === 'THREE' ? 3 : 2) : andOne ? 1 : 0;
  const points = made ? (zone === 'THREE' ? 3 : 2) : 0;

  return { made, zone, foul: hasFoul, andOne, blocked: false, points, ftAttempts };
}

export function resolveFreeThrows(shooter: Player, attempts: number): { made: number; missed: number } {
  const pct = shooter.attributes.freeThrow / 100;
  let made = 0;
  for (let i = 0; i < attempts; i++) if (Math.random() < pct) made++;
  return { made, missed: attempts - made };
}
