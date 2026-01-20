
import { NBA_TEAMS } from '../src/data/teams';
import { seedRealRosters } from '../src/features/player/rosterSeeder';
import { optimizeRotation } from '../src/utils/rotationUtils';
import { generatePlayer } from '../src/features/player/playerGenerator';
import { calculateOverall } from '../src/utils/playerUtils';

console.log("Starting Test...");

try {
    // 1. Load Teams
    console.log("Loading teams...");
    const teams = JSON.parse(JSON.stringify(NBA_TEAMS));
    console.log(`Loaded ${teams.length} teams.`);

    // 2. See Rosters
    console.log("Seeding rosters...");
    const { players, contracts } = seedRealRosters(teams);
    console.log(`Seeded ${players.length} players and ${contracts.length} contracts.`);

    if (players.length === 0) {
        throw new Error("No players generated!");
    }

    // 3. Assign
    let updatedPlayers = [...players];
    updatedPlayers.forEach(player => {
        const team = teams.find((t: any) => t.id === player.teamId);
        if (!team) return;
        if (!team.rosterIds) team.rosterIds = [];
        team.rosterIds.push(player.id);
    });

    // 4. Update Salaries (Skipping strict calc for test)
    console.log("contracts check:", contracts.length);

    // 5. Optimize Rotation
    console.log("Optimizing rotation...");
    teams.forEach((t: any) => {
        const teamPlayers = updatedPlayers.filter(p => p.teamId === t.id);
        if (teamPlayers.length > 0) {
            console.log(`Optimizing team ${t.abbreviation} with ${teamPlayers.length} players...`);
            const optimized = optimizeRotation(teamPlayers);
            updatedPlayers = updatedPlayers.map(p => {
                const opt = optimized.find(op => op.id === p.id);
                return opt ? opt : p;
            });
        } else {
            console.warn(`Team ${t.abbreviation} has no players!`);
        }
    });

    console.log("Test Complete. Success!");

} catch (e) {
    console.error("Test Failed!", e);
    process.exit(1);
}
