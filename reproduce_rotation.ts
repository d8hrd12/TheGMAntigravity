
// Types
interface Player {
    id: string;
    firstName: string;
    lastName: string;
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    attributes: any;
    overall: number; // Use explicit overall for test
    isStarter?: boolean;
    minutes?: number;
    rotationIndex?: number;
    teamId: string;
}

type RotationStrategy = 'Standard' | 'Heavy Starters' | 'Deep Bench' | number;

// Logic Inline (Copied from rotationUtils.ts update)
const optimizeRotation = (roster: Player[], strategy: RotationStrategy = 'Standard'): Player[] => {
    let players = [...roster]; // Clone

    // Reset settings
    players = players.map(p => ({
        ...p,
        isStarter: false,
        minutes: 0,
        rotationIndex: 999
    }));

    // Check if overall is present, else use 0 (mock)
    const playersWithOvr = players.sort((a, b) => b.overall - a.overall);

    // Identify Stars (90+)
    let stars = playersWithOvr.filter(p => p.overall >= 90);
    if (stars.length === 0 && playersWithOvr.length > 0) {
        stars = [playersWithOvr[0]];
    }

    const starIds = new Set(stars.map(s => s.id));
    const positions: ('C' | 'PF' | 'SF' | 'SG' | 'PG')[] = ['C', 'PF', 'SF', 'SG', 'PG'];
    const finalStarters: Player[] = [];
    const usedIds = new Set<string>();

    positions.forEach(pos => {
        let best = stars.find(s => s.position === pos && !usedIds.has(s.id));
        if (!best) best = playersWithOvr.find(p => p.position === pos && !usedIds.has(p.id));
        if (!best) best = playersWithOvr.find(p => !usedIds.has(p.id));

        if (best) {
            finalStarters.push(best);
            usedIds.add(best.id);
        }
    });

    // 2. Define Distribution Curve based on Strategy/Depth
    // Slider Logic: 0 (Deep) -> 50 (Standard) -> 100 (Heavy)

    // Map Strategy String to Depth Number for backward compatibility
    let depth = 50; // Default Standard
    if (typeof strategy === 'number') {
        depth = strategy;
    } else if (strategy === 'Heavy Starters') {
        depth = 85;
    } else if (strategy === 'Deep Bench') {
        depth = 15;
    }

    // Clamp depth 0-100
    depth = Math.max(0, Math.min(100, depth));

    // Linear Interpolation Helper
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    const t = depth / 100; // 0.0 to 1.0

    // Define target minutes for Depth 0 (Deep) vs Depth 100 (Heavy)
    // Deep: Starters 28, Stars 32. Bench: [24, 22, 18, 16, 12]
    // Heavy: Starters 38, Stars 42. Bench: [15, 12, 10, 8, 5]

    // Interpolated Values
    const starterMins = Math.round(lerp(28, 40, t));
    const starMins = Math.round(lerp(32, 44, t));

    // Interpolate Bench Curve
    // Deep Curve: [24, 22, 18, 16, 12]
    // Heavy Curve: [12, 10, 8, 5, 4]
    const benchCurveDeep = [24, 22, 18, 16, 12];
    const benchCurveHeavy = [12, 10, 8, 5, 4];

    const benchCurve = benchCurveDeep.map((val, i) => {
        return Math.round(lerp(val, benchCurveHeavy[i], t));
    });

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
            // Prioritize bench curve, but don't exceed remaining
            allocated = Math.min(minutesRemaining, benchCurve[idx]);
        }

        players[originalIndex].minutes = allocated;
        players[originalIndex].rotationIndex = 5 + idx;
        minutesRemaining -= allocated;
    });

    // 5. Verification & Adjustment for leftover minutes (or deficit)
    if (minutesRemaining > 0) {
        let i = 0;
        let safety = 0;
        // Distribute round-robin to starters first then top bench
        while (minutesRemaining > 0 && safety < 1000) {
            const targetIdx = players.find(p => p.rotationIndex === (i % 8)); // Top 8 rotation
            if (targetIdx && targetIdx.minutes! < 48) {
                targetIdx.minutes!++;
                minutesRemaining--;
            }
            i++;
            safety++;
        }
    } else if (minutesRemaining < 0) {
        // Remove minutes from end of bench up
        let i = players.length - 1;
        while (minutesRemaining < 0 && i >= 0) {
            if (players[i].minutes! > 0) {
                players[i].minutes!--;
                minutesRemaining++;
            } else {
                i--;
            }
        }
    }

    return players.sort((a, b) => (a.rotationIndex ?? 999) - (b.rotationIndex ?? 999));
};


// --- RUN TEST CASES ---

const roster: Player[] = [
    { id: '1', firstName: 'Luka', lastName: 'Doncic', position: 'PG', overall: 95, attributes: {}, teamId: 't1' },
    { id: '2', firstName: 'LeBron', lastName: 'James', position: 'PF', overall: 85, attributes: {}, teamId: 't1' },
    { id: '3', firstName: 'Austin', lastName: 'Reaves', position: 'SG', overall: 83, attributes: {}, teamId: 't1' },
    { id: '4', firstName: 'Deandre', lastName: 'Ayton', position: 'C', overall: 83, attributes: {}, teamId: 't1' },
    { id: '5', firstName: 'Bronny', lastName: 'James', position: 'SG', overall: 73, attributes: {}, teamId: 't1' },
    { id: '6', firstName: 'Christian', lastName: 'Koloko', position: 'C', overall: 74, attributes: {}, teamId: 't1' },
    { id: '7', firstName: 'Dalton', lastName: 'Knecht', position: 'SF', overall: 71, attributes: {}, teamId: 't1' },
    { id: '8', firstName: 'Gabe', lastName: 'Vincent', position: 'PG', overall: 80, attributes: {}, teamId: 't1' },
    { id: '9', firstName: 'Jarred', lastName: 'Vanderbilt', position: 'PF', overall: 81, attributes: {}, teamId: 't1' },
    { id: '10', firstName: 'Jaxson', lastName: 'Hayes', position: 'C', overall: 81, attributes: {}, teamId: 't1' },
    { id: '11', firstName: 'Cam', lastName: 'Reddish', position: 'SF', overall: 76, attributes: {}, teamId: 't1' },
    { id: '12', firstName: 'Max', lastName: 'Christie', position: 'SG', overall: 75, attributes: {}, teamId: 't1' }
];

const runTest = (name: string, strategy: any) => {
    console.log(`\n--- Test: ${name} ---`);
    const optimized = optimizeRotation(roster, strategy);

    const starters = optimized.filter(p => p.isStarter);
    const bench = optimized.filter(p => !p.isStarter && (p.minutes || 0) > 0);
    const starPlayer = optimized.find(p => p.overall >= 90);

    console.log(`Star Player (${starPlayer?.lastName}) Minutes: ${starPlayer?.minutes}`);
    console.log(`Avg Starter Minutes: ${starters.reduce((a, b) => a + (b.minutes || 0), 0) / 5}`);
    console.log(`Bench Players Used: ${bench.length}`);
    bench.forEach(p => console.log(`  - ${p.lastName}: ${p.minutes}`));

    const total = optimized.reduce((sum, p) => sum + (p.minutes || 0), 0);
    console.log(`Total Minutes: ${total}`);
};

runTest("Standard (Depth 50)", 50);
runTest("Heavy Starters (Depth 100)", 100);
runTest("Deep Bench (Depth 0)", 0);
