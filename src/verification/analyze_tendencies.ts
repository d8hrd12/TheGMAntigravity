import { calculateTendencies } from '../utils/playerUtils';
import { generatePlayer } from '../features/player/playerGenerator';

const createProfile = (name: string, pos: string, ovr: number, shoot: number, pass: number, fin: number, mid: number, thr: number) => {
    const p = generatePlayer(undefined, ovr > 80 ? 'starter' : 'bench');
    p.firstName = name;
    p.position = pos as any;
    p.attributes.playmaking = pass;
    p.attributes.finishing = fin;
    p.attributes.midRange = mid;
    p.attributes.threePointShot = thr;
    // Overriding OVR for the test scaling
    p.overall = ovr;
    return p;
};

const superstars = [
    createProfile('Elite PG', 'PG', 95, 90, 90, 85, 85, 90),
    createProfile('Elite SG', 'SG', 92, 95, 65, 90, 95, 90),
    createProfile('Elite SF', 'SF', 90, 85, 80, 85, 85, 85),
];

const rolePlayers = [
    createProfile('3&D Wing (Black Hole Issue)', 'SF', 74, 75, 56, 74, 78, 79), // The user's specific problem
    createProfile('Rim Runner', 'C', 75, 70, 40, 85, 40, 30),
    createProfile('Catch & Shoot', 'SG', 72, 80, 50, 60, 75, 85),
];

const bench = [
    createProfile('Scrub', 'PF', 65, 60, 50, 65, 55, 60)
];

console.log("--- SUPERSTARS (36 Mins) ---");
superstars.forEach(p => console.log(`${p.firstName}:`, calculateTendencies(p, 36, [])));

console.log("\n--- ROLE PLAYERS (30 Mins) ---");
rolePlayers.forEach(p => console.log(`${p.firstName}:`, calculateTendencies(p, 30, [])));

console.log("\n--- BENCH (15 Mins) ---");
bench.forEach(p => console.log(`${p.firstName}:`, calculateTendencies(p, 15, [])));

