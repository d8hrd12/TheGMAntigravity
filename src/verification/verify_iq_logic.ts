
import { simulatePossession, type PossessionContext, resolveShot } from '../features/simulation/PossessionEngine.js';
import type { Player, Personality } from '../models/Player.js';
import type { Team } from '../models/Team.js';
import type { TeamStrategy } from '../features/simulation/TacticsTypes.js';

// Mock Data
function createMockPlayer(id: string, name: string, iq: number, overrides: Partial<Player['attributes']> = {}): Player {
    return {
        id,
        firstName: 'Test',
        lastName: name,
        position: 'SF',
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
            stealing: 50,
            blocking: 50,
            athleticism: 70,
            basketballIQ: iq,
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
        seasonStats: { gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0, offensiveRebounds: 0, defensiveRebounds: 0, fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0, rimMade: 0, rimAttempted: 0, rimAssisted: 0, midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0, threePointAssisted: 0 },
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

const ctx: PossessionContext = {
    offenseTeam: team,
    defenseTeam: team,
    offenseLineup: [],
    defenseLineup: [],
    offenseStrategy: strategy,
    defenseStrategy: strategy,
    timeRemaining: 720,
    shotClock: 24,
    quarter: 1,
    scoreMargin: 0,
    playerConfidence: {},
    playerPressure: {},
    gameVariance: 0,
    offenseCoachRating: 80,
    defenseCoachRating: 80
};

console.log("--- IQ LOGIC VERIFICATION ---");

const highIqPlayer = createMockPlayer('high', 'HighIQ', 90);
const lowIqPlayer = createMockPlayer('low', 'LowIQ', 40);
const passer = createMockPlayer('passer', 'Passer', 80);
const defender = createMockPlayer('def', 'Defender', 70);

ctx.defenseLineup = [defender];

function testIQPerformance(shooter: Player, label: string) {
    let makes = 0;
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
        // Test assisted shot
        const res = resolveShot(shooter, passer, ctx, [], 100);
        if (res.points > 0) makes++;
    }

    console.log(`${label} (Assisted) FG%: ${(makes / iterations * 100).toFixed(2)}%`);
}

testIQPerformance(highIqPlayer, "High IQ Player");
testIQPerformance(lowIqPlayer, "Low IQ Player");

function testUnassisted(shooter: Player, label: string) {
    let makes = 0;
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
        // Test unassisted shot
        const res = resolveShot(shooter, undefined, ctx, [], 100);
        if (res.points > 0) makes++;
    }

    console.log(`${label} (Unassisted) FG%: ${(makes / iterations * 100).toFixed(2)}%`);
}

testUnassisted(highIqPlayer, "High IQ Player");
testUnassisted(lowIqPlayer, "Low IQ Player");
