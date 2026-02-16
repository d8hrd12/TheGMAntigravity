import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { MatchResult, MatchInput, TeamRotationData, GameEvent } from './SimulationTypes';
import type { TeamStrategy, PaceType, OffensiveFocus, DefensiveStrategy } from './TacticsTypes';

// --- Configuration ---
export const ENGINE_VERSION = "2.0.0-PossessionBased";

// --- AI Logic ---

/**
 * Determines the best strategy for a team based on their roster stats.
 */
export function determineAIStrategy(roster: Player[]): TeamStrategy {
    // 1. Analyze Roster Strengths
    let total3PT = 0;
    let totalInside = 0;
    let totalPlaymaking = 0;
    let totalDefense = 0;
    let totalAthleticism = 0;

    const rotationPlayers = roster.filter(p => !p.isRetired && p.overall > 65).slice(0, 10); // Top 10 rotation
    const count = rotationPlayers.length || 1;

    rotationPlayers.forEach(p => {
        total3PT += p.attributes.threePointShot;
        totalInside += (p.attributes.finishing + p.attributes.interiorDefense) / 2;
        totalPlaymaking += p.attributes.playmaking;
        totalDefense += (p.attributes.perimeterDefense + p.attributes.interiorDefense) / 2;
        totalAthleticism += p.attributes.athleticism;
    });

    const avg3PT = total3PT / count;
    const avgInside = totalInside / count;
    const avgPlaymaking = totalPlaymaking / count;
    const avgAth = totalAthleticism / count;

    // 2. Select Tactics
    let focus: OffensiveFocus = 'Balanced';
    if (avg3PT > 80 && avg3PT > avgInside) focus = 'Perimeter';
    else if (avgInside > 80 && avgInside > avg3PT) focus = 'Inside';
    else if (avgPlaymaking > 75) focus = 'PickAndRoll';

    let pace: PaceType = 'Normal';
    if (avgAth > 80) pace = 'Fast';
    if (avgAth > 85) pace = 'Seven Seconds';
    if (avgAth < 65) pace = 'Slow';

    let defense: DefensiveStrategy = 'Man-to-Man';
    if (totalDefense / count < 70) defense = 'Zone 2-3'; // Hide bad defenders

    return {
        pace,
        offensiveFocus: focus,
        defense
    };
}

import { simulatePossession, type PossessionContext } from './PossessionEngine';

/**
 * Generates a rotation schedule based on player minute targets (minutes property).
 * Uses a fair-share algorithm to distribute 240 minutes across the game.
 */
function generateRotationFromMinutes(teamId: string, roster: Player[]): TeamRotationData[] {
    // 1. Normalize targets to ensure they sum to 240
    let totalAssigned = roster.reduce((sum, p) => sum + (p.minutes || 0), 0);
    let scale = totalAssigned > 0 ? (240 / totalAssigned) : 1;

    let targets = roster.map(p => ({
        id: p.id,
        target: (p.minutes || 0) * scale,
        played: 0,
        isStarter: p.isStarter
    }));

    // Enforce Max Minutes Cap (e.g. 38 mins) to prevent 48-minute games
    const MAX_MINUTES = 38;
    targets.forEach(t => {
        if (t.target > MAX_MINUTES) t.target = MAX_MINUTES;
    });

    // Re-sum and redistribute if needed (since capping reduces total below 240)
    const cappedTotal = targets.reduce((sum, t) => sum + t.target, 0);
    if (cappedTotal < 240) {
        const diff = 240 - cappedTotal;
        const nonCappedPlayers = targets.filter(t => t.target < MAX_MINUTES && t.target > 0);

        // Distribute proportionally based on existing minutes (rich get richer, but fair)
        // If all non-capped are 0, distribute evenly to them
        const nonCappedTotal = nonCappedPlayers.reduce((sum, t) => sum + t.target, 0);

        if (nonCappedPlayers.length > 0) {
            if (nonCappedTotal > 0) {
                nonCappedPlayers.forEach(t => {
                    const share = t.target / nonCappedTotal;
                    t.target += diff * share;
                });
            } else {
                // Fallback: Even distribution if everyone else is 0
                const share = diff / nonCappedPlayers.length;
                nonCappedPlayers.forEach(t => t.target += share);
            }
        }
    }

    const segments: { quarter: number, start: number, end: number, ids: string[] }[] = [];
    let currentLineup: string[] = [];

    // 2. Schedule minute-by-minute (48 minutes)
    for (let q = 1; q <= 4; q++) {
        for (let m = 12; m > 0; m--) {
            // Pick top 5 based on (Target - Played) + bias for current lineup (stability)
            const candidates = [...targets].sort((a, b) => {
                const deficitA = a.target - a.played;
                const deficitB = b.target - b.played;

                const isOnCourtA = currentLineup.includes(a.id);
                const isOnCourtB = currentLineup.includes(b.id);

                // Priority: Deficit, then stay on court if close, then starter status
                let scoreA = deficitA + (isOnCourtA ? 0.6 : 0);
                let scoreB = deficitB + (isOnCourtB ? 0.6 : 0);

                if (a.isStarter) scoreA += 0.1;
                if (b.isStarter) scoreB += 0.1;

                return scoreB - scoreA;
            });

            const nextLineup = candidates.slice(0, 5).map(c => c.id);
            nextLineup.forEach(id => {
                const t = targets.find(x => x.id === id)!;
                t.played += 1;
            });

            // 3. Collapse identical consecutive minutes into segments
            const lastSeg = segments[segments.length - 1];
            const lineupMatches = lastSeg && JSON.stringify([...lastSeg.ids].sort()) === JSON.stringify([...nextLineup].sort());

            if (!lastSeg || lastSeg.quarter !== q || !lineupMatches) {
                segments.push({
                    quarter: q,
                    start: m,
                    end: m - 1,
                    ids: nextLineup
                });
            } else {
                lastSeg.end = m - 1;
            }
            currentLineup = nextLineup;
        }
    }

    return segments.map((s, i) => ({
        id: `seg_${teamId}_${i}`,
        quarter: s.quarter as any,
        startMinute: s.start,
        endMinute: s.end,
        playerIds: s.ids
    }));
}

function generateNoSubsRotation(teamId: string, roster: Player[]): TeamRotationData[] {
    const starters = roster.filter(p => p.isStarter).map(p => p.id);
    const activeIds = starters.length === 5 ? starters : roster.slice(0, 5).map(p => p.id);
    const schedule: TeamRotationData[] = [];
    for (let q = 1; q <= 4; q++) {
        schedule.push({ id: `nosubs_${teamId}_q${q}`, quarter: q as any, startMinute: 12, endMinute: 0, playerIds: activeIds });
    }
    return schedule;
}

function generateDefaultRotation(teamId: string, roster: Player[]): TeamRotationData[] {
    // Better logic: use minute-based if possible, else pattern
    return generateRotationFromMinutes(teamId, roster);
}

function getLineupForTime(schedule: TeamRotationData[], roster: Player[], quarter: number, minuteOfQuarter: number): Player[] {
    // Find segment that covers this time
    // StartMinute is inclusive/upper bound (e.g. 12.0), EndMinute is exclusive/lower bound (e.g. 6.0)
    // Actually standard is: start > current >= end
    const segment = schedule.find(s => s.quarter === quarter && s.startMinute >= minuteOfQuarter && s.endMinute < minuteOfQuarter);

    // Default to starters if gap found (fallback)
    const starterIds = roster.slice(0, 5).map(p => p.id);
    const activeIds = segment ? segment.playerIds : starterIds;

    // Map to Players
    return activeIds.map(id => roster.find(p => p.id === id) || roster[0]).filter(Boolean);
}
import { StatsAccumulator } from './StatsAccumulator';

export function simulateMatchII(input: MatchInput): MatchResult {
    const { homeTeam, awayTeam, homeRoster, awayRoster, date, userTeamId } = input;

    // 1. Setup Context
    const homeStrategy = homeTeam.tactics || determineAIStrategy(homeRoster);
    const awayStrategy = awayTeam.tactics || determineAIStrategy(awayRoster);
    const accumulator = new StatsAccumulator(homeTeam.id, awayTeam.id, homeRoster, awayRoster);

    // Initial State
    let timeRemaining = 48 * 60; // 2880 seconds
    let homeScore = 0;
    let awayScore = 0;
    let possessionTeam = homeTeam; // Tip-off logic omitted for V1

    // Setup Rotations
    // STRICT ROTATION LOGIC:
    // User Team: Must use 'rotationSchedule' if available.
    // AI Team: Must generate fresh 'Best' rotation (ignoring stale schedule).

    let homeSchedule: TeamRotationData[];
    if (userTeamId && homeTeam.id === userTeamId) {
        if (homeTeam.rotationSchedule && homeTeam.rotationSchedule.length > 0) {
            homeSchedule = homeTeam.rotationSchedule;
        } else if (input.isInteractive) {
            // USER REQUEST: No auto-subs in PLAY mode if no schedule set.
            homeSchedule = generateNoSubsRotation(homeTeam.id, homeRoster);
        } else {
            homeSchedule = generateRotationFromMinutes(homeTeam.id, homeRoster);
        }
    } else {
        homeSchedule = generateDefaultRotation(homeTeam.id, homeRoster);
    }

    let awaySchedule: TeamRotationData[];
    if (userTeamId && awayTeam.id === userTeamId) {
        if (awayTeam.rotationSchedule && awayTeam.rotationSchedule.length > 0) {
            awaySchedule = awayTeam.rotationSchedule;
        } else if (input.isInteractive) {
            awaySchedule = generateNoSubsRotation(awayTeam.id, awayRoster);
        } else {
            awaySchedule = generateRotationFromMinutes(awayTeam.id, awayRoster);
        }
    } else {
        awaySchedule = generateDefaultRotation(awayTeam.id, awayRoster);
    }

    const allEvents: GameEvent[] = [];
    let currentQuarter = 1;

    // 2. Game Loop
    // --- STAMINA SYSTEM INITIALIZATION ---
    [...homeRoster, ...awayRoster].forEach(p => {
        if (p.stamina === undefined) p.stamina = 100;
    });

    const homeOverrides = new Map<string, string>();
    const awayOverrides = new Map<string, string>();

    const applyStaminaLogic = (
        teamRoster: Player[],
        targetLineup: Player[],
        overrides: Map<string, string>
    ): Player[] => {
        // A. Remove Overrides if Recovered
        for (const [originalId, replacementId] of overrides.entries()) {
            const original = teamRoster.find(p => p.id === originalId);
            if (original && original.stamina > 80) {
                overrides.delete(originalId);
            }
        }

        // B. Apply Existing Overrides
        let activeLineup = targetLineup.map(p => {
            if (overrides.has(p.id)) {
                const repId = overrides.get(p.id)!;
                return teamRoster.find(r => r.id === repId) || p;
            }
            return p;
        });

        // C. Check for NEW Fatigue
        activeLineup = activeLineup.map(p => {
            if (p.stamina < 40 && !overrides.has(p.id)) {
                // Find Replacement (Fresh, Best OVR, Diff ID)
                const candidates = teamRoster.filter(bencher =>
                    !activeLineup.find(al => al.id === bencher.id) &&
                    bencher.stamina > 60
                ).sort((a, b) => {
                    const posMatchA = a.position === p.position ? 1 : 0;
                    const posMatchB = b.position === p.position ? 1 : 0;
                    if (posMatchA !== posMatchB) return posMatchB - posMatchA;
                    // Preference to players with remaining minutes? (Complexity)
                    return b.overall - a.overall;
                });

                const substitute = candidates[0];
                if (substitute) {
                    overrides.set(p.id, substitute.id);
                    return substitute;
                }
            }
            return p;
        });

        return activeLineup;
    };

    while (timeRemaining > 0) {
        const isHomeOffense = possessionTeam.id === homeTeam.id;

        // Check for Quarter End
        const boundary = (4 - currentQuarter) * 720;
        if (timeRemaining <= boundary && currentQuarter < 4) {
            allEvents.push({
                type: 'quarter_end' as any,
                text: `End of Quarter ${currentQuarter}`,
                gameTime: timeRemaining,
                possessionId: 0,
                teamId: '',
                playerId: '',
                data: { quarter: currentQuarter }
            });
            currentQuarter++;
            // Reset shot clock conceptually for new quarter

            // --- HALFTIME RECOVERY ---
            if (currentQuarter === 3) {
                // Boost stamina at halftime
                [...homeRoster, ...awayRoster].forEach(p => {
                    p.stamina = Math.min(100, (p.stamina || 100) + 30); // Big boost
                });
            }
        }

        const nextBoundary = (4 - currentQuarter) * 720;

        // ROTATION LOOKUP
        const qtr = currentQuarter;
        const offset = (4 - qtr) * 720;
        const qTime = timeRemaining - offset;
        const minuteOfQuarter = Math.max(0, Math.min(12, qTime / 60));

        let homeTargetLineup = getLineupForTime(homeSchedule, homeRoster, qtr, minuteOfQuarter);
        let awayTargetLineup = getLineupForTime(awaySchedule, awayRoster, qtr, minuteOfQuarter);

        // APPLY OVERRIDES
        const homeLineup = applyStaminaLogic(homeRoster, homeTargetLineup, homeOverrides);
        const awayLineup = applyStaminaLogic(awayRoster, awayTargetLineup, awayOverrides);

        // Build Context
        const ctx: PossessionContext = {
            offenseTeam: isHomeOffense ? homeTeam : awayTeam,
            defenseTeam: isHomeOffense ? awayTeam : homeTeam,
            offenseLineup: isHomeOffense ? homeLineup : awayLineup,
            defenseLineup: isHomeOffense ? awayLineup : homeLineup,
            offenseStrategy: isHomeOffense ? homeStrategy : awayStrategy,
            defenseStrategy: isHomeOffense ? awayStrategy : homeStrategy,
            timeRemaining: timeRemaining,
            shotClock: 24,
            scoreMargin: isHomeOffense ? (homeScore - awayScore) : (awayScore - homeScore),
            quarter: qtr,
            getStats: (id: string) => accumulator.getStats(id)
        };

        // SYNC ACCUMULATOR
        accumulator.setLineups(
            homeTargetLineup.map(p => p.id),
            awayTargetLineup.map(p => p.id)
        );

        // EMIT POSSESSION START (Required for UI lineups to update)
        allEvents.push({
            type: 'possession_start' as any,
            text: `Possession: ${possessionTeam.abbreviation}`,
            gameTime: timeRemaining,
            possessionId: timeRemaining,
            teamId: possessionTeam.id,
            playerId: '',
            data: {
                homeLineup: homeTargetLineup.map(p => p.id),
                awayLineup: awayTargetLineup.map(p => p.id)
            }
        });

        // Run Possession
        const result = simulatePossession(ctx);

        // Ensure we don't skip a quarter boundary
        let actualDuration = result.duration;
        if (timeRemaining - actualDuration < nextBoundary && currentQuarter < 4) {
            actualDuration = Math.max(0, timeRemaining - nextBoundary);
        }

        // --- STAMINA UPDATE ---
        const drain = actualDuration * 0.04; // ~2.4 per min
        const recover = actualDuration * 0.05; // ~3.0 per min

        const updateTeamStamina = (roster: Player[], activeLineup: Player[]) => {
            roster.forEach(p => {
                const isActive = activeLineup.find(al => al.id === p.id);
                if (isActive) {
                    p.stamina = Math.max(0, (p.stamina || 100) - drain);
                } else {
                    p.stamina = Math.min(100, (p.stamina || 100) + recover);
                }
            });
        };

        // Use the lineups from CTX which include overrides
        updateTeamStamina(homeRoster, ctx.offenseLineup); // Rough approx since offense/defense switch, but good enough for general on-court time
        updateTeamStamina(awayRoster, ctx.defenseLineup); // Both lineups are fully active for the possession duration

        // Update State
        timeRemaining -= actualDuration;
        if (timeRemaining < 0) timeRemaining = 0;

        // Process Events & Stats
        result.events.forEach(ev => {
            ev.gameTime = Math.max(timeRemaining, nextBoundary); // Clamp events to end of quarter if they overflowed
            allEvents.push(ev);
            accumulator.processEvent(ev);
        });

        if (isHomeOffense) {
            homeScore += result.points;
            if (result.defensivePoints) awayScore += result.defensivePoints;
        } else {
            awayScore += result.points;
            if (result.defensivePoints) homeScore += result.defensivePoints;
        }

        // Swap Possession
        if (!result.keepPossession || timeRemaining <= nextBoundary) {
            possessionTeam = isHomeOffense ? awayTeam : homeTeam;
        }

        // OVERTIME CHECK
        if (timeRemaining <= 0 && homeScore === awayScore) {
            // Game is tied at 0:00!
            // Add 5 minutes (300 seconds)
            timeRemaining = 300;
            currentQuarter++; // Encodes OT1 as 5, OT2 as 6, etc.

            allEvents.push({
                type: 'quarter_end' as any,
                text: `End of Regulation - TIED at ${homeScore}, going to OVERTIME!`,
                gameTime: 0,
                possessionId: 0,
                teamId: '',
                playerId: '',
                data: { quarter: currentQuarter - 1 }
            });
        }
    }

    // Final Final Event
    allEvents.push({
        type: 'quarter_end' as any,
        text: `End of Game - Final Score: ${homeTeam.abbreviation} ${homeScore} - ${awayTeam.abbreviation} ${awayScore}`,
        gameTime: 0,
        possessionId: 0,
        teamId: '',
        playerId: '',
        data: { quarter: currentQuarter }
    });

    // 3. Finalize
    const boxScore = accumulator.getBoxScore();

    return {
        id: `match_${Date.now()}_v2`,
        date,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        winnerId: homeScore > awayScore ? homeTeam.id : awayTeam.id,
        homeScore,
        awayScore,
        boxScore,
        events: allEvents,
        injuries: []
    };
}
