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
    const totalAssigned = roster.reduce((sum, p) => sum + (p.minutes || 0), 0);
    const scale = totalAssigned > 0 ? (240 / totalAssigned) : 1;
    const targets = roster.map(p => ({
        id: p.id,
        target: (p.minutes || 0) * scale,
        played: 0,
        isStarter: p.isStarter
    }));

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

function generateDefaultRotation(teamId: string, roster: Player[]): TeamRotationData[] {
    const schedule: TeamRotationData[] = [];
    const starters = roster.slice(0, 5).map(p => p.id);
    const bench = roster.slice(5, 10).map(p => p.id); // 6th-10th men
    // Fallback if roster is small
    const validBench = bench.length === 5 ? bench : starters;

    // Pattern:
    // Q1: St (12-4), Bn (4-0) -> St 8m
    // Q2: Bn (12-8), St (8-0) -> St 8m
    // Q3: St (12-4), Bn (4-0) -> St 8m
    // Q4: St (12-0)           -> St 12m
    // Total Starters: 36m. Bench: 12m. Better.

    // Q1
    schedule.push({ id: `q1_st`, quarter: 1, startMinute: 12, endMinute: 4, playerIds: starters });
    schedule.push({ id: `q1_bn`, quarter: 1, startMinute: 4, endMinute: 0, playerIds: validBench });

    // Q2
    schedule.push({ id: `q2_bn`, quarter: 2, startMinute: 12, endMinute: 8, playerIds: validBench });
    schedule.push({ id: `q2_st`, quarter: 2, startMinute: 8, endMinute: 0, playerIds: starters });

    // Q3
    schedule.push({ id: `q3_st`, quarter: 3, startMinute: 12, endMinute: 4, playerIds: starters });
    schedule.push({ id: `q3_bn`, quarter: 3, startMinute: 4, endMinute: 0, playerIds: validBench });

    // Q4 (Crunch Time)
    schedule.push({ id: `q4_st`, quarter: 4, startMinute: 12, endMinute: 0, playerIds: starters });

    return schedule;
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
        // Preference: 1. Manual Schedule, 2. Dynamic Minute-Based, 3. Star-Heavy Default
        if (homeTeam.rotationSchedule && homeTeam.rotationSchedule.length > 0) {
            homeSchedule = homeTeam.rotationSchedule;
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
        } else {
            awaySchedule = generateRotationFromMinutes(awayTeam.id, awayRoster);
        }
    } else {
        awaySchedule = generateDefaultRotation(awayTeam.id, awayRoster);
    }

    const allEvents: GameEvent[] = [];
    let currentQuarter = 1;

    // 2. Game Loop
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
        }

        const nextBoundary = (4 - currentQuarter) * 720;

        // ROTATION LOOKUP
        const qtr = currentQuarter;
        const offset = (4 - qtr) * 720;
        const qTime = timeRemaining - offset;
        const minuteOfQuarter = Math.max(0, Math.min(12, qTime / 60));

        const homeTargetLineup = getLineupForTime(homeSchedule, homeRoster, qtr, minuteOfQuarter);
        const awayTargetLineup = getLineupForTime(awaySchedule, awayRoster, qtr, minuteOfQuarter);

        // Build Context
        const ctx: PossessionContext = {
            offenseTeam: isHomeOffense ? homeTeam : awayTeam,
            defenseTeam: isHomeOffense ? awayTeam : homeTeam,
            offenseLineup: isHomeOffense ? homeTargetLineup : awayTargetLineup,
            defenseLineup: isHomeOffense ? awayTargetLineup : homeTargetLineup,
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

        // Run Possession
        const result = simulatePossession(ctx);

        // Ensure we don't skip a quarter boundary
        let actualDuration = result.duration;
        if (timeRemaining - actualDuration < nextBoundary && currentQuarter < 4) {
            actualDuration = Math.max(0, timeRemaining - nextBoundary);
        }

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
    }

    // Final Final Event
    allEvents.push({
        type: 'quarter_end' as any,
        text: "End of Game",
        gameTime: 0,
        possessionId: 0,
        teamId: '',
        playerId: '',
        data: { quarter: 4 }
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
