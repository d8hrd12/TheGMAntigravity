import fs from 'fs';
import path from 'path';

// Team mapping: Full name from CSV to our Abbr
const TEAM_MAP: Record<string, string> = {
    'Atlanta Hawks': 'ATL',
    'Boston Celtics': 'BOS',
    'Brooklyn Nets': 'BKN',
    'Charlotte Hornets': 'CHA',
    'Chicago Bulls': 'CHI',
    'Cleveland Cavaliers': 'CLE',
    'Dallas Mavericks': 'DAL',
    'Denver Nuggets': 'DEN',
    'Detroit Pistons': 'DET',
    'Golden State Warriors': 'GSW',
    'Houston Rockets': 'HOU',
    'Indiana Pacers': 'IND',
    'Los Angeles Clippers': 'LAC',
    'Los Angeles Lakers': 'LAL',
    'Memphis Grizzlies': 'MEM',
    'Miami Heat': 'MIA',
    'Milwaukee Bucks': 'MIL',
    'Minnesota Timberwolves': 'MIN',
    'New Orleans Pelicans': 'NOP',
    'New York Knicks': 'NYK',
    'Oklahoma City Thunder': 'OKC',
    'Orlando Magic': 'ORL',
    'Philadelphia 76ers': 'PHI',
    'Phoenix Suns': 'PHX',
    'Portland Trail Blazers': 'POR',
    'Sacramento Kings': 'SAC',
    'San Antonio Spurs': 'SAS',
    'Toronto Raptors': 'TOR',
    'Utah Jazz': 'UTA',
    'Washington Wizards': 'WAS'
};

const csvPath = '/Users/ioannistsetselis/Downloads/archive/current_nba_players.csv';
const outPath = path.resolve(process.cwd(), 'src/data/realRosters.ts');

// Proper CSV line splitter that respects quotes
function splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
}

function parseCSV(content: string) {
    const lines = content.split('\n');
    if (lines.length === 0) return {};
    const header = splitCSVLine(lines[0]);

    // Indices for key fields
    const idx = {
        name: header.indexOf('name'),
        team: header.indexOf('team'),
        pos1: header.indexOf('position_1'),
        pos2: header.indexOf('position_2'),
        birthdate: header.indexOf('birthdate'),
        overall: header.indexOf('overall'),
        archetype: header.indexOf('archetype'),

        // Attributes
        close: header.indexOf('close_shot'),
        mid: header.indexOf('mid_range_shot'),
        three: header.indexOf('three_point_shot'),
        ft: header.indexOf('free_throw'),
        iq: header.indexOf('shot_iq'),
        consistency_off: header.indexOf('offensive_consistency'),
        consistency_def: header.indexOf('defensive_consistency'),
        speed: header.indexOf('speed'),
        agility: header.indexOf('agility'),
        strength: header.indexOf('strength'),
        vertical: header.indexOf('vertical'),
        stamina: header.indexOf('stamina'),
        layup: header.indexOf('layup'),
        dunk_standing: header.indexOf('standing_dunk'),
        dunk_driving: header.indexOf('driving_dunk'),
        post_control: header.indexOf('post_control'),
        draw_foul: header.indexOf('draw_foul'),
        pass_acc: header.indexOf('pass_accuracy'),
        handle: header.indexOf('ball_handle'),
        off_reb: header.indexOf('offensive_rebound'),
        def_reb: header.indexOf('defensive_rebound'),
        int_def: header.indexOf('interior_defense'),
        per_def: header.indexOf('perimeter_defense'),
        steal: header.indexOf('steal'),
        block: header.indexOf('block')
    };

    const rosters: Record<string, any[]> = {};

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const cols = splitCSVLine(lines[i]);
        if (cols.length < 20) continue;

        const teamName = cols[idx.team];
        const abbr = TEAM_MAP[teamName];
        if (!abbr) continue;

        const name = cols[idx.name];
        const names = name.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');

        // Age calculation
        const birthStr = cols[idx.birthdate];
        let age = 25;
        if (birthStr) {
            const birthParts = birthStr.split(', ');
            if (birthParts.length > 1) {
                const birthYear = parseInt(birthParts[birthParts.length - 1]);
                if (!isNaN(birthYear)) {
                    age = 2025 - birthYear;
                }
            }
        }

        // Badges
        const badges: Record<string, string> = {};
        header.forEach((h, hIdx) => {
            if (h.startsWith('badge_')) {
                const val = cols[hIdx];
                if (val && val !== '' && val !== '0' && val.toLowerCase() !== 'none') {
                    badges[h.replace('badge_', '')] = val;
                }
            }
        });

        const safeInt = (val: string) => {
            const parsed = parseInt(val);
            return isNaN(parsed) ? 50 : parsed;
        };

        const player = {
            firstName,
            lastName,
            pos: cols[idx.pos1],
            age,
            ovr: safeInt(cols[idx.overall]),
            archetype: cols[idx.archetype] || 'Spectator',
            attributes: {
                insideShot: Math.round((safeInt(cols[idx.close]) + safeInt(cols[idx.layup])) / 2),
                midRangeShot: safeInt(cols[idx.mid]),
                threePointShot: safeInt(cols[idx.three]),
                passing: safeInt(cols[idx.pass_acc]),
                ballHandling: safeInt(cols[idx.handle]),
                offensiveRebound: safeInt(cols[idx.off_reb]),
                defensiveRebound: safeInt(cols[idx.def_reb]),
                interiorDefense: safeInt(cols[idx.int_def]),
                perimeterDefense: safeInt(cols[idx.per_def]),
                steal: safeInt(cols[idx.steal]),
                block: safeInt(cols[idx.block]),
                speed: safeInt(cols[idx.speed]),
                stamina: safeInt(cols[idx.stamina]),
                strength: safeInt(cols[idx.strength]),
                vertical: safeInt(cols[idx.vertical]),
                agility: safeInt(cols[idx.agility]),
                iq: safeInt(cols[idx.iq]),
                offensiveConsistency: safeInt(cols[idx.consistency_off]),
                defensiveConsistency: safeInt(cols[idx.consistency_def]),
                drivingDunk: safeInt(cols[idx.dunk_driving]),
                standingDunk: safeInt(cols[idx.dunk_standing]),
                layup: safeInt(cols[idx.layup]),
                postControl: safeInt(cols[idx.post_control]),
                drawFoul: safeInt(cols[idx.draw_foul]),
                freeThrow: safeInt(cols[idx.ft]),
                workEthic: 80
            },
            badges,
            contract: {
                amount: Math.max(1000000, 5000000 + (safeInt(cols[idx.overall]) - 70) * 1000000),
                years: 2
            }
        };

        if (!rosters[abbr]) rosters[abbr] = [];
        rosters[abbr].push(player);
    }

    return rosters;
}

const content = fs.readFileSync(csvPath, 'utf8');
const rosters = parseCSV(content);

const output = `
export interface RealPlayerDef {
    firstName: string;
    lastName: string;
    pos: string;
    age: number;
    ovr: number;
    archetype: string;
    attributes?: any;
    badges?: any;
    contract?: {
        amount: number;
        years: number;
    };
}

export const REAL_ROSTERS: Record<string, RealPlayerDef[]> = ${JSON.stringify(rosters, null, 2)};
`;

fs.writeFileSync(outPath, output);
console.log('Rosters generated successfully with robust parsing to:', outPath);
