import type { Player } from '../../models/Player';

export interface InjuryInstance {
  playerId: string;
  type: string;
  gamesRemaining: number; // Games the player will miss
  duration?: number;      // Legacy alias (days) kept for backward compat
  severity: 'Low' | 'Medium' | 'High';
}

// ---------------------------------------------------------------------------
// Injury Type Definitions — now uses games missed instead of calendar days
// ---------------------------------------------------------------------------
const INJURY_TYPES = [
  // Low severity: Minor knock, back in 1-5 games
  { type: 'Ankle Sprain',       minGames: 1, maxGames: 4,  severity: 'Low'    as const },
  { type: 'Knee Soreness',      minGames: 1, maxGames: 3,  severity: 'Low'    as const },
  { type: 'Back Spasms',        minGames: 1, maxGames: 4,  severity: 'Low'    as const },
  { type: 'Groin Pull',         minGames: 2, maxGames: 5,  severity: 'Low'    as const },
  { type: 'Shin Splints',       minGames: 2, maxGames: 4,  severity: 'Low'    as const },
  { type: 'Elbow Bursitis',     minGames: 1, maxGames: 3,  severity: 'Low'    as const },

  // Medium severity: Significant injury, 3-15 games
  { type: 'Hamstring Strain',   minGames: 3, maxGames: 8,  severity: 'Medium' as const },
  { type: 'Concussion',         minGames: 3, maxGames: 6,  severity: 'Medium' as const },
  { type: 'Broken Finger',      minGames: 5, maxGames: 12, severity: 'Medium' as const },
  { type: 'Wrist Fracture',     minGames: 8, maxGames: 18, severity: 'Medium' as const },

  // High severity: Season-threatening
  { type: 'ACL Tear',           minGames: 40, maxGames: 82, severity: 'High'  as const },
  { type: 'Achilles Rupture',   minGames: 50, maxGames: 82, severity: 'High'  as const },
];

// ---------------------------------------------------------------------------
// Fatigue helpers
// ---------------------------------------------------------------------------

/**
 * Calculates fatigue increase after a game based on minutes played.
 * Fatigue is 0-100 (long-term wear).
 */
export function calculateFatigueIncrease(minutes: number): number {
  if (minutes <= 0) return 0;

  let increase = minutes * 0.25;
  if (minutes > 36) {
    increase += (minutes - 36) * 0.5;
  }

  return increase;
}

/**
 * Daily fatigue recovery. Called on rest days (no game).
 */
export function calculateDailyRecovery(player: Player): number {
  return player.personality === 'Professional' || player.personality === 'Workhorse' ? 12 : 10;
}

// ---------------------------------------------------------------------------
// Core injury roll — Post-game risk
// ---------------------------------------------------------------------------

/**
 * Rolls for a post-game injury based on fatigue, minutes, age and league.
 * Returns null if no injury occurred.
 */
export function rollForInjury(
  player: Player,
  minutesInGame: number,
  league: 'NBA' | 'EURO' = 'NBA'
): InjuryInstance | null {
  if (player.injury) return null; // Already injured

  const fatigue = player.fatigue ?? 0;

  // Base risk per game (ultra-conservative)
  let risk = league === 'NBA' ? 0.0003 : 0.0005;

  // Fatigue scales risk (max +0.8% at 100 fatigue)
  risk += (fatigue / 100) * 0.008;

  // Overuse penalty (league-specific minute threshold)
  const overuseThreshold = league === 'NBA' ? 38 : 34;
  if (minutesInGame > overuseThreshold) {
    risk += 0.002;
  }

  // Age modifiers
  if (player.age > 33)      risk *= 1.4;
  else if (player.age > 30) risk *= 1.15;
  else if (player.age < 22) risk *= 0.7;

  if (Math.random() > risk) return null;

  return _buildInjury(player.id, false);
}

// ---------------------------------------------------------------------------
// In-game injury check — called per possession
// ---------------------------------------------------------------------------

/**
 * Extremely low-probability check during live play.
 * Called hundreds of times per game, so the chance must be tiny per tick.
 */
export function checkInGameInjury(
  player: Player,
  stamina: number,
  league: 'NBA' | 'EURO' = 'NBA'
): InjuryInstance | null {
  // Ultra-low probability
  const baseChance = league === 'EURO' ? 0.000004 : 0.000001;
  const fatigueMod = ((100 - stamina) / 100) * 0.00001;

  if (Math.random() > baseChance + fatigueMod) return null;

  return _buildInjury(player.id, true); // in-game = slightly less catastrophic bias
}

// ---------------------------------------------------------------------------
// Healing — game-based
// ---------------------------------------------------------------------------

/**
 * Decrements gamesRemaining by 1. Clears injury and updates injuryHistory when done.
 * Call this once per game-day (not per calendar day).
 */
export function processGameHealing(player: Player, season: number): Player {
  if (!player.injury) return player;

  const gamesLeft = player.injury.gamesRemaining ?? 1;
  const newGamesLeft = gamesLeft - 1;

  if (newGamesLeft <= 0) {
    // Record in history
    const historyEntry = {
      type: player.injury.type,
      severity: player.injury.severity,
      season,
      gamesOut: player.injury.duration ?? (player.injury.gamesRemaining ?? 1),
    };

    return {
      ...player,
      injury: undefined,
      injuryHistory: [...(player.injuryHistory ?? []), historyEntry],
    };
  }

  return {
    ...player,
    injury: {
      ...player.injury,
      gamesRemaining: newGamesLeft,
    },
  };
}

/**
 * Legacy date-based healing — kept for backward compat with old saves.
 * New saves use processGameHealing instead.
 */
export function processDailyHealing(player: Player, currentDate: Date): Player {
  if (!player.injury) return player;

  // If this injury has gamesRemaining, use the new system instead
  if (player.injury.gamesRemaining !== undefined) {
    return player; // Will be handled by processGameHealing
  }

  // Old date-based logic
  const returnDate = new Date(player.injury.returnDate);
  if (currentDate >= returnDate) {
    return { ...player, injury: undefined };
  }
  return player;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function _buildInjury(playerId: string, inGame: boolean): InjuryInstance {
  const sevRoll = Math.random();

  // In-game injuries are less likely to be catastrophic (player usually pulls up)
  let pool: typeof INJURY_TYPES;
  if (inGame) {
    pool = sevRoll < 0.02 ? INJURY_TYPES.filter(i => i.severity === 'High')
         : sevRoll < 0.20 ? INJURY_TYPES.filter(i => i.severity === 'Medium')
         : INJURY_TYPES.filter(i => i.severity === 'Low');
  } else {
    pool = sevRoll < 0.04 ? INJURY_TYPES.filter(i => i.severity === 'High')
         : sevRoll < 0.25 ? INJURY_TYPES.filter(i => i.severity === 'Medium')
         : INJURY_TYPES.filter(i => i.severity === 'Low');
  }

  if (!pool.length) pool = INJURY_TYPES.filter(i => i.severity === 'Low');

  const def = pool[Math.floor(Math.random() * pool.length)];
  const games = def.minGames + Math.floor(Math.random() * (def.maxGames - def.minGames + 1));

  return {
    playerId,
    type: def.type,
    gamesRemaining: games,
    duration: games, // legacy alias
    severity: def.severity,
  };
}
