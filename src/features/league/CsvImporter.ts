import type { Contract } from '../../models/Contract';
import type { Player, Position, PlayerAttributes } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall, calculateFairSalary, calculateSecondaryPosition } from '../../utils/playerUtils';
import { PERSONALITIES } from '../player/playerGenerator';

// Helper to parse CSV line respecting quotes
const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let start = 0;
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(line.substring(start, i).replace(/^"|"$/g, '').trim());
            start = i + 1;
        }
    }
    result.push(line.substring(start).replace(/^"|"$/g, '').trim());
    return result;
};

// Attribute Mapping Logic
const mapAttributes = (row: Record<string, string>): PlayerAttributes => {
    const getVal = (key: string) => parseInt(row[key]) || 50;

    // MSSI 14 Attributes Mapping
    // 1. Finishing: Avg of layup, driving_dunk, close_shot, standing_dunk
    const finishing = Math.round((getVal('layup') + getVal('driving_dunk') + getVal('close_shot') + getVal('standing_dunk')) / 4);

    // 2. Mid Range
    const midRange = getVal('mid_range_shot');

    // 3. Three Point
    const threePointShot = getVal('three_point_shot');

    // 4. Free Throw
    const freeThrow = getVal('free_throw');

    // 5. Playmaking: Avg of pass_accuracy, pass_vision, pass_iq
    const playmaking = Math.round((getVal('pass_accuracy') + getVal('pass_vision') + getVal('pass_iq')) / 3);

    // 6. Ball Handling
    const ballHandling = Math.round((getVal('ball_handle') + getVal('speed_with_ball')) / 2);

    // 7. Basketball IQ: Avg of shot_iq, offensive_consistency, help_defense_iq
    const basketballIQ = Math.round((getVal('shot_iq') + getVal('offensive_consistency') + getVal('help_defense_iq')) / 3);

    // 8. Interior Defense
    const interiorDefense = Math.round((getVal('interior_defense') + getVal('post_control')) / 2); // Post control contributes to post D contextually

    // 9. Perimeter Defense
    const perimeterDefense = getVal('perimeter_defense');

    // 10. Stealing
    const stealing = getVal('steal');

    // 11. Blocking
    const blocking = getVal('block');

    // 12. Offensive Rebound
    const offensiveRebound = getVal('offensive_rebound');

    // 13. Defensive Rebound
    const defensiveRebound = getVal('defensive_rebound');

    // 14. Athleticism (Still in model, useful for physics)
    const athleticism = Math.round((getVal('speed') + getVal('agility') + getVal('vertical') + getVal('strength')) / 4);

    return {
        finishing,
        midRange,
        threePointShot,
        freeThrow,
        playmaking,
        ballHandling,
        basketballIQ,
        interiorDefense,
        perimeterDefense,
        stealing,
        blocking,
        offensiveRebound,
        defensiveRebound,
        athleticism
    };
};

export const importNbaPlayers = async (teams: Team[], existingPlayers: Player[]): Promise<{ updatedTeams: Team[], newPlayers: Player[], newContracts: Contract[] }> => {
    try {
        const response = await fetch('/nba_players.csv');
        const text = await response.text();
        const lines = text.split('\n');
        const header = parseCSVLine(lines[0]);

        const players: Player[] = [];
        const teamMap = new Map<string, string>(); // "Denver Nuggets" -> TeamID

        // Build Team Map
        teams.forEach(t => {
            teamMap.set(`${t.city} ${t.name}`, t.id);
            teamMap.set(t.name, t.id); // Fallback
            // Special cases if needed
            if (t.name === 'Clippers') teamMap.set('LA Clippers', t.id);
            if (t.name === 'Lakers') teamMap.set('Los Angeles Lakers', t.id);
        });

        // Parse Players
        const parsedPlayers: any[] = []; // Temporary storage
        const newContracts: Contract[] = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = parseCSVLine(lines[i]);
            const row: Record<string, string> = {};
            header.forEach((h, index) => {
                row[h] = values[index];
            });

            const teamName = row['team'];
            const teamId = teamMap.get(teamName);

            if (teamId) {
                parsedPlayers.push({ ...row, teamId });
            }
        }

        // Sort by Overall Descending to prioritize best players
        parsedPlayers.sort((a, b) => (parseInt(b['overall']) || 0) - (parseInt(a['overall']) || 0));

        const teamRosterCounts: Record<string, number> = {};
        teams.forEach(t => {
            // Count existing players
            const count = existingPlayers.filter(p => p.teamId === t.id).length;
            teamRosterCounts[t.id] = count;
        });

        // Generate Player Objects
        parsedPlayers.forEach(row => {
            const teamId = row.teamId;
            if (teamRosterCounts[teamId] >= 15) return; // Skip if roster full

            const attributes = mapAttributes(row);

            const player: Player = {
                id: `nba_${row[''] || Math.random().toString(36).substr(2, 9)}`, // Use CSV ID if available (first col is empty name in header usually index)
                firstName: row['name'].split(' ')[0],
                lastName: row['name'].split(' ').slice(1).join(' '),
                position: (row['position_1'] as Position) || 'SG',
                age: parseInt(row.years_in_the_nba) + 19, // Approximation: years + 19
                height: parseInt(row.height_cm) || 200,
                weight: parseInt(row.weight_kg) || 95,
                personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
                attributes: attributes,
                overall: parseInt(row.overall) || 75,
                teamId: teamId,
                minutes: 0,
                isStarter: false,
                jerseyNumber: parseInt(row.jersey) || 0,
                morale: 100,
                fatigue: 0,
                stamina: 100,
                potential: parseInt(row.potential) || 80,
                loveForTheGame: parseInt(row.intangibles) || 80,
                seasonStats: {
                    gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                    turnovers: 0, fouls: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                    fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0,
                    plusMinus: 0
                },
                careerStats: [],
                tendencies: { // Defaults
                    shooting: 50, passing: 50, inside: 40, outside: 30,
                    defensiveAggression: 50, foulTendency: 50
                }
            };

            // Calculate Secondary Position
            player.secondaryPosition = calculateSecondaryPosition(player);

            // Refine Position based on CSV
            if (!['PG', 'SG', 'SF', 'PF', 'C'].includes(player.position)) {
                if (player.height < 190) player.position = 'PG';
                else if (player.height < 200) player.position = 'SF';
                else player.position = 'C';
            }

            players.push(player);
            teamRosterCounts[teamId]++;

            // Generate Contract for imported player
            const ovr = player.overall;
            const fairSalary = calculateFairSalary(ovr);

            // Randomize years (1-4)
            const years = Math.floor(Math.random() * 4) + 1;

            newContracts.push({
                id: `cont_${player.id}`,
                playerId: player.id,
                teamId: teamId,
                amount: fairSalary,
                yearsLeft: years,
                startYear: 2024, // Assuming current season
                role: player.overall > 80 ? 'Starter' : 'Rotation'
            });
        });

        // Update Teams with new Roster IDs
        const updatedTeams = teams.map(t => {
            const teamNewPlayers = players.filter(p => p.teamId === t.id).map(p => p.id);
            // Append to existing roster
            // Wait, existing roster might have dummy players we want to KEEP? 
            // The user said "fill only the spots needed". 
            // So we KEEP existing roster and ADD new ones up to limit.
            // But we need to update the Team object's rosterIds list.
            const existingRoster = existingPlayers.filter(p => p.teamId === t.id).map(p => p.id);
            return {
                ...t,
                rosterIds: [...Array.from(new Set([...t.rosterIds, ...teamNewPlayers]))]
            };
        });

        return { updatedTeams, newPlayers: players, newContracts };

    } catch (error) {
        console.error("Failed to import CSV", error);
        return { updatedTeams: teams, newPlayers: [], newContracts: [] };
    }
};
