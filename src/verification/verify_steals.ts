
import { simulatePossession, type PossessionContext } from '../features/simulation/PossessionEngine';
import type { Player, Personality } from '../models/Player';
import type { Team } from '../models/Team';
import type { TeamStrategy } from '../features/simulation/TacticsTypes';

// Mock Data
function createMockPlayer(id: string, name: string, overrides: Partial<Player['attributes']> = {}): Player {
    return {
        id,
        firstName: 'Test',
        lastName: name,
        position: 'PG',
        overall: 80,
        age: 25,
        height: 190,
        weight: 90,
        minutes: 30,
        isStarter: true,
        potential: 80,
        loveForTheGame: 50,
        morale: 100,
        fatigue: 0,
        stamina: 100,
        jerseyNumber: 1,
        teamId: 't1',
        personality: 'Professional' as Personality,
        careerStats: [],
        attributes: {
            finishing: 70,
            midRange: 70,
            threePointShot: 70,
            freeThrow: 70,
            ballHandling: 80,
            playmaking: 80,
            offensiveRebound: 50,
            defensiveRebound: 50,
            interiorDefense: 50,
            perimeterDefense: 50,
            stealing: 50, // Default average
            blocking: 50,
            athleticism: 70,
            basketballIQ: 70,
            ...overrides
        },
        tendencies: {
            shooting: 50,
            passing: 50,
            inside: 50,
            outside: 50,
            defensiveAggression: 50,
            foulTendency: 50
        },
        seasonStats: { gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0, offensiveRebounds: 0, defensiveRebounds: 0, fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0, rimMade: 0, rimAttempted: 0, midRangeMade: 0, midRangeAttempted: 0 },
    };
}

const team: Team = {
    id: 't1', city: 'City', name: 'Team', abbreviation: 'CTY',
    rosterIds: [], conference: 'West',
    wins: 0, losses: 0, history: [],
    colors: { primary: '#000', secondary: '#fff' },
    salaryCapSpace: 10000000,
    cash: 10000000, debt: 0,
    fanInterest: 1.0, ownerPatience: 50,
    marketSize: 'Medium',
    rivalIds: [],
    financials: {
        totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0,
        seasonHistory: []
    },
    draftPicks: []
};

const strategy: TeamStrategy = {
    pace: 'Normal',
    offensiveFocus: 'Balanced',
    defense: 'Man-to-Man'
};

// Scenario 1: Elite Thief (Steal 99) vs Victim
// Threshold: (100 - 99) + 50 = 51.
// Roll 51-100 = Steal (50% chance).
// Roll 0-19 = Foul (20% chance).
// Roll 20-50 = Fail (30% chance).
console.log("--- TEST 1: Elite Thief (Steal 99) ---");

const teammateOff = createMockPlayer('tm_off', 'Teammate');
const victim = createMockPlayer('victim', 'Victim');
const thief = createMockPlayer('thief', 'Thief', { stealing: 99, athleticism: 60, finishing: 60 }); // No crit dunk
const teamOff = { ...team, id: 'off' };
const teamDef = { ...team, id: 'def' };

let steals = 0;
let fouls = 0;
let continues = 0;

for (let i = 0; i < 1000; i++) {
    const ctx: PossessionContext = {
        offenseTeam: teamOff,
        defenseTeam: teamDef,
        offenseLineup: [victim, teammateOff],
        defenseLineup: [thief],
        offenseStrategy: strategy,
        defenseStrategy: strategy,
        timeRemaining: 720,
        shotClock: 24,
        quarter: 1,
        scoreMargin: 0
    };

    const res = simulatePossession(ctx);
    if (res.endType === 'FOUL') fouls++;
    else if (res.events.some(e => e.subType === 'steal')) steals++;
    else continues++;
}

console.log(`Results (1000 sims): Steals=${steals}, Fouls=${fouls}, Continues=${continues}`);
console.log(`Expected: Steals ~500, Fouls ~200, Continues ~300`);

// Scenario 2: Critical Dunker
// Steal 99, Ath 90, Fin 90.
// Should trigger Dunk on Roll > 95 (4-5% chance).
console.log("\n--- TEST 2: Critical Dunker ---");
const dunkThief = createMockPlayer('dunkThief', 'Dunker', { stealing: 99, athleticism: 90, finishing: 90 });
let critDunks = 0;
let normalSteals = 0;

for (let i = 0; i < 1000; i++) {
    const ctx: PossessionContext = {
        offenseTeam: teamOff,
        defenseTeam: teamDef,
        offenseLineup: [victim, teammateOff],
        defenseLineup: [dunkThief],
        offenseStrategy: strategy,
        defenseStrategy: strategy,
        timeRemaining: 720,
        shotClock: 24,
        quarter: 1,
        scoreMargin: 0
    };

    const res = simulatePossession(ctx);
    if (res.events.some(e => e.id?.includes('crit_dunk'))) critDunks++;
    else if (res.events.some(e => e.subType === 'steal')) normalSteals++;
}
console.log(`Crit Dunks: ${critDunks} (Expected ~50), Normal Steals: ${normalSteals}`);
console.log(`Rate: ${(critDunks / 1000 * 100).toFixed(1)}%`);

// Scenario 3: Critical Assist
// Steal 99, Play 95, IQ 95. Teammate Ath 99.
console.log("\n--- TEST 3: Critical Assist ---");
const assistThief = createMockPlayer('assistThief', 'Assister', { stealing: 99, playmaking: 95, basketballIQ: 95, athleticism: 50 });
const dunkerTeammate = createMockPlayer('teammate', 'Teammate', { athleticism: 99 });

let critAssists = 0;

for (let i = 0; i < 1000; i++) {
    const ctx: PossessionContext = {
        offenseTeam: teamOff,
        defenseTeam: teamDef,
        offenseLineup: [victim, teammateOff],
        defenseLineup: [assistThief, dunkerTeammate],
        offenseStrategy: strategy,
        defenseStrategy: strategy,
        timeRemaining: 720,
        shotClock: 24,
        quarter: 1,
        scoreMargin: 0
    };

    const res = simulatePossession(ctx);
    if (res.events.some(e => e.id?.includes('crit_assist'))) critAssists++;
}
// Scenario 4: 3-Steal Cap Test
// Thief starts with 3 steals. Should only steal on perfect roll (99).
console.log("\n--- TEST 4: 3-Steal Cap ---");
const cappedThief = createMockPlayer('cappedThief', 'CappedThief', { stealing: 99 });
// Override starting stats to simulate mid-game state
// We need to inject a mock `getStats` into context for this to work.
// But simulatePossession context doesn't have `getStats` purely?
// Wait, possessionEngine checks `ctx.getStats`. We must provide it.

let cappedSteals = 0;
const mockStats = { steals: 3, defensiveRebounds: 0, offensiveRebounds: 0, fgAttempted: 0, consecutiveFieldGoalsMade: 0 };

for (let i = 0; i < 1000; i++) {
    const ctx: PossessionContext = {
        offenseTeam: teamOff,
        defenseTeam: teamDef,
        offenseLineup: [victim, teammateOff],
        defenseLineup: [cappedThief],
        offenseStrategy: strategy,
        defenseStrategy: strategy,
        timeRemaining: 720,
        shotClock: 24,
        quarter: 1,
        scoreMargin: 0,
        getStats: (id) => mockStats as any // Mocking the stats return
    };

    const res = simulatePossession(ctx);
    if (res.events.some(e => e.subType === 'steal')) {
        cappedSteals++;
    }
}
console.log(`Capped Steals: ${cappedSteals} (Expected ~10 due to 1% chance)`);
