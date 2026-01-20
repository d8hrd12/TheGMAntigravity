
import { generatePlayer } from '../src/features/player/playerGenerator';
import { seedRealRosters } from '../src/features/player/rosterSeeder';
import { NBA_TEAMS } from '../src/data/teams';

console.log("Testing Player Generator...");
try {
    for (let i = 0; i < 50; i++) {
        const p = generatePlayer(undefined, 'starter');
        if (!p.id || !p.attributes) {
            throw new Error("Invalid player generated");
        }
    }
    console.log("Player Generator OK.");

    console.log("Testing Roster Seeder...");
    const teams = JSON.parse(JSON.stringify(NBA_TEAMS));
    const { players, contracts } = seedRealRosters(teams);
    console.log(`Generated ${players.length} players.`);

    if (players.length < 100) {
        throw new Error("Too few players generated!");
    }

    console.log("Seeder OK.");

} catch (e) {
    console.error("DEBUG FAILED:", e);
    process.exit(1);
}
