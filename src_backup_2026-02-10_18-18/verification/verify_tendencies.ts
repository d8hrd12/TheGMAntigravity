
import { calculateTendencies } from '../utils/playerUtils';
import type { Player, Personality } from '../models/Player';

// Mock Player Data
const createPlayer = (fin: number, three: number, mid: number, pass: number, minutes: number): Player => ({
    id: 'test_1',
    firstName: 'Test',
    lastName: 'Player',
    attributes: {
        finishing: fin,
        threePointShot: three,
        midRange: mid,
        playmaking: pass,
        basketballIQ: 80,
        ballHandling: 70,
        defense: 70,
        rebounding: 70,
        athleticism: 70,
        perimeterDefense: 70,
        interiorDefense: 70,
        stealing: 70,
        blocking: 70,
        offensiveRebound: 70,
        defensiveRebound: 70,
        freeThrow: 70
    },
    tendencies: { shooting: 50, passing: 50, inside: 50, outside: 50, defensiveAggression: 50, foulTendency: 50 },
    position: 'SG',
    overall: 80,
    minutes: minutes,
    personality: 'Professional' as Personality
} as unknown as Player);

// Test Cases
const runTest = () => {
    // Case 1: The User's Example (81 Fin, 51 3PT, 68 Mid, 42 Pass, 42 Min)
    const userExample = createPlayer(81, 51, 68, 42, 42);
    const t1 = calculateTendencies(userExample, 42, []);

    console.log("--- User Example (Target: Low Outside) ---");
    console.log(`Stats: Fin 81, 3PT 51, Pass 42`);
    console.log(`Computed: Shoot ${t1.shooting}, Pass ${t1.passing}, Inside ${t1.inside}, Outside ${t1.outside}`);
    console.log(`Target Outside: ~20. Actual: ${t1.outside}\n`);

    // Case 2: Elite Shooter (95 3PT, 80 Fin)
    const shooter = createPlayer(80, 95, 85, 80, 42);
    const t2 = calculateTendencies(shooter, 42, []);
    console.log("--- Elite Shooter (Target: High Outside) ---");
    console.log(`Stats: Fin 80, 3PT 95`);
    console.log(`Computed: Shoot ${t2.shooting}, Pass ${t2.passing}, Inside ${t2.inside}, Outside ${t2.outside}`);

    // Case 3: Role Player (Low Budget)
    const role = createPlayer(70, 70, 70, 70, 15);
    const t3 = calculateTendencies(role, 15, []);
    console.log("--- Role Player 15m (Target: Low Budget) ---");
    console.log(`Computed: Shoot ${t3.shooting}, Pass ${t3.passing} (Sum ~100)`);
};

runTest();
