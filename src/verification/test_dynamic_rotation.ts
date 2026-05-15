
import { optimizeRotation } from '../utils/rotationUtils';
import { Player } from '../models/Player';

const mockPlayer = (id: string, ovr: number, pos: any): Player => ({
    id,
    firstName: 'Test',
    lastName: id,
    age: 25,
    position: pos,
    attributes: {
        finishing: ovr, midRange: ovr, threePointShot: ovr, freeThrow: ovr,
        playmaking: ovr, ballHandling: ovr, offensiveRebound: ovr,
        defensiveRebound: ovr, interiorDefense: ovr, perimeterDefense: ovr,
        stealing: ovr, blocking: ovr, athleticism: ovr, basketballIQ: ovr
    },
    teamId: 'team1',
    minutes: 0,
    isStarter: false,
    rotationIndex: 999,
    careerStats: [],
    seasonStats: { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, gamesPlayed: 0, fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, minutes: 0 },
    tendencies: { shooting: 50, passing: 50, inside: 50, outside: 50, defense: 50 }
} as any);

const roster = [
    mockPlayer('P1', 80, 'PG'),
    mockPlayer('P2', 80, 'SG'),
    mockPlayer('P3', 80, 'SF'),
    mockPlayer('P4', 80, 'PF'),
    mockPlayer('P5', 80, 'C'),
    mockPlayer('P6', 70, 'SG'),
    mockPlayer('P7', 70, 'PF'),
];

console.log("--- Initial Rotation ---");
const initial = optimizeRotation(roster, 'Standard', 240);
initial.forEach(p => console.log(`${p.id}: ${p.minutes} mins, Starter: ${p.isStarter}`));

console.log("\n--- Adding Elite Player (Transfer) ---");
const newPlayer = mockPlayer('Elite', 95, 'SG');
const newRoster = [...roster, newPlayer];
const updated = optimizeRotation(newRoster, 'Standard', 240);
updated.forEach(p => console.log(`${p.id}: ${p.minutes} mins, Starter: ${p.isStarter}`));

const elite = updated.find(p => p.id === 'Elite');
if (elite && elite.minutes > 30) {
    console.log("\n✅ SUCCESS: New elite player integrated into rotation.");
} else {
    console.log("\n❌ FAILURE: New elite player ignored.");
}
