import type { Player, Position } from '../models/Player';
import { calculateOverall } from './playerUtils';
import { findValidStartingLineup } from './rotationSolver';

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
 * - Generational Rookies (Age <= 21, POT >= 90): Treated as stars, 35+ mins for development.
 * - Good Players (Starters): ~35 minutes.
 * - Medium Players (Rotation): 20-25 minutes.
 * - Bench/Bad (<70): 0-10 minutes.
 */
export type RotationStrategy = 'Standard' | 'Heavy Starters' | 'Deep Bench' | 'Playoffs' | 'Custom' | number;

/**
 * Helper to interpolate between two values based on a factor (0-1)
 */
const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
};

export const optimizeRotation = (roster: Player[], strategy: RotationStrategy = 'Standard', targetTotal: number = 240): Player[] => {
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

    // Identify Stars (90+ OVR) OR Generational Rookies
    let stars = playersWithOvr.filter(p => 
        p.calculatedOvr >= 90 || 
        (p.age <= 21 && (p.potential || 0) >= 90) // Generational Rookie Logic
    );
    if (stars.length === 0 && playersWithOvr.length > 0) {
        stars = [playersWithOvr[0]];
    }

    const starIds = new Set(stars.map(s => s.id));

    // Use the solver to find the best 5 players that can form a valid starting lineup
    const finalStarters = findValidStartingLineup(playersWithOvr);
    const usedIds = new Set(finalStarters.map(p => p.id));

    // 2. Define Distribution Curve based on Strategy (Numeric)
    // Map string strategies to numbers for backward compatibility
    let sliderValue = 50; // Default Standard
    if (typeof strategy === 'number') {
        sliderValue = Math.max(0, Math.min(100, strategy));
    } else if (strategy === 'Heavy Starters' || strategy === 'Playoffs') {
        sliderValue = 100;
    } else if (strategy === 'Deep Bench') {
        sliderValue = 0;
    }

    const factor = sliderValue / 100; // 0 to 1

    // Interpolate Parameters
    // Scale minute targets based on targetTotal (240 = NBA 48-min game, 200 = Euro 40-min game)
    const gameMinutes = targetTotal / 5; // 48 for NBA, 40 for Euro
    
    // EuroLeague specific distribution (from user screenshot: top players 25-31 MPG)
    const isEuro = targetTotal === 200;
    const starterMinsRange = isEuro ? [gameMinutes * 0.55, gameMinutes * 0.70] : [gameMinutes * 0.625, gameMinutes * 0.833];
    const starMinsRange    = isEuro ? [gameMinutes * 0.65, gameMinutes * 0.80] : [gameMinutes * 0.750, gameMinutes * 0.958];

    const starterMins = Math.round(lerp(starterMinsRange[0], starterMinsRange[1], factor)); 
    const starMins    = Math.round(lerp(starMinsRange[0], starMinsRange[1], factor)); 

    // Bench Curves (Scaling the rest) — proportional to game length
    const s = gameMinutes / 48; // scale factor: 1.0 for NBA, 0.833 for Euro
    const benchDeep  = [20, 18, 14, 10, 8].map(v => Math.round(v * s));
    let   benchHeavy = [10,  6,  4,  2, 0].map(v => Math.round(v * s));

    // Playoff Tightening (7-8 players total: 5 starters + 2-3 bench)
    if (strategy === 'Playoffs') {
        benchHeavy = [Math.round(20 * s), Math.round(12 * s), Math.round(8 * s), 0, 0];
    }

    const benchCurve = benchDeep.map((val, i) => Math.round(lerp(val, benchHeavy[i], factor)));

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
    const benchPool = playersWithOvr.filter(p => !usedIds.has(p.id));
    let minutesRemaining = targetTotal - totalMinutesUsed;

    benchPool.forEach((b, idx) => {
        const originalIndex = players.findIndex(p => p.id === b.id);
        if (originalIndex === -1) return;

        let allocated = 0;
        if (minutesRemaining > 0 && idx < benchCurve.length) {
            allocated = Math.min(minutesRemaining, benchCurve[idx]);
        }

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
            const targetIdx = players.find(p => p.rotationIndex === (i % 8));
            if (targetIdx && targetIdx.minutes < gameMinutes) {
                targetIdx.minutes++;
                minutesRemaining--;
            }
            i++;
            safety++;
        }
    }

    // Safety check for over-allocation (rare with this logic but possible if math rounds up too much)
    // If total > 240, shave off from bench bottom up
    let totalCheck = players.reduce((sum, p) => sum + (p.minutes || 0), 0);
    while (totalCheck > targetTotal) {
        // Find player with minutes > 0, start from bottom of rotation
        const victim = players
            .filter(p => (p.minutes || 0) > 0)
            .sort((a, b) => (b.rotationIndex ?? 0) - (a.rotationIndex ?? 0))[0];

        if (victim) {
            victim.minutes--;
            totalCheck--;
        } else {
            break;
        }
    }

    // Safety clamp (no negative minutes)
    players.forEach(p => { if (p.minutes < 0) p.minutes = 0; });

    return players.sort((a, b) => (a.rotationIndex ?? 999) - (b.rotationIndex ?? 999));
};
