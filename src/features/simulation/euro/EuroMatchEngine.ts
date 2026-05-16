/**
 * EuroMatchEngine.ts — EuroLeague-exclusive simulation engine
 *
 * Rules & calibration targets (2025-26 EuroLeague):
 *  - 4 × 10-minute quarters (200 total minutes per team)
 *  - Foul-out at 5 personal fouls
 *  - Team foul bonus after 5th team foul per quarter
 *  - ~72 possessions per team per game
 *  - ~85 PPG, ~47.7 FG%, ~35.6 3P%, ~78.5 FT%
 *  - ~12.8 TOV, ~6.2 STL, ~1.3 BLK per game
 *  - Higher OREB% (~31%) vs NBA
 *  - Structured half-court offense: DHO, pin-down, post-up
 */

import type { Player }        from '../../../models/Player';
import type { MatchInput, MatchResult, PlayerStats, BoxScore } from '../SimulationTypes';
import { calculateOverall }   from '../../../utils/playerUtils';
import { EURO, EURO_MINUTES_BY_RANK } from './EuroCalibration';
import { calculateEuroUsageWeights, selectEuroPlayType } from './EuroPlayTypeEngine';
import { resolveEuroShot, resolveEuroFreeThrows }        from './EuroShotResolver';
import { resolveEuroRebound }                             from './EuroReboundEngine';
import { checkEuroTurnover }                              from './EuroTurnoverEngine';
import { getTacticsForStyle } from '../../team/coachGenerator';
import { PACE_MULTIPLIERS }   from '../TacticsTypes';
import type { PaceType }      from '../TacticsTypes';
import { optimizeRotation }   from '../../../utils/rotationUtils';
import { checkInGameInjury }  from '../InjurySystem';
import type { InjuryReport }  from '../SimulationTypes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function blankStats(p: Player): PlayerStats {
  return {
    playerId: p.id,
    name: `${p.firstName} ${p.lastName}`,
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

function pickByUsage(lineup: Player[], weights: Map<string, number>): Player {
  let r = Math.random();
  for (const p of lineup) { r -= (weights.get(p.id) ?? 0); if (r <= 0) return p; }
  return lineup[lineup.length - 1];
}

// ---------------------------------------------------------------------------
// Minute assignment — scaled to 40 minutes (4×10)
// Total across all 5 players on court = 200 minutes
// ---------------------------------------------------------------------------
function assignEuroMinutes(roster: Player[], isPlayoffs = false): void {
  const active = roster.filter(p => !p.isRetired);
  const totalMins = active.reduce((s, p) => s + (p.minutes || 0), 0);
  // If minutes already assigned correctly (sum ~200), respect them
  if (totalMins >= 190 && totalMins <= 210) return;

  const optimized = optimizeRotation(active, isPlayoffs ? 'Playoffs' : 'Standard', 200);
  optimized.forEach(opt => {
    const orig = roster.find(r => r.id === opt.id);
    if (orig) {
      orig.minutes = opt.minutes;
      orig.isStarter = opt.isStarter;
    }
  });
}

// ---------------------------------------------------------------------------
// Rotation tracker — tracks possessions played to enforce minute targets
// EuroLeague: 40-min game → 200 possessions target per team (5 × 40)
// ---------------------------------------------------------------------------
class EuroRotationTracker {
  roster: Player[];
  trackers: Map<string, { target: number; played: number; isStarter: boolean; fouls: number }>;
  totalPossessions: number;

  constructor(roster: Player[], totalPossessions: number, isPlayoffs = false) {
    assignEuroMinutes(roster, isPlayoffs);
    this.totalPossessions = totalPossessions;
    this.roster = roster.filter(p => !p.isRetired && (p.minutes || 0) > 0);
    if (this.roster.length < 5) this.roster = roster.filter(p => !p.isRetired);

    this.trackers = new Map();
    const totalMins = this.roster.reduce((s, p) => s + (p.minutes || 0), 0);
    // Scale so all targets sum to 200 possessions (5 players × 40 min)
    const factor = totalMins > 0 ? 200 / totalMins : 1;

    for (const p of this.roster) {
      const adjMins = (p.minutes || 0) * factor;
      // Scale target possessions to the actual length of this specific game
      // (e.g. if game is 144 total possession ticks, a 40-min player should play 144 ticks)
      const targetPoss = (adjMins / 40) * totalPossessions; 
      this.trackers.set(p.id, {
        target: targetPoss,
        played: 0,
        isStarter: p.isStarter || false,
        fouls: 0,
      });
    }

    // Ensure 5 starters
    const startersCount = Array.from(this.trackers.values()).filter(t => t.isStarter).length;
    if (startersCount < 5) {
      const byMins = [...this.roster].sort((a, b) => (b.minutes || 0) - (a.minutes || 0));
      for (let i = 0; i < 5 && i < byMins.length; i++) {
        this.trackers.get(byMins[i].id)!.isStarter = true;
      }
    }
  }

  /** A player who has fouled out cannot play */
  isFouledOut(playerId: string): boolean {
    return (this.trackers.get(playerId)?.fouls ?? 0) >= EURO.FOUL_OUT_THRESHOLD;
  }

  addFoul(playerId: string): void {
    const t = this.trackers.get(playerId);
    if (t) t.fouls++;
  }

  getLineup(quarter: number, poss: number, isBlowout: boolean): Player[] {
    // Filter out fouled-out players
    const available = this.roster.filter(p => !this.isFouledOut(p.id));
    if (available.length < 5) {
      // Emergency: add least-fouled even if at limit (can't have <5 players)
      const extra = this.roster
        .filter(p => !available.includes(p))
        .sort((a, b) => (this.trackers.get(a.id)?.fouls ?? 0) - (this.trackers.get(b.id)?.fouls ?? 0));
      while (available.length < 5 && extra.length > 0) available.push(extra.shift()!);
    }

    if (isBlowout) {
      const sorted = [...available].sort((a, b) => calculateOverall(a) - calculateOverall(b));
      const lineup = sorted.slice(0, 5);
      lineup.forEach(p => this.trackers.get(p.id)!.played += 1);
      return lineup;
    }

    const candidates = available.map(p => {
      const t = this.trackers.get(p.id)!;
      const remaining = t.target - t.played;
      let priority = remaining;
      // EuroLeague: starters always open Q1 and Q3 (like NBA)
      if ((quarter === 1 || quarter === 3) && poss < 12 && t.isStarter) priority += 1000;
      return { p, priority };
    });

    candidates.sort((a, b) => b.priority - a.priority);
    let eligible = candidates.filter(c => this.trackers.get(c.p.id)!.target - this.trackers.get(c.p.id)!.played > 0);
    if (eligible.length < 5) eligible = candidates;

    const lineup = eligible.slice(0, 5).map(c => c.p);
    lineup.forEach(p => this.trackers.get(p.id)!.played += 1);
    return lineup;
  }
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------
export function simulateEuroMatch(input: MatchInput): MatchResult {
  let { homeTeam, awayTeam, homeRoster, awayRoster, date } = input;

  // --- HOME COURT ADVANTAGE ---
  homeRoster = homeRoster.map(p => ({
    ...p,
    attributes: Object.fromEntries(
      Object.entries(p.attributes).map(([k, v]) => [k, Math.min(99, (v as number) * EURO.HOME_ATTRIBUTE_BOOST)])
    ) as any,
  }));

  // Coach tactics
  const homeTactics = homeTeam.tactics || (input.homeCoach ? getTacticsForStyle(input.homeCoach.style) : undefined);
  const awayTactics = awayTeam.tactics  || (input.awayCoach  ? getTacticsForStyle(input.awayCoach.style)  : undefined);

  // Pace — EL base is ~72 possessions; tactical pace adjusts this
  const homePaceMult = homeTactics ? PACE_MULTIPLIERS[homeTactics.pace as PaceType] : 1.0;
  const awayPaceMult = awayTactics ? PACE_MULTIPLIERS[awayTactics.pace as PaceType] : 1.0;
  const avgPaceMult  = (homePaceMult + awayPaceMult) / 2;
  // 72 total possessions / 4 quarters = 18 per team per quarter → 36 total per quarter
  const POSS_PER_QUARTER = Math.round(18 * avgPaceMult);

  const totalGamePoss = POSS_PER_QUARTER * 4 * 2;
  const homeTracker = new EuroRotationTracker(homeRoster, totalGamePoss, input.isPlayoffs);
  const awayTracker = new EuroRotationTracker(awayRoster, totalGamePoss, input.isPlayoffs);

  // Stats maps
  const statsMap = new Map<string, PlayerStats>();
  [...homeRoster, ...awayRoster].forEach(p => statsMap.set(p.id, blankStats(p)));
  const add = (id: string, field: keyof PlayerStats, val: number) => {
    const s = statsMap.get(id);
    if (s) (s as any)[field] += val;
  };

  // Injury tracking
  const matchInjuries: InjuryReport[] = [];
  const injuredThisGame = new Set<string>();

  // Score tracking
  let homeScore = 0, awayScore = 0;
  const quarterScores = [
    { home: 0, away: 0 }, { home: 0, away: 0 },
    { home: 0, away: 0 }, { home: 0, away: 0 },
  ];

  // +/- tracking
  const onCourt = { home: [] as string[], away: [] as string[] };

  const homeOffBonus = input.homeCoach ? (input.homeCoach.rating.offense - 70) / 100 * 0.03 : 0;
  const homeDefBonus = input.homeCoach ? (input.homeCoach.rating.defense - 70) / 100 * 0.03 : 0;
  const awayOffBonus = input.awayCoach  ? (input.awayCoach.rating.offense  - 70) / 100 * 0.03 : 0;
  const awayDefBonus = input.awayCoach  ? (input.awayCoach.rating.defense  - 70) / 100 * 0.03 : 0;

  // ---------------------------------------------------------------------------
  // GAME LOOP — 4 × 10-minute quarters
  // ---------------------------------------------------------------------------
  for (let quarter = 1; quarter <= 4; quarter++) {
    // Team fouls reset each quarter (bonus after 5th foul)
    let homeFouls = 0, awayFouls = 0;

    const isBlowout = quarter === 4
      && Math.abs(homeScore - awayScore) >= 22
      && !input.isPlayoffs;

    // Stamina per player this quarter
    const stamina = new Map<string, number>();
    [...homeRoster, ...awayRoster].forEach(p => stamina.set(p.id, p.stamina ?? 100));

    // Clutch pressure (Q4, close game)
    const isClutch = quarter === 4 && Math.abs(homeScore - awayScore) <= 6;

    for (let poss = 0; poss < POSS_PER_QUARTER * 2; poss++) {
      const isHome = poss % 2 === 0;

      const homeLineup = homeTracker.getLineup(quarter, poss, isBlowout);
      const awayLineup  = awayTracker.getLineup(quarter, poss, isBlowout);
      onCourt.home = homeLineup.map(p => p.id);
      onCourt.away = awayLineup.map(p => p.id);

      const homeUsage = calculateEuroUsageWeights(homeLineup);
      const awayUsage  = calculateEuroUsageWeights(awayLineup);

      const offLineup   = isHome ? homeLineup  : awayLineup;
      const defLineup   = isHome ? awayLineup  : homeLineup;
      const offUsage    = isHome ? homeUsage   : awayUsage;
      const defTracker  = isHome ? awayTracker : homeTracker;
      const offTracker  = isHome ? homeTracker : awayTracker;

      const offTactics  = isHome ? homeTactics : awayTactics;
      const defTactics  = isHome ? awayTactics : homeTactics;
      const offOffBonus = isHome ? homeOffBonus : awayOffBonus;
      const offDefBonus = isHome ? awayDefBonus : homeDefBonus;

      // Team fouls for this possession's defending team
      const teamFoulsOnDef = isHome ? awayFouls : homeFouls;

      // ---- Select ball handler ----
      const handler = pickByUsage(offLineup, offUsage);
      const handlerStamina = stamina.get(handler.id) ?? 100;

      // ---- Turnover check ----
      const toResult = checkEuroTurnover(
        handler, defLineup, handlerStamina,
        defTactics?.defense, handler.morale ?? 50
      );
      if (toResult.isTurnover) {
        add(handler.id, 'turnovers', 1);
        if (toResult.isSteal && toResult.stealerId) add(toResult.stealerId, 'steals', 1);
        stamina.set(handler.id, Math.max(0, handlerStamina - 1.2));
        continue;
      }

      // ---- Select play type (EuroLeague structured offense) ----
      const play = selectEuroPlayType(handler, offLineup, offTactics?.offensiveFocus);
      const { shooter, assister, zone } = play;
      const shooterStamina = stamina.get(shooter.id) ?? 100;
      const pressure = isClutch ? 0.6 : 0;

      // ---- Shot resolution ----
      const shot = resolveEuroShot(
        play, defLineup, teamFoulsOnDef,
        shooterStamina, offOffBonus, offDefBonus,
        defTactics?.defense, shooter.morale ?? 50, isHome
      );

      // Track attempts
      add(shooter.id, 'fgAttempted', 1);
      if (zone === 'THREE') add(shooter.id, 'threeAttempted', 1);
      if (zone === 'RIM')   add(shooter.id, 'rimAttempted', 1);
      if (zone === 'MID')   add(shooter.id, 'midRangeAttempted', 1);

      // Block credit
      if (shot.blocked && shot.blockerId) add(shot.blockerId, 'blocks', 1);

      // ---- Made shot ----
      if (shot.made) {
        add(shooter.id, 'fgMade', 1);
        add(shooter.id, 'points', shot.points);
        if (zone === 'THREE') add(shooter.id, 'threeMade', 1);
        if (zone === 'RIM')   add(shooter.id, 'rimMade', 1);
        if (zone === 'MID')   add(shooter.id, 'midRangeMade', 1);
        if (assister) {
          add(assister.id, 'assists', 1);
          if (zone === 'THREE') add(shooter.id, 'threePointAssisted', 1);
          if (zone === 'RIM')   add(shooter.id, 'rimAssisted', 1);
          if (zone === 'MID')   add(shooter.id, 'midRangeAssisted', 1);
        }
        if (isHome) { homeScore += shot.points; quarterScores[quarter-1].home += shot.points; }
        else        { awayScore += shot.points;  quarterScores[quarter-1].away += shot.points;  }

        const s = statsMap.get(shooter.id)!;
        s.consecutiveFieldGoalsMade = (s.consecutiveFieldGoalsMade ?? 0) + 1;

        // +/-
        const sw = shot.points;
        onCourt.home.forEach(id => add(id, 'plusMinus', isHome ? sw : -sw));
        onCourt.away.forEach(id => add(id, 'plusMinus', isHome ? -sw : sw));
      } else {
        statsMap.get(shooter.id)!.consecutiveFieldGoalsMade = 0;
      }

      // ---- Free throws ----
      if (shot.ftAttempts > 0) {
        add(shooter.id, 'ftAttempted', shot.ftAttempts);
        const ft = resolveEuroFreeThrows(shooter, shot.ftAttempts, pressure);
        add(shooter.id, 'ftMade', ft.made);
        add(shooter.id, 'points', ft.made);
        if (isHome) { homeScore += ft.made; quarterScores[quarter-1].home += ft.made; }
        else        { awayScore += ft.made;  quarterScores[quarter-1].away += ft.made;  }

        onCourt.home.forEach(id => add(id, 'plusMinus', isHome ?  ft.made : -ft.made));
        onCourt.away.forEach(id => add(id, 'plusMinus', isHome ? -ft.made :  ft.made));

        // Personal foul on defender — track for foul-out
        if (shot.foul && shot.foulDefenderId) {
          add(shot.foulDefenderId, 'personalFouls', 1);
          defTracker.addFoul(shot.foulDefenderId);
          if (isHome) awayFouls++; else homeFouls++;
        }

        // Missed last FT → rebound
        if (ft.missed > 0) {
          const isLong = false; // FT misses are short rebounds
          const reb = resolveEuroRebound(offLineup, defLineup, isLong);
          add(reb.rebounderId, reb.isOffensive ? 'offensiveRebounds' : 'defensiveRebounds', 1);
          add(reb.rebounderId, 'rebounds', 1);
        }
      }

      // ---- Foul with no FT (non-shooting foul) — only counts toward team fouls ----
      if (shot.foul && shot.ftAttempts === 0 && shot.foulDefenderId) {
        add(shot.foulDefenderId, 'personalFouls', 1);
        defTracker.addFoul(shot.foulDefenderId);
        if (isHome) awayFouls++; else homeFouls++;
      }

      // ---- Rebound on miss ----
      if (!shot.made && !shot.foul && !shot.blocked) {
        const isLong = zone === 'THREE';
        const reb = resolveEuroRebound(offLineup, defLineup, isLong);
        add(reb.rebounderId, reb.isOffensive ? 'offensiveRebounds' : 'defensiveRebounds', 1);
        add(reb.rebounderId, 'rebounds', 1);
      }
      // Block → also a rebound
      if (shot.blocked) {
        const reb = resolveEuroRebound(offLineup, defLineup, false);
        add(reb.rebounderId, reb.isOffensive ? 'offensiveRebounds' : 'defensiveRebounds', 1);
        add(reb.rebounderId, 'rebounds', 1);
      }

      // Drain stamina (EL 10-min quarters → slightly less drain per poss)
      stamina.set(shooter.id, Math.max(0, (stamina.get(shooter.id) ?? 100) - 1.0));
      stamina.set(handler.id, Math.max(0, (stamina.get(handler.id) ?? 100) - 0.7));

      // ---- In-game injury check (very rare, ~0.008% per possession) ----
      // Only check shooter and handler to keep it fast
      for (const candidate of [shooter, handler]) {
        if (injuredThisGame.has(candidate.id)) continue;
        const inj = checkInGameInjury(candidate, stamina.get(candidate.id) ?? 100, 'EURO');
        if (inj) {
          injuredThisGame.add(candidate.id);
          const returnDate = new Date(date ?? new Date());
          returnDate.setDate(returnDate.getDate() + inj.gamesRemaining);
          matchInjuries.push({
            playerId: candidate.id,
            type: inj.type,
            severity: inj.severity,
            returnDate,
            gamesRemaining: inj.gamesRemaining,
          });
          break; // one in-game injury per possession max
        }
      }
    }

    // Halftime recovery (after Q2)
    if (quarter === 2) {
      [...homeRoster, ...awayRoster].forEach(p => {
        p.stamina = Math.min(100, (p.stamina ?? 100) + 38);
        stamina.set(p.id, p.stamina);
      });
    }
    // Short break between Q1/Q3 and Q2/Q4
    if (quarter === 1 || quarter === 3) {
      [...homeRoster, ...awayRoster].forEach(p => {
        p.stamina = Math.min(100, (p.stamina ?? 100) + 12);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // OVERTIME — 5-minute extra periods (~10 possessions per team)
  // EuroLeague: no foul-out reset in OT, team fouls reset to 0
  // ---------------------------------------------------------------------------
  let otCount = 0;
  while (homeScore === awayScore && otCount < 3) {
    otCount++;
    const otHomeFouls = 0, otAwayFouls = 0;
    const OT_POSS = EURO.OT_POSSESSIONS_PER_TEAM; // 10

    for (let poss = 0; poss < OT_POSS * 2; poss++) {
      const isHome = poss % 2 === 0;
      const homeLineup = homeTracker.getLineup(4, 50 + poss, false);
      const awayLineup  = awayTracker.getLineup(4, 50 + poss, false);

      const homeUsage = calculateEuroUsageWeights(homeLineup);
      const awayUsage  = calculateEuroUsageWeights(awayLineup);

      const offLineup = isHome ? homeLineup : awayLineup;
      const defLineup = isHome ? awayLineup : homeLineup;
      const offUsage  = isHome ? homeUsage  : awayUsage;
      const defTracker = isHome ? awayTracker : homeTracker;
      const teamFoulsOnDef = isHome ? otAwayFouls : otHomeFouls;

      const offTactics  = isHome ? homeTactics : awayTactics;
      const defTactics  = isHome ? awayTactics : homeTactics;
      const offOffBonus = isHome ? homeOffBonus : awayOffBonus;
      const offDefBonus = isHome ? awayDefBonus : homeDefBonus;

      const handler = pickByUsage(offLineup, offUsage);
      const toResult = checkEuroTurnover(handler, defLineup, 100, defTactics?.defense, handler.morale ?? 50);
      if (toResult.isTurnover) {
        add(handler.id, 'turnovers', 1);
        if (toResult.stealerId) add(toResult.stealerId, 'steals', 1);
        continue;
      }

      const play = selectEuroPlayType(handler, offLineup, offTactics?.offensiveFocus);
      const shot  = resolveEuroShot(play, defLineup, teamFoulsOnDef, 100, offOffBonus, offDefBonus, defTactics?.defense, play.shooter.morale ?? 50, isHome);
      add(play.shooter.id, 'fgAttempted', 1);
      if (play.zone === 'THREE') add(play.shooter.id, 'threeAttempted', 1);

      if (shot.made) {
        add(play.shooter.id, 'fgMade', 1);
        add(play.shooter.id, 'points', shot.points);
        if (play.assister) add(play.assister.id, 'assists', 1);
        if (play.zone === 'THREE') add(play.shooter.id, 'threeMade', 1);
        if (isHome) homeScore += shot.points; else awayScore += shot.points;
      }
      if (shot.ftAttempts > 0) {
        const ft = resolveEuroFreeThrows(play.shooter, shot.ftAttempts, 0.8);
        add(play.shooter.id, 'ftMade', ft.made);
        add(play.shooter.id, 'points', ft.made);
        if (isHome) homeScore += ft.made; else awayScore += ft.made;
        if (shot.foulDefenderId) {
          add(shot.foulDefenderId, 'personalFouls', 1);
          defTracker.addFoul(shot.foulDefenderId);
        }
      }
      if (!shot.made) {
        const reb = resolveEuroRebound(offLineup, defLineup, play.zone === 'THREE');
        add(reb.rebounderId, reb.isOffensive ? 'offensiveRebounds' : 'defensiveRebounds', 1);
        add(reb.rebounderId, 'rebounds', 1);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Minutes assignment — scale possessions played to 40-minute game
  // 200 total possessions per team → each poss = 0.2 minutes
  // ---------------------------------------------------------------------------
  homeRoster.forEach(p => {
    const s = statsMap.get(p.id);
    const tracker = homeTracker.trackers.get(p.id);
    if (s && tracker) {
      // Correct minutes calculation: percentage of possession ticks played * 40
      s.minutes = Math.round((tracker.played / totalGamePoss) * 40);
    }
  });
  awayRoster.forEach(p => {
    const s = statsMap.get(p.id);
    const tracker = awayTracker.trackers.get(p.id);
    if (s && tracker) {
      s.minutes = Math.round((tracker.played / totalGamePoss) * 40);
    }
  });

  // ---------------------------------------------------------------------------
  // Build result
  // ---------------------------------------------------------------------------
  const homeStats: Record<string, PlayerStats> = {};
  const awayStats: Record<string, PlayerStats>  = {};
  homeRoster.forEach(p => { const s = statsMap.get(p.id); if (s) homeStats[p.id] = s; });
  awayRoster.forEach(p  => { const s = statsMap.get(p.id);  if (s) awayStats[p.id]  = s; });

  const boxScore: BoxScore = {
    homeStats, awayStats, homeScore, awayScore,
    quarters: quarterScores.map(q => q.home + q.away),
  };

  return {
    id: `euro_match_${Date.now()}`,
    date: date ?? new Date(),
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    winnerId: homeScore >= awayScore ? homeTeam.id : awayTeam.id,
    homeScore, awayScore,
    boxScore,
    injuries: matchInjuries,
    events: [],
  };
}
