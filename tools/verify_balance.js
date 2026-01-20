
// Verification Script for Balance Refinements (Fix 1, 2, 3)

function n(val) { return (val || 50) / 100; }

function calculateWeights(attr, iq, cons, stats, allowedActions) {
    const minutes = stats.minutes;
    const shots = stats.fgAttempted + (stats.ftAttempted / 2);
    const shotsPerMinute = minutes > 2 ? shots / minutes : 0.5;

    let wPass = 0;
    if (allowedActions.includes('PASS')) {
        wPass = (n(attr.passing) * 0.35) + (iq * 0.35) + (n(attr.ballHandling) * 0.15) + (cons * 0.15);

        // Fix #1 Logic
        if (attr.passing >= 85 && shotsPerMinute < 0.30 && minutes > 5) {
            wPass *= 0.7;
        }
    }

    let wInside = (n(attr.insideShot) * 0.35); // Simplified for test
    let wRim = (n(attr.layup) * 0.30);
    let wMid = (n(attr.midRangeShot) * 0.45);
    let wThree = (n(attr.threePointShot) * 0.50);

    // Fix #2 Logic
    const avgShooting = (attr.threePointShot + attr.midRangeShot + attr.insideShot) / 3;
    if (avgShooting >= 80 && shotsPerMinute < 0.35 && minutes > 5) {
        wInside *= 1.3;
        wRim *= 1.3;
        wMid *= 1.3;
        wThree *= 1.3;
    }

    return { wPass, wScore: Math.max(wInside, wRim, wMid, wThree), shotsPerMinute };
}

function checkSteal(dAttr, wSteal) {
    // Fix #3 Logic
    if (wSteal > 0.7) {
        const canGamble = (dAttr.steal >= 75 && dAttr.iq >= 75);
        return canGamble ? "ALLOWED" : "RESTRICTED";
    }
    return "NO_GAMBLE";
}

// --- TEST CASES ---

console.log("--- TEST 1: Passive Playmaker Decay ---");
const playmaker = { passing: 90, ballHandling: 85, insideShot: 40, midRangeShot: 40, threePointShot: 40 };
const pmStatsEarly = { minutes: 2, fgAttempted: 1, ftAttempted: 0 }; // SPM 0.5 (Healthy)
const pmStatsPassive = { minutes: 10, fgAttempted: 1, ftAttempted: 0 }; // SPM 0.1 (Lazy)

const wEarly = calculateWeights(playmaker, 0.8, 0.8, pmStatsEarly, ['PASS', 'INSIDE']);
const wPassive = calculateWeights(playmaker, 0.8, 0.8, pmStatsPassive, ['PASS', 'INSIDE']);

console.log(`Early Game wPass: ${wEarly.wPass.toFixed(3)}`);
console.log(`Passive (min > 5) wPass: ${wPassive.wPass.toFixed(3)}`);
if (wPassive.wPass < wEarly.wPass) console.log("✅ PASS DECAYED");
else console.log("❌ NO DECAY");

console.log("\n--- TEST 2: Passive Shooter Boost ---");
const shooter = { passing: 50, ballHandling: 60, insideShot: 85, midRangeShot: 90, threePointShot: 95 }; // Avg > 90
const shStatsPassive = { minutes: 10, fgAttempted: 2, ftAttempted: 0 }; // SPM 0.2 (Low)

const wShooter = calculateWeights(shooter, 0.7, 0.8, shStatsPassive, ['PASS', '3PT']);
// Expected Base w3PT approx 0.5*0.95 = 0.475. With 1.3x boost -> 0.61
console.log(`Shooter wScore: ${wShooter.wScore.toFixed(3)} (Expected ~0.6+)`);
if (wShooter.wScore > 0.55) console.log("✅ AGGRESSION BOOSTED");
else console.log("❌ NO BOOST");

console.log("\n--- TEST 3: Steal Checks ---");
const eliteD = { steal: 80, iq: 80 };
const riskyD = { steal: 90, iq: 50 }; // Good steal, low IQ
// wSteal formula: Steal*0.45 + Agi*0.20 + IQ*0.35. Assume max inputs creates > 0.7
// checking manual gate logic
console.log(`Elite Defender (80/80): ${checkSteal(eliteD, 0.8)}`); // Exp ALLOWED
console.log(`Risky Defender (90/50): ${checkSteal(riskyD, 0.8)}`); // Exp RESTRICTED (IQ < 75)

