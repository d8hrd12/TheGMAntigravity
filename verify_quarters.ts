
import { simulateMatchII } from "./src/features/simulation/MatchEngineII";
import { generatePlayer } from "./src/features/player/playerGenerator";

const homeTeam = {
    id: 'HOME', name: 'Home Team', city: 'Home', abbreviation: 'HOM', conference: 'West',
    colors: { primary: '#000', secondary: '#FFF' }, rosterIds: []
} as any;

const awayTeam = {
    id: 'AWAY', name: 'Away Team', city: 'Away', abbreviation: 'AWY', conference: 'East',
    colors: { primary: '#F1C40F', secondary: '#000' }, rosterIds: []
} as any;

const createRoster = (teamId: string) => {
    const roster = [];
    for (let i = 0; i < 12; i++) {
        const p = generatePlayer(i < 5 ? 'PG' : 'SG', i < 5 ? 'star' : 'bench');
        p.teamId = teamId;
        p.isStarter = i < 5;
        roster.push(p);
    }
    return roster;
};

const homeRoster = createRoster('HOME');
const awayRoster = createRoster('AWAY');

console.log("Simulating Match...");
const result = simulateMatchII({
    homeTeam, awayTeam, homeRoster, awayRoster, date: new Date()
});

console.log(`Final Score: ${result.homeScore} - ${result.awayScore}`);

const quarterEnds = result.events.filter(e => e.type === 'quarter_end');
console.log(`\nQuarter End Events found: ${quarterEnds.length}`);
quarterEnds.forEach(e => {
    console.log(`- ${e.text} at ${e.gameTime}s (possessionId: ${e.possessionId})`);
});

// Check for top-seeded ordering (if we were using the log)
// MatchEngineII returns them in chronological order. LiveGameEngine unshifts them.
console.log("\nFirst 5 events (Chronological):");
result.events.slice(0, 5).forEach(e => console.log(`[${e.gameTime}s] ${e.type}: ${e.text}`));

console.log("\nLast 5 events (Chronological):");
result.events.slice(-5).forEach(e => console.log(`[${e.gameTime}s] ${e.type}: ${e.text}`));

if (quarterEnds.length >= 4) {
    console.log("\nVERIFICATION SUCCESS: All quarters accounted for.");
} else {
    console.log("\nVERIFICATION FAILURE: Missing quarter end events.");
    process.exit(1);
}
