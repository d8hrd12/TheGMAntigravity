import type { Player, Position } from '../models/Player';
import { calculateOverall } from './playerUtils';

/**
 * Optimizes the rotation for a given list of players.
 * Logic:
 * 1. Find the best player for each of the 5 positions (PG, SG, SF, PF, C) based on OVR.
 * 2. Assign them as Starters with high minutes (e.g., 34-36 mins).
 * 3. Fill the Bench with the remaining best players regardless of position.
 * 4. Distribute remaining minutes to the bench.
 * 5. Ensure total minutes = 240.
 */
/**
 * Optimizes the rotation for a given list of players based on strict tiers.
 * Rules:
 * - Star Players (89+ OVR, or best player if none): 42 minutes.
 * - Good Players (Starters): ~35 minutes.
 * - Medium Players (Rotation): 20-25 minutes.
 * - Bench/Bad (<70): 0-10 minutes.
 */
export type RotationStrategy = 'Standard' | 'Heavy Starters' | 'Deep Bench' | 'Custom';

export const optimizeRotation = (roster: Player[], strategy: RotationStrategy = 'Standard'): Player[] => {
    // Clone roster
    let players = [...roster];

    // Reset settings
    players = players.map(p => ({
        ...p,
        isStarter: false,
        minutes: 0,
        rotationIndex: 999
    }));

    // Calculate OVR for everyone once
    const playersWithOvr = players.map(p => ({
        ...p,
        calculatedOvr: calculateOverall(p)
    })).sort((a, b) => b.calculatedOvr - a.calculatedOvr);

    // Identify Stars (90+)
    // If no 90+, take the top 1 player as a "Force Star" to ensure someone plays high mins
    let stars = playersWithOvr.filter(p => p.calculatedOvr >= 90);
    if (stars.length === 0 && playersWithOvr.length > 0) {
        stars = [playersWithOvr[0]];
    }

    const starIds = new Set(stars.map(s => s.id));

    // Identify Remaining Starters (Best available for remaining positions)
    // We strictly need 5 starters total.
    // Positions priority: C, PF, SF, SG, PG
    const positions: Position[] = ['C', 'PF', 'SF', 'SG', 'PG'];
    const finalStarters: (typeof playersWithOvr[0])[] = [];
    const usedIds = new Set<string>();

    positions.forEach(pos => {
        // Priority 1: It's a Star and plays this position
        let best = stars.find(s => s.position === pos && !usedIds.has(s.id));

        if (!best) {
            // Priority 2: Best remaining player for this position
            best = playersWithOvr.find(p => p.position === pos && !usedIds.has(p.id));
        }

        if (!best) {
            // Priority 3: Best available player regardless of position (approximate match)
            best = playersWithOvr.find(p => !usedIds.has(p.id));
        }

        if (best) {
            finalStarters.push(best);
            usedIds.add(best.id);
        }
    });

    // 2. Define Distribution Curve based on Strategy
    let starterMins = 35;
    let starMins = 38;
    let benchCurve = [20, 16, 12, 10, 5]; // Default

    if (strategy === 'Heavy Starters') {
        starterMins = 38;
        starMins = 42;
        benchCurve = [15, 12, 10, 8, 5]; // Tighter rotation
    } else if (strategy === 'Deep Bench') {
        starterMins = 28;
        starMins = 32;
        benchCurve = [24, 22, 18, 16, 12]; // Deeper rotation
    } else {
        // Standard
        starterMins = 34;
        starMins = 36;
        benchCurve = [22, 18, 14, 12, 4];
    }

    // 3. Allocating Minutes
    let totalMinutesUsed = 0;

    // Apply Starter Minutes
    finalStarters.forEach((s, idx) => {
        const isStar = starIds.has(s.id);
        const mins = isStar ? starMins : starterMins;

        const originalIndex = players.findIndex(p => p.id === s.id);
        if (originalIndex !== -1) {
            players[originalIndex].isStarter = true;
            players[originalIndex].minutes = mins;
            players[originalIndex].rotationIndex = idx;
            totalMinutesUsed += mins;
        }
    });

    // 4. Bench Allocation
    // Remaining minutes = 240 - totalMinutesUsed
    const benchPool = playersWithOvr.filter(p => !usedIds.has(p.id));
    let minutesRemaining = 240 - totalMinutesUsed;

    benchPool.forEach((b, idx) => {
        const originalIndex = players.findIndex(p => p.id === b.id);
        if (originalIndex === -1) return;

        let allocated = 0;

        if (minutesRemaining > 0 && idx < benchCurve.length) {
            allocated = Math.min(minutesRemaining, benchCurve[idx]);
        }

        // Override for Bad Players (<70) cap? 
        // For new strategy system, maybe rely purely on curve.

        players[originalIndex].minutes = allocated;
        players[originalIndex].rotationIndex = 5 + idx;
        minutesRemaining -= allocated;
    });

    // 5. Verification & Adjustment for leftover minutes
    if (minutesRemaining > 0) {
        let i = 0;
        let safety = 0;
        // Distribute round-robin to starters first then top bench
        while (minutesRemaining > 0 && safety < 1000) {
            const targetIdx = players.find(p => p.rotationIndex === (i % 8)); // Top 8 rotation
            if (targetIdx && targetIdx.minutes < 48) {
                targetIdx.minutes++;
                minutesRemaining--;
            }
            i++;
            safety++;
        }
    }

    // Safety clamp (no negative minutes)
    players.forEach(p => { if (p.minutes < 0) p.minutes = 0; });

    return players.sort((a, b) => (a.rotationIndex ?? 999) - (b.rotationIndex ?? 999));
};
