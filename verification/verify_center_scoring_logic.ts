
// Standalone Verification of Center Scoring Logic
// Replicates the modified functions to test the math/logic.

interface Player {
    id: string;
    attributes: {
        finishing: number;
        threePointShot: number;
        midRange: number;
        ballHandling: number;
        playmaking: number;
        basketballIQ: number;
        interiorDefense: number;
        perimeterDefense: number;
    };
    overall: number;
    minutes: number;
}

// Mock Context
const mockCtx = {
    offenseLineup: [] as Player[],
    offenseStrategy: { offensiveFocus: 'Balanced' }
};

// 1. VERIFY: Know Your Role (decideAction logic)
function testDecideActionLogic(player: Player) {
    // Mock calculateTendencies output (Base)
    // Assume a "selfish" low skill player
    let t = {
        shooting: 80, // Wants to shoot
        passing: 20,
        inside: 80,
        outside: 0
    };

    console.log(`Original Tendencies: Shot ${t.shooting}, Pass ${t.passing}`);

    // NEW LOGIC TO TEST
    if (player.attributes.finishing < 75 && player.attributes.threePointShot < 70 && player.attributes.midRange < 70) {
        t.shooting *= 0.4;
        t.passing *= 1.4;
        console.log("-> Triggered 'Know Your Role' Modifier");
    } else {
        console.log("-> No Modifier applied");
    }

    console.log(`Final Tendencies: Shot ${t.shooting.toFixed(1)}, Pass ${t.passing.toFixed(1)}`);
    return t;
}

// 2. VERIFY: Efficiency Buff (resolveShot logic)
function testResolveShotLogic(player: Player, isRimCheck: boolean) {
    const attr = player.attributes;
    let chance = 0;

    // A. RIM ATTEMPT (driveDunkChance = true)
    if (isRimCheck) {
        const shotRating = attr.finishing;
        const skillBonus = (shotRating - 70) * 0.5;
        chance = 50 + skillBonus + 0; // bonusPercent = 0

        console.log(`[Rim] Base Chance: ${chance.toFixed(1)}%`);

        // NEW LOGIC: Floor Raise
        if (chance < 45) {
            console.log(`[Rim] Triggered Floor Raise (was ${chance.toFixed(1)}%) -> 45%`);
            chance = 45;
        }
        if (chance > 75) chance = 75;
    }
    // B. JUMPER (Mid-Range)
    else {
        // Assume mid-range
        const shotRating = attr.midRange;
        const skillBonus = (shotRating - 70) * 0.6;
        chance = 36 + skillBonus;
        if (chance < 30) chance = 30;
        if (chance > 70) chance = 70;

        console.log(`[Jumper] Base Chance: ${chance.toFixed(1)}%`);

        // Sagging Off Logic
        // Original: if ((driveDunkChance || !isThree) && attr.threePointShot < 60)
        // Fixed: if (!driveDunkChance && !isThree && attr.threePointShot < 60)
        const isThree = false; // Testing mid-range
        const driveDunkChance = isRimCheck;

        if (!driveDunkChance && !isThree && attr.threePointShot < 60) {
            const sagPenalty = (60 - attr.threePointShot) / 2;
            console.log(`[Jumper] Triggered Sagging Penalty: -${sagPenalty}%`);
            chance -= sagPenalty;
        } else {
            console.log(`[Jumper] Sagging Penalty SKIPPED (Correct for Rim, or Good Shooter)`);
        }
    }

    return chance;
}


// --- RUN TEST CASES ---

const lowSkillBig: Player = {
    id: 'c1',
    overall: 70,
    minutes: 20,
    attributes: {
        finishing: 65, // Low
        threePointShot: 40,
        midRange: 45,
        ballHandling: 40,
        playmaking: 40,
        basketballIQ: 90,
        interiorDefense: 80,
        perimeterDefense: 40
    }
};

console.log("--- TEST 1: Behavior Check (Stone Hands) ---");
const t1 = testDecideActionLogic(lowSkillBig);
// Expected: Shot dropped from 80 -> 32. Pass boosted 20 -> 28.
// Wait, 80 * 0.4 = 32. 
// Validates logic.

console.log("\n--- TEST 2: Rim Efficiency Check (Stone Hands) ---");
const c1 = testResolveShotLogic(lowSkillBig, true); // At Rim
// Calculation: Finishing 65. SkillBonus = (65-70)*0.5 = -2.5.
// Base = 50 - 2.5 = 47.5%.
// Wait, 47.5 > 45. So Floor Raise doesn't trigger for 65 Finishing?
// Ah, let's try 50 Finishing.

const clutzBig: Player = {
    ...lowSkillBig,
    attributes: { ...lowSkillBig.attributes, finishing: 50 }
};
console.log("\n--- TEST 3: Rim Efficiency Check (Clutz, 50 Finishing) ---");
const c2 = testResolveShotLogic(clutzBig, true);
// Calculation: Finishing 50. Bonus = (50-70)*0.5 = -10.
// Base = 40.
// Floor Raise should trigger -> 45.

console.log("\n--- TEST 4: Sagging Penalty Check (Stone Hands, Mid-Range) ---");
// Should APPLY penalty because it's a jumper and he can't shoot 3s.
testResolveShotLogic(lowSkillBig, false);

// 3. VERIFY: Bully Ball Logic (Replicated from PossessionEngine.ts)
function testBullyBallLogic(handler: Player, defender: Player) {
    // Standard Drive Check (Mock)
    // DriveRating = (Play + Handle) / 2
    const driveRating = (handler.attributes.playmaking + handler.attributes.ballHandling) / 2;
    const perimeterDef = defender.attributes.perimeterDefense;

    if (driveRating > perimeterDef) {
        console.log(`[Drive Check] Speed Drive SUCCESS (${driveRating.toFixed(1)} > ${perimeterDef})`);
        return 'DRIVE';
    } else {
        console.log(`[Drive Check] Speed Drive FAILED (${driveRating.toFixed(1)} <= ${perimeterDef})`);
    }

    // BULLY BALL CHECK
    // Logic: (Finishing * 0.7) + (IntDef * 0.3) > DefIntDef + 5
    const bullyRating = (handler.attributes.finishing * 0.7) + (handler.attributes.interiorDefense * 0.3);
    const defenderStrength = defender.attributes.interiorDefense;

    console.log(`[Bully Check] Bully Rating: ${bullyRating.toFixed(1)} vs Def Strength: ${defenderStrength}`);

    if (bullyRating > defenderStrength + 5) {
        console.log(`[Bully Check] SUCCESS -> Force Drive`);
        return 'DRIVE (BULLY)';
    } else {
        console.log(`[Bully Check] FAILED`);
        return 'SHOOT/PASS';
    }
}

console.log("\n--- TEST 6: Bully Ball Check (Stone Hands vs Weak Interior Defender) ---");
// Stone Hands: Fin 65, IntDef ? (Missing in lowSkillBig definition, assume 80 from context)
// Update lowSkillBig to have IntDef
const stoneHands: Player = {
    ...lowSkillBig,
    attributes: { ...lowSkillBig.attributes, interiorDefense: 80 }
};

const weakBig: Player = {
    id: 'c3',
    overall: 60,
    minutes: 20,
    attributes: {
        finishing: 50,
        threePointShot: 40,
        midRange: 45,
        ballHandling: 40,
        playmaking: 40,
        basketballIQ: 70,
        interiorDefense: 60, // Weak
        perimeterDefense: 40
    }
} as any;

// Handler: Handle 40 vs Def Perim 40. Drive Rating 40. 40 > 40? False.
// Bully: (65 * 0.7) + (80 * 0.3) = 45.5 + 24 = 69.5.
// Def Strength: 60.
// 69.5 > 65? YES.

testBullyBallLogic(stoneHands, weakBig);

console.log("\n--- TEST 7: Bully Ball Check (Stone Hands vs Strong Defender) ---");
const strongBig: Player = {
    ...weakBig,
    attributes: { ...weakBig.attributes, interiorDefense: 80 }
};
// Def Strength 80.
// 69.5 > 85? NO.
testBullyBallLogic(stoneHands, strongBig);

console.log("\n--- TEST 8: 3PT Hard Cap Check (< 55 should be 0%) ---");
// Reusing testResolveShotLogic logic, but we need to inject the logic into the test function 
// since it mocks the engine.
// Let's UPDATE testResolveShotLogic to include the new Hard Cap logic for verification.

function test3PTHardCap(rating: number) {
    const attr = { threePointShot: rating };
    let isThree = false;

    // Simulate Engine Logic
    // Base 35% * Skill Modifier
    const skillMod = Math.max(0, (rating - 50) / 40);
    const baseThreeChance = 0.35;
    const threeChance = baseThreeChance * (0.5 + skillMod);

    // Force a "roll" that would normally succeed
    // If chance is > 0, we assume random() < chance for this test
    if (threeChance > 0) {
        isThree = true;
    }

    // NEW HARD CAP LOGIC
    if (rating < 55) {
        isThree = false;
    }

    console.log(`Rating: ${rating} | Chance: ${(threeChance * 100).toFixed(1)}% | Is 3PT? ${isThree ? 'YES' : 'NO'}`);
    return isThree;
}

test3PTHardCap(50); // Should be NO
test3PTHardCap(54); // Should be NO
test3PTHardCap(55); // Should be YES (if rolled)
test3PTHardCap(60); // Should be YES

console.log("\n--- TEST 9: Mid-Range Hard Cap Check (decideAction) ---");
// Replicate logic or rely on decideAction mock?
// The script mocks decideAction logic in `testBullyBallLogic` but doesn't actually call the real `decideAction` 
// with enough fidelity to test this specific branch without copying the whole function.
// Let's create a specific test function for the new logic block.

function testMidRangeHardCap(mid: number, three: number, perimeterDef: number) {
    const handler = {
        attributes: { midRange: mid, threePointShot: three },
    };
    // Mock Logic
    let action = 'PASS'; // Default fallthrough

    // Assume "Outside" ratio selected and attacking.
    const attRating = 80; // Arbitrary high to trigger "Weak Defense" check
    // "Weak Defense" Bonus (Att > Def)
    if (attRating > perimeterDef) {
        // MID-RANGE HARD CAP
        if (handler.attributes.midRange < 55 && handler.attributes.threePointShot < 55) {
            // Cannot Shoot.
            action = 'FALLTHROUGH_TO_DRIVE';
            console.log(`[Mid Cap] Mid ${mid}, 3PT ${three} -> BLOCKED (Fallthrough)`);
        } else {
            action = 'SHOOT';
            console.log(`[Mid Cap] Mid ${mid}, 3PT ${three} -> SHOOT Allowed`);
        }
    }
    return action;
}

testMidRangeHardCap(50, 50, 40); // Blocked
testMidRangeHardCap(60, 50, 40); // Allowed (Mid good)
testMidRangeHardCap(50, 60, 40); // Allowed (3PT good)





