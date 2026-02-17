
import { resolveShot, decideAction, Territory } from '../src/features/simulation/PossessionEngine.ts';
import { Player } from '../src/models/Player';
import { Team } from '../src/models/Team';

// Mocks
const mockTeam: Team = {
    id: 't1',
    name: 'Test Team',
    abbreviation: 'TST',
    wins: 0,
    losses: 0,
    cash: 100,
    rosterIds: [],
    salaryCapSpace: 100
} as any;

const lowSkillCenter: Player = {
    id: 'c1',
    firstName: 'Stone',
    lastName: 'Hands',
    position: 'C',
    minutes: 30, // Starter minutes to trigger full evaluation
    attributes: {
        finishing: 70, // Below 75 threshold
        threePointShot: 40,
        midRange: 45,
        ballHandling: 40,
        playmaking: 40,
        basketballIQ: 90, // Smart enough to pass?
        athleticism: 60,
        defense: 70,
        rebounding: 80,
        stealing: 40,
        blocking: 80,
        stamina: 100,
        durability: 100,
        freeThrow: 60,
        interiorDefense: 80,
        perimeterDefense: 40,
        offensiveRebound: 80,
        defensiveRebound: 80,
    },
    overall: 72,
    morale: 100,
} as any;

const eliteCenter: Player = {
    id: 'c2',
    firstName: 'Elite',
    lastName: 'Big',
    position: 'C',
    minutes: 30,
    attributes: {
        finishing: 95,
        threePointShot: 40,
        midRange: 60,
        ballHandling: 60,
        playmaking: 70,
        basketballIQ: 95,
        athleticism: 80,
        defense: 80,
        rebounding: 90,
        stealing: 50,
        blocking: 90,
        stamina: 100,
        durability: 100,
        freeThrow: 80,
        interiorDefense: 90,
        perimeterDefense: 50,
        offensiveRebound: 90,
        defensiveRebound: 90,
    },
    overall: 90,
    morale: 100,
} as any;

const mockCtx: any = {
    offenseTeam: mockTeam,
    defenseTeam: mockTeam,
    offenseLineup: [lowSkillCenter],
    defenseLineup: [eliteCenter], // Defended by Elite Center
    offenseStrategy: { offensiveFocus: 'Balanced', pace: 'Normal' },
    defenseStrategy: { defense: 'Man-to-Man' },
    timeRemaining: 720,
    shotClock: 20,
    quarter: 1,
    scoreMargin: 0
};

// 1. Test "Know Your Role" (decideAction)
console.log("--- Testing 'Know Your Role' (decideAction) ---");
let passCount = 0;
let scoreCount = 0;
const iterations = 1000;

for (let i = 0; i < iterations; i++) {
    const action = decideAction(lowSkillCenter, mockCtx);
    if (action === 'PASS') passCount++;
    else scoreCount++;
}

console.log(`Low Skill Center Action Distribution: PASS: ${passCount}, SCORE: ${scoreCount}`);
console.log(`Pass Rate: ${(passCount / iterations * 100).toFixed(1)}%`);


// 2. Test "Efficiency Buff" (resolveShot)
console.log("\n--- Testing 'Efficiency Buff' (resolveShot At Rim) ---");
let makes = 0;
const shotIterations = 1000;

for (let i = 0; i < shotIterations; i++) {
    // driveDunkChance = true (At Rim)
    const result = resolveShot(lowSkillCenter, undefined, mockCtx, [], 700, 0, true);
    if (result.endType === 'SCORE') makes++;
}

console.log(`Low Skill Center Rim Efficiency: ${(makes / shotIterations * 100).toFixed(1)}% (Target: > 45%)`);

// 3. Test "Sagging Off" Removal (resolveShot vs Jumper)
console.log("\n--- Control Test: Mid-Range Efficiency (Should still be penalized) ---");
makes = 0;
for (let i = 0; i < shotIterations; i++) {
    // driveDunkChance = false (Jumper), force isThree = false (Mid-Range)
    // We can't force isThree=false easily without mocking Math.random inside resolveShot, 
    // but with 40 3PT rating, he mostly takes mid-range if not driving.
    // Actually resolveShot rolls internally. 
    // But we know 'driveDunkChance' = false.
    const result = resolveShot(lowSkillCenter, undefined, mockCtx, [], 700, 0, false);
    if (result.endType === 'SCORE') makes++;
}
console.log(`Low Skill Center Jumper Efficiency: ${(makes / shotIterations * 100).toFixed(1)}% (Expected: Low due to sagging)`);

