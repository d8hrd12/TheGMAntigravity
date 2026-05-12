const fs = require('fs');

const content = fs.readFileSync('/Users/ioannistsetselis/.gemini/antigravity/scratch/basketball_manager/src/data/euro/realRosters.ts', 'utf8');

const players = [];
const lines = content.split('\n');
let currentTeam = '';

for (const line of lines) {
    const teamMatch = line.match(/^\s*['"]?([A-Z0-9-]{3,6})['"]?:\s*\[/);
    if (teamMatch) {
        currentTeam = teamMatch[1];
    }
    
    let match;
    const regex = /firstName:\s*'([^']+)',\s*lastName:\s*'([^']+)'/g;
    while ((match = regex.exec(line)) !== null) {
        const playerName = `${match[1]} ${match[2]}`;
        players.push({ name: playerName, team: currentTeam });
    }
}

console.log(`Total players found: ${players.length}`);

const seen = {};
const duplicates = {};

for (const p of players) {
    if (!seen[p.name]) {
        seen[p.name] = [p.team];
    } else {
        seen[p.name].push(p.team);
    }
}

for (const name in seen) {
    if (seen[name].length > 1) {
        duplicates[name] = seen[name];
    }
}

console.log(JSON.stringify(duplicates, null, 2));
