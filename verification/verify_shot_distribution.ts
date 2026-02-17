
import { StatsAccumulator } from '../src/features/simulation/StatsAccumulator.ts';
import { GameEvent, EventType, ShotType } from '../src/features/simulation/SimulationTypes.ts';
import { Player, SeasonStats } from '../src/models/Player.ts';

// Mock Player
const mockPlayer: Player = {
    id: 'p1',
    firstName: 'Test',
    lastName: 'Player',
    position: 'SG',
    age: 25,
    height: 200,
    weight: 100,
    personality: 'Professional',
    attributes: {
        finishing: 80,
        midRange: 80,
        threePointShot: 80,
        freeThrow: 80,
        playmaking: 50,
        ballHandling: 50,
        offensiveRebound: 50,
        interiorDefense: 50,
        perimeterDefense: 50,
        stealing: 50,
        blocking: 50,
        defensiveRebound: 50,
        athleticism: 80,
        basketballIQ: 50
    },
    seasonStats: {
        gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0,
        offensiveRebounds: 0, defensiveRebounds: 0, fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0,
        rimMade: 0, rimAttempted: 0, midRangeMade: 0, midRangeAttempted: 0
    },
    careerStats: [],
    overall: 80,
    jerseyNumber: 23,
    teamId: 't1',
    tendencies: { shooting: 50, passing: 50, inside: 50, outside: 50, defensiveAggression: 50, foulTendency: 50 },
    minutes: 30,
    isStarter: true,
    potential: 80,
    loveForTheGame: 50,
    morale: 100,
    fatigue: 0,
    stamina: 100
};

function testStatsAccumulation() {
    console.log("Testing Stats Accumulation...");
    // Instantiate with mock rosters
    const accumulator = new StatsAccumulator('t1', 't2', [mockPlayer], []);

    // Test Rim Make
    const rimMake: GameEvent = {
        id: '1', type: 'shot_made', text: 'Layup', teamId: 't1', playerId: 'p1', score: 2, gameTime: 720, possessionId: 1, subType: 'LAYUP'
    };
    accumulator.processEvent(rimMake);

    // Test Mid Miss
    const midMiss: GameEvent = {
        id: '2', type: 'shot_miss', text: 'Mid Range Miss', teamId: 't1', playerId: 'p1', gameTime: 710, possessionId: 2, subType: 'MID_RANGE'
    };
    accumulator.processEvent(midMiss);

    // Test 3PT Make
    const threeMake: GameEvent = {
        id: '3', type: 'shot_made', text: 'Three Pointer', teamId: 't1', playerId: 'p1', score: 3, gameTime: 700, possessionId: 3, subType: 'THREE_POINT'
    };
    accumulator.processEvent(threeMake);

    // Verify
    const s = accumulator.getStats('p1');
    if (!s) {
        console.error("❌ Stats not found for p1");
        return;
    }

    console.log(`Rim: ${s.rimMade}/${s.rimAttempted} (Expected 1/1)`);
    console.log(`Mid: ${s.midRangeMade}/${s.midRangeAttempted} (Expected 0/1)`);
    console.log(`3PT: ${s.threeMade}/${s.threeAttempted} (Expected 1/1)`);

    if (s.rimMade === 1 && s.rimAttempted === 1 && s.midRangeMade === 0 && s.midRangeAttempted === 1 && s.threeMade === 1 && s.threeAttempted === 1) {
        console.log("✅ Stats Accumulation Passed");
    } else {
        console.error("❌ Stats Accumulation Failed");
    }
}

testStatsAccumulation();
