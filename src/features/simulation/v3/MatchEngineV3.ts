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
import type { MatchInput, MatchResult, PlayerStats, BoxScore, GameEvent, InjuryReport } from '../SimulationTypes';
import { calculateOverall }    from '../../../utils/playerUtils';
import { NBA, MINUTES_BY_RANK } from './Calibration';
import { calculateUsageWeights, selectPlayType } from './PlayTypeEngine';
import { resolveShot, resolveFreeThrows }         from './ShotResolver';
import { resolveRebound }                          from './ReboundEngine';
import { checkTurnover }                           from './TurnoverEngine';
import { getTacticsForStyle } from '../../team/coachGenerator';
import { PACE_MULTIPLIERS } from '../TacticsTypes';
import type { PaceType } from '../TacticsTypes';
import { optimizeRotation } from '../../../utils/rotationUtils';
import { checkInGameInjury } from '../InjurySystem';
import type { InjuryInstance } from '../InjurySystem';

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

class TeamRotationTracker {
    roster: Player[];
    trackers: Map<string, { target: number; played: number; isStarter: boolean }>;

    constructor(roster: Player[], isPlayoffs: boolean = false) {
        assignMinutes(roster, isPlayoffs);
        this.roster = roster.filter(p => !p.isRetired && p.minutes && p.minutes > 0 && !p.injury);
        if (this.roster.length < 5) this.roster = roster.filter(p => !p.isRetired && !p.injury);
        
        this.trackers = new Map();
        const totalMins = this.roster.reduce((sum, p) => sum + (p.minutes || 0), 0);
        const factor = totalMins > 0 ? 240 / totalMins : 1;

        for (const p of this.roster) {
            const adjMins = (p.minutes || 0) * factor;
            const targetPoss = (adjMins / 48) * 200;
            this.trackers.set(p.id, { target: targetPoss, played: 0, isStarter: p.isStarter || false });
        }
        
        const startersCount = Array.from(this.trackers.values()).filter(t => t.isStarter).length;
        if (startersCount < 5) {
            const sortedByMins = [...this.roster].sort((a, b) => (b.minutes || 0) - (a.minutes || 0));
            for (let i = 0; i < 5 && i < sortedByMins.length; i++) {
                this.trackers.get(sortedByMins[i].id)!.isStarter = true;
            }
        }
    }

    getLineup(quarter: number, possessionInQuarter: number, isBlowout: boolean): Player[] {
        if (isBlowout) {
             const available = [...this.roster].sort((a, b) => calculateOverall(a) - calculateOverall(b));
             const lineup = available.slice(0, 5);
             lineup.forEach(p => this.trackers.get(p.id)!.played += 1);
             return lineup;
        }

        const candidates = this.roster.map(p => {
             const t = this.trackers.get(p.id)!;
             const remaining = t.target - t.played;
             let priority = remaining;
             if ((quarter === 1 || quarter === 3) && possessionInQuarter < 15 && t.isStarter) {
                 priority += 1000; 
             }
             return { p, priority, remaining };
        });

        let eligible = candidates.filter(c => c.remaining > 0).sort((a, b) => b.priority - a.priority);
        if (eligible.length < 5) eligible = candidates.sort((a, b) => b.priority - a.priority);

        const lineup = eligible.slice(0, 5).map(c => c.p);
        lineup.forEach(p => this.trackers.get(p.id)!.played += 1);
        return lineup;
    }

    handleInjury(playerId: string) {
        this.roster = this.roster.filter(p => p.id !== playerId);
        this.trackers.delete(playerId);
    }
}

/** Assign minutes based on role rank — only for players without pre-set minutes */
function assignMinutes(roster: Player[], isPlayoffs?: boolean): void {
  const active = roster.filter(p => !p.isRetired);
  
  // Check if this roster already has exactly 240 minutes assigned AND no injured player has minutes
  const totalMinutes = active.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const anyInjuredWithMinutes = active.some(p => p.injury && (p.minutes || 0) > 0);
  
  if (totalMinutes === 240 && !anyInjuredWithMinutes) {
    // Minutes are already set perfectly, respect them
    return;
  }
  
  // Use AI logic to allocate exactly 240 minutes based on Coach/Strategy
  const optimized = optimizeRotation(active, isPlayoffs ? 'Playoffs' : 'Standard');
  
  // Apply the optimized minutes back to the original objects
  optimized.forEach(optPlayer => {
      const origPlayer = roster.find(r => r.id === optPlayer.id);
      if (origPlayer) {
          origPlayer.minutes = optPlayer.minutes;
          origPlayer.isStarter = optPlayer.isStarter;
      }
  });
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
export function simulateMatchV3(input: MatchInput): MatchResult {
  let { homeTeam, awayTeam, homeRoster, awayRoster, date } = input;

  // --- HOME COURT ADVANTAGE (EURO ONLY) ---
  // In Europe, home court is a massive factor. We apply a +5% boost to all attributes.
  if (input.leagueType === 'EURO') {
    homeRoster = homeRoster.map(p => ({
      ...p,
      attributes: {
        ...p.attributes,
        finishing: Math.min(99, p.attributes.finishing * 1.05),
        midRange: Math.min(99, p.attributes.midRange * 1.05),
        threePointShot: Math.min(99, p.attributes.threePointShot * 1.05),
        freeThrow: Math.min(99, p.attributes.freeThrow * 1.05),
        ballHandling: Math.min(99, p.attributes.ballHandling * 1.05),
        playmaking: Math.min(99, p.attributes.playmaking * 1.05),
        offensiveRebounding: Math.min(99, p.attributes.offensiveRebounding * 1.05),
        defensiveRebounding: Math.min(99, p.attributes.defensiveRebounding * 1.05),
        interiorDefense: Math.min(99, p.attributes.interiorDefense * 1.05),
        perimeterDefense: Math.min(99, p.attributes.perimeterDefense * 1.05),
        blocking: Math.min(99, p.attributes.blocking * 1.05),
        stealing: Math.min(99, p.attributes.stealing * 1.05),
        athleticism: Math.min(99, p.attributes.athleticism * 1.05),
        basketballIQ: Math.min(99, p.attributes.basketballIQ * 1.05),
      }
    }));
  }

  const homeTracker = new TeamRotationTracker(homeRoster, input.isPlayoffs);
  const awayTracker = new TeamRotationTracker(awayRoster, input.isPlayoffs);

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
  
  // Injury tracking
  const matchInjuries: InjuryReport[] = [];
  const injuredThisGame = new Set<string>();

  // Team foul counters (reset each quarter)
  let homeFouls = 0;
  let awayFouls = 0;

  // PlusMinus tracking: who is on court during each point swing
  const onCourt = { home: [] as string[], away: [] as string[] };
  
  // Track stamina per player (starts at 100, drains with activity)
  const stamina = new Map<string, number>();
  [...homeRoster, ...awayRoster].forEach(p => stamina.set(p.id, p.stamina ?? 100));

  // ---------------------------------------------------------------------------
  // GAME LOOP: 4 quarters × possessions
  // ---------------------------------------------------------------------------
  
  // Extract tactics and coach bonuses
  const homeTactics = input.homeTeam.tactics || (input.homeCoach ? getTacticsForStyle(input.homeCoach.style) : undefined);
  const awayTactics = input.awayTeam.tactics || (input.awayCoach ? getTacticsForStyle(input.awayCoach.style) : undefined);
  
  const homePaceMult = homeTactics ? PACE_MULTIPLIERS[homeTactics.pace as PaceType] : 1.0;
  const awayPaceMult = awayTactics ? PACE_MULTIPLIERS[awayTactics.pace as PaceType] : 1.0;
  
  const avgPaceMult = (homePaceMult + awayPaceMult) / 2;
  const POSS_PER_QUARTER = Math.round(25 * avgPaceMult);

  const homeOffBonus = input.homeCoach ? (input.homeCoach.rating.offense - 70) / 100 * 0.03 : 0;
  const homeDefBonus = input.homeCoach ? (input.homeCoach.rating.defense - 70) / 100 * 0.03 : 0;
  const awayOffBonus = input.awayCoach ? (input.awayCoach.rating.offense - 70) / 100 * 0.03 : 0;
  const awayDefBonus = input.awayCoach ? (input.awayCoach.rating.defense - 70) / 100 * 0.03 : 0;

  for (let quarter = 1; quarter <= 4; quarter++) {
    homeFouls = 0;
    awayFouls = 0;

    const isBlowout = quarter === 4 && Math.abs(homeScore - awayScore) >= 25 && !input.isPlayoffs;

    // Track stamina per player this quarter (starts at 100, drains with activity)

    for (let poss = 0; poss < POSS_PER_QUARTER * 2; poss++) {
      const isHome = poss % 2 === 0;

      // GET LINEUP FOR THIS POSSESSION
      const homeLineup = homeTracker.getLineup(quarter, poss, isBlowout);
      const awayLineup = awayTracker.getLineup(quarter, poss, isBlowout);

      onCourt.home = homeLineup.map(p => p.id);
      onCourt.away = awayLineup.map(p => p.id);

      const homeUsage = calculateUsageWeights(homeLineup);
      const awayUsage = calculateUsageWeights(awayLineup);

      const offLineup  = isHome ? homeLineup  : awayLineup;
      const defLineup  = isHome ? awayLineup  : homeLineup;
      const offUsage   = isHome ? homeUsage   : awayUsage;
      const offFouls   = isHome ? homeFouls   : awayFouls;
      
      const offTactics = isHome ? homeTactics : awayTactics;
      const defTactics = isHome ? awayTactics : homeTactics;
      
      const offCoachBonus = isHome ? homeOffBonus : awayOffBonus;
      const defCoachBonus = isHome ? awayDefBonus : homeDefBonus;

      // Select ball handler by usage weight
      const handler = pickByUsage(offLineup, offUsage);
      const handlerStamina = stamina.get(handler.id) ?? 100;
      const handlerMorale = handler.morale ?? 50;

      // ---- Turnover check ----
      const toResult = checkTurnover(handler, defLineup, handlerStamina, defTactics?.defense, handlerMorale);
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
      const play = selectPlayType(handler, offLineup, false, offTactics?.offensiveFocus);
      const { shooter, assister, zone } = play;
      const shooterStamina = stamina.get(shooter.id) ?? 100;
      const shooterMorale = shooter.morale ?? 50;

      // ---- Shot resolution ----
      const shot = resolveShot(play, defLineup, offFouls, shooterStamina, offCoachBonus, defCoachBonus, defTactics?.defense, shooterMorale);

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

      // ---- In-Game Injury Roll ----
      const possibleInjured = [handler, shooter];
      for (const p of possibleInjured) {
          if (injuredThisGame.has(p.id)) continue;
          const currentStamina = stamina.get(p.id) ?? 100;
          const injuryInstance = checkInGameInjury(p, 100 - currentStamina);
          if (injuryInstance) {
              injuredThisGame.add(p.id);
              const returnDate = new Date(date || new Date());
              returnDate.setDate(returnDate.getDate() + (injuryInstance.gamesRemaining * 3));
              
              matchInjuries.push({
                  playerId: p.id,
                  type: injuryInstance.type,
                  severity: injuryInstance.severity,
                  returnDate,
                  gamesRemaining: injuryInstance.gamesRemaining
              });

              p.injury = {
                  type: injuryInstance.type,
                  severity: injuryInstance.severity,
                  returnDate,
                  gamesRemaining: injuryInstance.gamesRemaining
              };

              if (isHome) homeTracker.handleInjury(p.id);
              else awayTracker.handleInjury(p.id);
          }
      }
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
    for (let poss = 0; poss < 24; poss++) {
      const isHome = poss % 2 === 0;

      const homeLineup = homeTracker.getLineup(4, 50 + poss, false);
      const awayLineup = awayTracker.getLineup(4, 50 + poss, false);

      const homeUsage = calculateUsageWeights(homeLineup);
      const awayUsage = calculateUsageWeights(awayLineup);

      const offLineup = isHome ? homeLineup : awayLineup;
      const defLineup = isHome ? awayLineup : homeLineup;
      const offUsage  = isHome ? homeUsage  : awayUsage;

      const offTactics = isHome ? homeTactics : awayTactics;
      const defTactics = isHome ? awayTactics : homeTactics;
      
      const offCoachBonus = isHome ? homeOffBonus : awayOffBonus;
      const defCoachBonus = isHome ? awayDefBonus : homeDefBonus;

      const handler = pickByUsage(offLineup, offUsage);
      const toResult = checkTurnover(handler, defLineup, 100, defTactics?.defense, handler.morale ?? 50);
      if (toResult.isTurnover) {
        add(handler.id, 'turnovers', 1);
        if (toResult.stealerId) add(toResult.stealerId, 'steals', 1);
        continue;
      }

      const play = selectPlayType(handler, offLineup, false, offTactics?.offensiveFocus);
      const shot  = resolveShot(play, defLineup, 4, 100, offCoachBonus, defCoachBonus, defTactics?.defense, play.shooter.morale ?? 50);
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
    const played = homeTracker.trackers.get(p.id)?.played || 0;
    if (s) s.minutes = Math.round((played / 200) * 48);
  });
  awayRoster.forEach(p => {
    const s = statsMap.get(p.id);
    const played = awayTracker.trackers.get(p.id)?.played || 0;
    if (s) s.minutes = Math.round((played / 200) * 48);
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
    injuries: matchInjuries,
    events: [], // Play-by-play removed per user request
  };
}
