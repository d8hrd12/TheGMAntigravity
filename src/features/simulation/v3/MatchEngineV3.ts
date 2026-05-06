/**
 * MatchEngineV3 — NBA-calibrated simulation engine
 *
 * Philosophy:
 *  - Stats emerge from player attributes × usage × minutes (NOT random tendency rolls)
 *  - Calibrated to 2025-26 NBA averages (115 pts, 89 FGA, 15 TO, 44 REB per team per game)
 *  - No OVR used anywhere in simulation logic
 *  - No play-by-play events (removed per user request)
 *  - Fouls and free throws fully implemented
 */

import type { Player }         from '../../../models/Player';
import type { MatchInput, MatchResult, PlayerStats, BoxScore, GameEvent } from '../SimulationTypes';
import { calculateOverall }    from '../../../utils/playerUtils';
import { NBA, MINUTES_BY_RANK } from './Calibration';
import { calculateUsageWeights, selectPlayType } from './PlayTypeEngine';
import { resolveShot, resolveFreeThrows }         from './ShotResolver';
import { resolveRebound }                          from './ReboundEngine';
import { checkTurnover }                           from './TurnoverEngine';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function blankStats(player: Player): PlayerStats {
  return {
    playerId: player.id,
    name: `${player.firstName} ${player.lastName}`,
    minutes: 0, points: 0,
    fgMade: 0, fgAttempted: 0,
    ftMade: 0, ftAttempted: 0,
    rimMade: 0, rimAttempted: 0, rimAssisted: 0,
    midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
    threeMade: 0, threeAttempted: 0, threePointAssisted: 0,
    rebounds: 0, offensiveRebounds: 0, defensiveRebounds: 0,
    assists: 0, steals: 0, blocks: 0,
    turnovers: 0, personalFouls: 0,
    plusMinus: 0, consecutiveFieldGoalsMade: 0,
  };
}

function scoringSkill(p: Player): number {
  const a = p.attributes;
  const s = [a.finishing, a.midRange, a.threePointShot].sort((x, y) => y - x);
  return s[0] * 0.60 + s[1] * 0.30 + s[2] * 0.10;
}

/** Pick player by usage weight map */
function pickByUsage(lineup: Player[], weights: Map<string, number>): Player {
  let r = Math.random();
  for (const p of lineup) {
    r -= (weights.get(p.id) ?? 0);
    if (r <= 0) return p;
  }
  return lineup[lineup.length - 1];
}

/** Build lineup for a given quarter based on OVR ranking */
function buildLineup(roster: Player[], quarter: number, isBlowout: boolean = false): Player[] {
  const active = roster.filter(p => !p.isRetired);
  const sorted = [...active].sort((a, b) => calculateOverall(b) - calculateOverall(a));

  // If blowout in regular season, play the deep bench (garbage time)
  if (isBlowout) {
      const deepBench = sorted.slice(5, 10);
      // Pad if roster is short
      while (deepBench.length < 5 && sorted.length > 0) {
          deepBench.push(sorted[Math.floor(Math.random() * sorted.length)]);
      }
      return deepBench.slice(0, 5);
  }

  // Starters (top 5) for Q1/Q3, rotate bench in Q2/Q4 at half
  // Simple model: top 5 are starters, 6-9 are rotation
  const starters = sorted.slice(0, 5);
  const rotation = sorted.slice(5, 9);

  // Q2 and Q4 second half: mix rotation in
  if (quarter === 2 || quarter === 4) {
    // Sub 2 bench players in
    const mixed = [...starters];
    if (rotation[0]) mixed[3] = rotation[0];
    if (rotation[1]) mixed[4] = rotation[1];
    return mixed;
  }
  return starters;
}

/** Assign minutes based on role rank — only for players without pre-set minutes */
function assignMinutes(roster: Player[]): void {
  const active = roster.filter(p => !p.isRetired);
  
  // Check if this roster already has valid minutes assigned (user customization)
  const totalMinutes = active.reduce((sum, p) => sum + (p.minutes || 0), 0);
  if (totalMinutes >= 200 && totalMinutes <= 260) {
    // Minutes are already set (user rotation), respect them
    return;
  }
  
  // Only assign defaults if no valid rotation exists
  const sorted = [...active].sort((a, b) => calculateOverall(b) - calculateOverall(a));
  sorted.forEach((p, i) => {
    p.minutes = MINUTES_BY_RANK[i] ?? 0;
  });
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function simulateMatchV3(input: MatchInput): MatchResult {
  const { homeTeam, awayTeam, homeRoster, awayRoster, date } = input;

  // Assign minutes only for rosters without pre-set minutes
  assignMinutes(homeRoster);
  assignMinutes(awayRoster);

  // Stats accumulation
  const statsMap = new Map<string, PlayerStats>();
  const allPlayers = [...homeRoster, ...awayRoster];
  allPlayers.forEach(p => statsMap.set(p.id, blankStats(p)));

  const add = (id: string, field: keyof PlayerStats, val: number) => {
    const s = statsMap.get(id);
    if (s) (s as any)[field] += val;
  };

  // Score & quarter tracking
  let homeScore = 0;
  let awayScore = 0;
  const quarterScores = [
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ];

  // Team foul counters (reset each quarter)
  let homeFouls = 0;
  let awayFouls = 0;

  // PlusMinus tracking: who is on court during each point swing
  const onCourt = { home: [] as string[], away: [] as string[] };

  // ---------------------------------------------------------------------------
  // GAME LOOP: 4 quarters × 50 possessions each side = 200 total possessions
  // ---------------------------------------------------------------------------
  const POSS_PER_QUARTER = 25; // per team per quarter → 25×4 = 100 per team

  for (let quarter = 1; quarter <= 4; quarter++) {
    homeFouls = 0;
    awayFouls = 0;

    const isBlowout = quarter === 4 && Math.abs(homeScore - awayScore) >= 25 && !input.isPlayoffs;
    const homeLineup = buildLineup(homeRoster, quarter, isBlowout);
    const awayLineup = buildLineup(awayRoster, quarter, isBlowout);

    onCourt.home = homeLineup.map(p => p.id);
    onCourt.away = awayLineup.map(p => p.id);

    // Pre-compute usage weights once per quarter
    const homeUsage = calculateUsageWeights(homeLineup);
    const awayUsage  = calculateUsageWeights(awayLineup);

    // Track stamina per player this quarter (starts at 100, drains with activity)
    const stamina = new Map<string, number>();
    [...homeLineup, ...awayLineup].forEach(p => stamina.set(p.id, p.stamina ?? 100));

    for (let poss = 0; poss < POSS_PER_QUARTER * 2; poss++) {
      const isHome = poss % 2 === 0;

      const offLineup  = isHome ? homeLineup  : awayLineup;
      const defLineup  = isHome ? awayLineup  : homeLineup;
      const offUsage   = isHome ? homeUsage   : awayUsage;
      const offFouls   = isHome ? homeFouls   : awayFouls;

      // Select ball handler by usage weight
      const handler = pickByUsage(offLineup, offUsage);
      const handlerStamina = stamina.get(handler.id) ?? 100;

      // ---- Turnover check ----
      const toResult = checkTurnover(handler, defLineup, handlerStamina);
      if (toResult.isTurnover) {
        add(handler.id, 'turnovers', 1);
        if (toResult.isSteal && toResult.stealerId) {
          add(toResult.stealerId, 'steals', 1);
        }
        // Drain handler stamina slightly
        stamina.set(handler.id, Math.max(0, handlerStamina - 1.5));
        continue;
      }

      // ---- Select play type ----
      const play = selectPlayType(handler, offLineup);
      const { shooter, assister, zone } = play;
      const shooterStamina = stamina.get(shooter.id) ?? 100;

      // ---- Shot resolution ----
      const shot = resolveShot(play, defLineup, offFouls, shooterStamina);

      // Track FGA
      add(shooter.id, 'fgAttempted', 1);
      if (zone === 'THREE') add(shooter.id, 'threeAttempted', 1);
      if (zone === 'RIM')   add(shooter.id, 'rimAttempted', 1);
      if (zone === 'MID')   add(shooter.id, 'midRangeAttempted', 1);

      // Block credit
      if (shot.blocked && shot.blockerId) {
        add(shot.blockerId, 'blocks', 1);
      }

      // ---- Made shot ----
      if (shot.made) {
        add(shooter.id, 'fgMade', 1);
        add(shooter.id, 'points', shot.points);
        if (zone === 'THREE') { add(shooter.id, 'threeMade', 1); }
        if (zone === 'RIM')   { add(shooter.id, 'rimMade', 1); }
        if (zone === 'MID')   { add(shooter.id, 'midRangeMade', 1); }
        if (assister) {
          add(assister.id, 'assists', 1);
          if (zone === 'THREE') add(shooter.id, 'threePointAssisted', 1);
          if (zone === 'RIM')   add(shooter.id, 'rimAssisted', 1);
          if (zone === 'MID')   add(shooter.id, 'midRangeAssisted', 1);
        }
        if (isHome) { homeScore += shot.points; quarterScores[quarter - 1].home += shot.points; }
        else        { awayScore += shot.points; quarterScores[quarter - 1].away += shot.points; }

        // Consecutive FGM tracking
        const s = statsMap.get(shooter.id)!;
        s.consecutiveFieldGoalsMade = (s.consecutiveFieldGoalsMade ?? 0) + 1;

        // Plus/minus
        const ptSwing = shot.points;
        onCourt.home.forEach(id => add(id, 'plusMinus', isHome ? ptSwing : -ptSwing));
        onCourt.away.forEach(id => add(id, 'plusMinus', isHome ? -ptSwing : ptSwing));
      } else {
        const s = statsMap.get(shooter.id)!;
        s.consecutiveFieldGoalsMade = 0;
      }

      // ---- And-1 / Foul free throws ----
      if (shot.ftAttempts > 0) {
        add(shooter.id, 'ftAttempted', shot.ftAttempts);
        const ft = resolveFreeThrows(shooter, shot.ftAttempts);
        add(shooter.id, 'ftMade', ft.made);
        add(shooter.id, 'points', ft.made);

        if (isHome) { homeScore += ft.made; quarterScores[quarter - 1].home += ft.made; }
        else        { awayScore += ft.made; quarterScores[quarter - 1].away += ft.made; }

        // Plus/minus for FT points
        onCourt.home.forEach(id => add(id, 'plusMinus', isHome ? ft.made : -ft.made));
        onCourt.away.forEach(id => add(id, 'plusMinus', isHome ? -ft.made : ft.made));

        // Foul on defense
        if (shot.foul) {
          if (isHome) awayFouls++;
          else        homeFouls++;
          // Credit foul to primary defender
          const foulDef = defLineup.find(p => p.position === shooter.position) ?? defLineup[0];
          add(foulDef.id, 'personalFouls', 1);
        }

        // Missed last FT → rebound
        if (ft.missed > 0) {
          const reb = resolveRebound(offLineup, defLineup);
          if (reb.isOffensive) {
            add(reb.rebounderId, 'offensiveRebounds', 1);
            add(reb.rebounderId, 'rebounds', 1);
          } else {
            add(reb.rebounderId, 'defensiveRebounds', 1);
            add(reb.rebounderId, 'rebounds', 1);
          }
        }
      }

      // ---- Rebound on miss ----
      if (!shot.made && !shot.foul && !shot.blocked) {
        const reb = resolveRebound(offLineup, defLineup);
        if (reb.isOffensive) {
          add(reb.rebounderId, 'offensiveRebounds', 1);
          add(reb.rebounderId, 'rebounds', 1);
        } else {
          add(reb.rebounderId, 'defensiveRebounds', 1);
          add(reb.rebounderId, 'rebounds', 1);
        }
      }

      // Drain stamina
      stamina.set(shooter.id, Math.max(0, (stamina.get(shooter.id) ?? 100) - 1.2));
      stamina.set(handler.id, Math.max(0, (stamina.get(handler.id) ?? 100) - 0.8));
    }

    // Halftime recovery
    if (quarter === 2) {
      allPlayers.forEach(p => {
        p.stamina = Math.min(100, (p.stamina ?? 100) + 40);
        stamina.set(p.id, p.stamina);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Overtime (5-min period = 12 possessions per team)
  // ---------------------------------------------------------------------------
  let otCount = 0;
  while (homeScore === awayScore && otCount < 3) {
    otCount++;
    const homeLineup = buildLineup(homeRoster, 4);
    const awayLineup = buildLineup(awayRoster, 4);
    const homeUsage = calculateUsageWeights(homeLineup);
    const awayUsage  = calculateUsageWeights(awayLineup);

    for (let poss = 0; poss < 24; poss++) {
      const isHome = poss % 2 === 0;
      const offLineup = isHome ? homeLineup : awayLineup;
      const defLineup = isHome ? awayLineup : homeLineup;
      const offUsage  = isHome ? homeUsage  : awayUsage;

      const handler = pickByUsage(offLineup, offUsage);
      const toResult = checkTurnover(handler, defLineup);
      if (toResult.isTurnover) {
        add(handler.id, 'turnovers', 1);
        if (toResult.stealerId) add(toResult.stealerId, 'steals', 1);
        continue;
      }

      const play = selectPlayType(handler, offLineup);
      const shot  = resolveShot(play, defLineup, 4);
      add(play.shooter.id, 'fgAttempted', 1);

      if (shot.made) {
        add(play.shooter.id, 'fgMade', 1);
        add(play.shooter.id, 'points', shot.points);
        if (play.assister) add(play.assister.id, 'assists', 1);
        if (isHome) homeScore += shot.points; else awayScore += shot.points;
      }
      if (shot.ftAttempts > 0) {
        const ft = resolveFreeThrows(play.shooter, shot.ftAttempts);
        add(play.shooter.id, 'ftMade', ft.made);
        add(play.shooter.id, 'points', ft.made);
        if (isHome) homeScore += ft.made; else awayScore += ft.made;
      }
      if (!shot.made) {
        const reb = resolveRebound(offLineup, defLineup);
        add(reb.rebounderId, reb.isOffensive ? 'offensiveRebounds' : 'defensiveRebounds', 1);
        add(reb.rebounderId, 'rebounds', 1);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Assign minutes based on role
  // ---------------------------------------------------------------------------
  homeRoster.forEach(p => {
    const s = statsMap.get(p.id);
    if (s) s.minutes = p.minutes ?? 0;
  });
  awayRoster.forEach(p => {
    const s = statsMap.get(p.id);
    if (s) s.minutes = p.minutes ?? 0;
  });

  // ---------------------------------------------------------------------------
  // Build result
  // ---------------------------------------------------------------------------
  const homeStats: Record<string, PlayerStats> = {};
  const awayStats: Record<string, PlayerStats> = {};

  homeRoster.forEach(p => { const s = statsMap.get(p.id); if (s) homeStats[p.id] = s; });
  awayRoster.forEach(p => { const s = statsMap.get(p.id); if (s) awayStats[p.id] = s; });

  const boxScore: BoxScore = {
    homeStats,
    awayStats,
    homeScore,
    awayScore,
    quarters: quarterScores.map(q => q.home + q.away), // kept for type compat
  };

  const winnerId = homeScore >= awayScore ? homeTeam.id : awayTeam.id;

  return {
    id: `match_${Date.now()}`,
    date: date ?? new Date(),
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    winnerId,
    homeScore,
    awayScore,
    boxScore,
    injuries: [],
    events: [], // Play-by-play removed per user request
  };
}
