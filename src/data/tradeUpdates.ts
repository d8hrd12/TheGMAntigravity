import type { GameState } from '../store/GameContext';
import { generateUUID } from '../utils/uuid';
import type { DraftPick } from '../models/DraftPick';

interface TradeMove {
    player: string; // "FirstName LastName"
    to: string; // Team Abbreviation (e.g. "WAS")
}

interface PickMove {
    year: number;
    round: 1 | 2;
    originalOwner: string; // Team Abbreviation of the pick's original owner
    to: string; // Team Abbreviation of the new owner
    count?: number; // How many picks (if generic "Two future second-round picks") - usually better to be specific if possible, but we'll try to match.
    // For specific "via" picks, we might need more logic, but let's start with finding the pick by Year + Round + OriginalOwner.
}

// Team Map to ID
const TEAM_ABBR_TO_ID: Record<string, string> = {
    'LAL': '1', 'GSW': '2', 'PHX': '3', 'LAC': '4', 'SAC': '5',
    'DAL': '6', 'MEM': '7', 'DEN': '8', 'MIN': '9', 'NOP': '10',
    'OKC': '11', 'POR': '12', 'UTA': '13', 'SAS': '14', 'HOU': '15',
    'BOS': '16', 'CHI': '17', 'MIL': '18', 'PHI': '19', 'CLE': '20',
    'NYK': '21', 'MIA': '22', 'ATL': '23', 'TOR': '24', 'BKN': '25',
    'IND': '26', 'WAS': '27', 'ORL': '28', 'CHA': '29', 'DET': '30'
};

const PLAYER_MOVES: TradeMove[] = [
    // Wizards / Mavs / Hornets
    { player: "Malaki Branham", to: "CHA" },
    { player: "Khris Middleton", to: "DAL" },
    { player: "AJ Johnson", to: "DAL" },
    { player: "Tyus Jones", to: "DAL" }, // Initially listed to DAL from Hornets? Wait, user said "Tyus Jones (via Hornets)" to Dallas.
    { player: "Marvin Bagley III", to: "DAL" },
    { player: "Anthony Davis", to: "WAS" },
    { player: "Jaden Hardy", to: "WAS" },
    { player: "D'Angelo Russell", to: "WAS" },
    { player: "Dante Exum", to: "WAS" },

    // Warriors / Hawks
    { player: "Jonathan Kuminga", to: "ATL" },
    { player: "Buddy Hield", to: "ATL" },
    { player: "Kristaps Porzingis", to: "GSW" }, // Porziņģis

    // Pacers / Clippers
    { player: "Ivica Zubac", to: "IND" },
    { player: "Kobe Brown", to: "IND" },
    { player: "Bennedict Mathurin", to: "LAC" },
    { player: "Isaiah Jackson", to: "LAC" },

    // Celtics / Bulls
    { player: "Nikola Vucevic", to: "BOS" }, // Vučević
    { player: "Anfernee Simons", to: "CHI" },

    // Timberwolves / Bulls
    { player: "Rob Dillingham", to: "CHI" },
    { player: "Leonard Miller", to: "CHI" },
    { player: "Ayo Dosunmu", to: "MIN" },
    { player: "Julian Phillips", to: "MIN" },

    // Suns / Bucks / Bulls
    { player: "Nigel Hayes-Davis", to: "MIL" },
    { player: "Ousmane Dieng", to: "MIL" }, // Note: Dieng is traded MULTIPLE times in the user list. Thunder -> Hornets, then Hornets -> Bulls? 
    // Wait, the list has:
    // "Thunder deal Dieng to Hornets (Feb 4)"
    // "Hornets snag White from Bulls... Chicago receives Ousmane Dieng"
    // "Suns add Cole Anthony from Bucks... Milwaukee receives Ousmane Dieng (via Chicago)"
    // So Dieng route: OKC -> CHA -> CHI -> MIL.
    // Final destination: MIL.
    { player: "Cole Anthony", to: "PHX" },
    { player: "Amir Coffey", to: "PHX" },
    { player: "Nick Richards", to: "CHI" },

    // Hornets / Bulls (White)
    { player: "Mike Conley", to: "CHA" }, // "Mike Conley Jr."
    { player: "Coby White", to: "CHA" },
    { player: "Collin Sexton", to: "CHI" },

    // Knicks / Pelicans
    { player: "Jose Alvarado", to: "NYK" },
    { player: "Dalen Terry", to: "NOP" }, // Wait, "Bulls work Yabusele... New York receives Dalen Terry". 
    // Then "Knicks add Alvarado... New Orleans receives Dalen Terry".
    // So Terry route: CHI -> NYK -> NOP.
    // Final: NOP.

    // Bulls / Knicks
    { player: "Guerschon Yabusele", to: "CHI" },

    // Raptors / Warriors
    { player: "Trayce Jackson-Davis", to: "TOR" },

    // Lakers / Hawks
    { player: "Luke Kennard", to: "LAL" },
    { player: "Gabe Vincent", to: "ATL" },

    // Raptors / Nets / Clippers (CP3)
    { player: "Chris Paul", to: "TOR" },
    { player: "Ochai Agbaji", to: "BKN" },
    // "Rights to Vanja Marinković" - likely not in game, skip.

    // Hawks / Jazz / Cavaliers (Lonzo)
    { player: "Jock Landale", to: "ATL" },
    { player: "Lonzo Ball", to: "UTA" },

    // Hornets / Celtics
    { player: "Xavier Tillman", to: "CHA" }, // "Tillman Sr."

    // Nets / Celtics
    { player: "Josh Minott", to: "BKN" },

    // Nets / Nuggets
    { player: "Hunter Tyson", to: "BKN" },

    // Grizzlies / Sixers
    { player: "Eric Gordon", to: "MEM" },
    // "Justinian Jessup" - skip

    // Cavs / Clippers (Harden)
    { player: "James Harden", to: "CLE" },
    { player: "Darius Garland", to: "LAC" },

    // Sixers / Thunder
    { player: "Jared McCain", to: "OKC" },

    // Thunder / Hornets
    { player: "Mason Plumlee", to: "OKC" },

    // Hornets / Magic
    // "Charlotte receives Tyus Jones". 
    // Wait, earlier trade "Wizards land Davis... Dallas receives Tyus Jones (via Hornets)".
    // So Jones route: ORL -> CHA -> DAL.
    // Final: DAL. (Already covered in first block)

    // Jazz / Grizzlies (JJJ)
    { player: "Jaren Jackson Jr.", to: "UTA" },
    // "Jock Landale" to Jazz in this trade block? 
    // "Utah receives Jaren Jackson Jr., Jock Landale...".
    // But later "Hash to Jazz... Atlanta receives Jock Landale (via Jazz)".
    // So Landale route: MEM -> UTA -> ATL.
    // Final: ATL. (Already covered)
    { player: "John Konchar", to: "UTA" },
    { player: "Vince Williams Jr.", to: "UTA" },
    { player: "Walter Clayton Jr.", to: "MEM" },
    { player: "Kyle Anderson", to: "MEM" },
    { player: "Taylor Hendricks", to: "MEM" },
    { player: "Georges Niang", to: "MEM" },

    // Pistons / Bulls / Wolves
    { player: "Kevin Huerter", to: "DET" },
    { player: "Dario Saric", to: "DET" }, // Šarić
    // "Chicago receives Mike Conley Jr (via Minnesota)" -> Then Conley to CHA.
    // "Chicago receives Jaden Ivey".
    { player: "Jaden Ivey", to: "CHI" },

    // Hawks / Blazers
    { player: "Vit Krejci", to: "POR" }, // Vít Krejčí
    { player: "Duop Reath", to: "ATL" },

    // Cavaliers / Kings / Bulls
    { player: "Keon Ellis", to: "CLE" },
    { player: "Dennis Schroder", to: "CLE" }, // Schröder
    { player: "Emanuel Miller", to: "CLE" },
    // "Chicago receives Dario Saric" -> Then Saric to DET.
    { player: "De'Andre Hunter", to: "SAC" }
];

// For draft picks, we just identify them by Original Owner + Year + Round
const PICK_MOVES: PickMove[] = [
    // Dallas Receives
    { year: 2026, round: 1, originalOwner: "OKC", to: "DAL" },
    { year: 2030, round: 1, originalOwner: "GSW", to: "DAL" },
    // "Three future second-round picks (via Wizards)"
    { year: 2026, round: 2, originalOwner: "WAS", to: "DAL" },
    { year: 2027, round: 2, originalOwner: "WAS", to: "DAL" },
    { year: 2028, round: 2, originalOwner: "WAS", to: "DAL" },

    // Clippers Receive
    { year: 2026, round: 1, originalOwner: "IND", to: "LAC" },
    { year: 2029, round: 1, originalOwner: "IND", to: "LAC" },
    { year: 2028, round: 2, originalOwner: "IND", to: "LAC" },

    // Boston Receives
    { year: 2027, round: 2, originalOwner: "CHI", to: "BOS" }, // Ambiguous owner, assume CHI own pick

    // Chicago Receives
    { year: 2026, round: 2, originalOwner: "BOS", to: "CHI" },

    // Chicago Receives (from Wolves trade)
    { year: 2026, round: 2, originalOwner: "DEN", to: "CHI" }, // "least favorable Denver or Golden State" - taking DEN for simplicity
    { year: 2027, round: 2, originalOwner: "CLE", to: "CHI" },
    { year: 2031, round: 2, originalOwner: "MIN", to: "CHI" },
    { year: 2032, round: 2, originalOwner: "PHX", to: "CHI" },

    // Chicago Receives (from Hornets trade)
    { year: 2029, round: 2, originalOwner: "CHA", to: "CHI" },
    { year: 2031, round: 2, originalOwner: "NYK", to: "CHI" },
    { year: 2031, round: 2, originalOwner: "DEN", to: "CHI" },

    // New Orleans Receives
    { year: 2025, round: 2, originalOwner: "NYK", to: "NOP" },
    { year: 2026, round: 2, originalOwner: "NYK", to: "NOP" },

    // Warriors Receive
    { year: 2026, round: 2, originalOwner: "LAL", to: "GSW" },

    // Atlanta Receives
    { year: 2032, round: 2, originalOwner: "LAL", to: "ATL" }, // From LAL/Kennard trade

    // Brooklyn Receives
    { year: 2032, round: 2, originalOwner: "TOR", to: "BKN" },

    // Utah Receives (from Lonzo trade)
    { year: 2026, round: 2, originalOwner: "CLE", to: "UTA" },
    { year: 2027, round: 2, originalOwner: "CLE", to: "UTA" },

    // Boston Receives (from Tillman)
    { year: 2030, round: 2, originalOwner: "CHA", to: "BOS" },

    // Brooklyn Receives (from Hunter Tyson)
    { year: 2032, round: 2, originalOwner: "DEN", to: "BKN" },

    // Denver Receives
    { year: 2026, round: 2, originalOwner: "ATL", to: "DEN" },

    // Philly Receives
    // "2032 second round pick swap" - Skipping swaps for now as simple ownership functionality.

    // LA receives (Harden)
    { year: 2025, round: 2, originalOwner: "CLE", to: "LAC" }, // "Future second"

    // Philly Receives (McCain)
    { year: 2026, round: 1, originalOwner: "OKC", to: "PHI" }, // Note: OKC has many picks, assume own.
    { year: 2027, round: 2, originalOwner: "OKC", to: "PHI" },
    { year: 2028, round: 2, originalOwner: "OKC", to: "PHI" },
    { year: 2029, round: 2, originalOwner: "OKC", to: "PHI" },

    // Charlotte Receives (Dieng)
    { year: 2029, round: 2, originalOwner: "OKC", to: "CHA" },

    // Charlotte Receives (Tyus Jones)
    { year: 2025, round: 2, originalOwner: "ORL", to: "CHA" },
    { year: 2026, round: 2, originalOwner: "ORL", to: "CHA" },

    // Memphis Receives (JJJ trade)
    { year: 2025, round: 1, originalOwner: "UTA", to: "MEM" },
    { year: 2027, round: 1, originalOwner: "UTA", to: "MEM" },
    { year: 2029, round: 1, originalOwner: "UTA", to: "MEM" },

    // Detroit Receives
    { year: 2026, round: 1, originalOwner: "MIN", to: "DET" }, // "Swap" - giving ownership for simplicity

    // Atlanta Receives (Krecji)
    { year: 2027, round: 2, originalOwner: "POR", to: "ATL" },
    { year: 2030, round: 2, originalOwner: "POR", to: "ATL" },

    // Chicago Receives (Cavs/Kings)
    { year: 2027, round: 2, originalOwner: "SAC", to: "CHI" },
    { year: 2029, round: 2, originalOwner: "SAC", to: "CHI" }
];

export const applyRealWorldTrades = (gameState: GameState): GameState => {
    let players = [...gameState.players];
    let teams = [...gameState.teams];
    let contracts = [...gameState.contracts];
    let transactions = [...gameState.transactions];

    console.log("Applying Real World Trades...");

    // 1. Apply Player Moves
    PLAYER_MOVES.forEach(move => {
        const destTeamId = TEAM_ABBR_TO_ID[move.to];
        if (!destTeamId) {
            console.error(`Invalid Destination Team: ${move.to}`);
            return;
        }

        // Fuzzy match for player name
        const playerIndex = players.findIndex(p => {
            const fullName = `${p.firstName} ${p.lastName}`;
            // Simple inclusion or exact match
            return fullName.toLowerCase().includes(move.player.toLowerCase());
        });

        if (playerIndex !== -1) {
            const player = players[playerIndex];
            const oldTeamId = player.teamId;

            if (oldTeamId === destTeamId) return; // Already there

            // Update Player
            players[playerIndex] = { ...player, teamId: destTeamId };

            // Update Roster IDs
            if (oldTeamId) {
                const oldTeam = teams.find(t => t.id === oldTeamId);
                if (oldTeam) {
                    oldTeam.rosterIds = oldTeam.rosterIds.filter(id => id !== player.id);
                }
            }

            const newTeam = teams.find(t => t.id === destTeamId);
            if (newTeam) {
                if (!newTeam.rosterIds.includes(player.id)) {
                    newTeam.rosterIds.push(player.id);
                }
            }

            // Update Contract
            const contractIndex = contracts.findIndex(c => c.playerId === player.id);
            if (contractIndex !== -1) {
                contracts[contractIndex] = { ...contracts[contractIndex], teamId: destTeamId };
            }

            transactions.push({
                date: gameState.date,
                type: 'Trade',
                description: `[Real-World Update] ${player.firstName} ${player.lastName} traded to ${move.to}`
            });

        } else {
            console.warn(`Player not found during Trade Update: ${move.player}`);
        }
    });

    // 2. Apply Pick Moves
    // Note: Teams usually only have 4 years of picks generated.
    // If a trade asks for a 2031 pick, we might need to GENERATE it if it doesn't exist,
    // OR just ignore it if the game only tracks 4 years.
    // The current game generation (see GameContext) creates picks for 2025, 2026, 2027, 2028.
    // So 2030+ picks will be ignored for now.

    const allPicks = teams.flatMap(t => t.draftPicks);

    PICK_MOVES.forEach(move => {
        const originalOwnerId = TEAM_ABBR_TO_ID[move.originalOwner];
        const destTeamId = TEAM_ABBR_TO_ID[move.to];

        if (!originalOwnerId || !destTeamId) return;

        // Find the pick
        // We look for a pick owned by *anyone* (could have been traded before naturally, but here we assume init state)
        // that matches Year, Round, OriginalOwner.

        // Actually, in our game model, a pick object lives on the Team that currently owns it.
        // But `teams` array has `draftPicks` array on each team.
        // So we need to search ALL teams to find who currently has this pick, then move it.

        let found = false;

        for (const team of teams) {
            const pickIndex = team.draftPicks.findIndex(p =>
                p.year === move.year &&
                p.round === move.round &&
                p.originalTeamId === originalOwnerId
            );

            if (pickIndex !== -1) {
                const [pick] = team.draftPicks.splice(pickIndex, 1);

                // Add to new team
                const destTeam = teams.find(t => t.id === destTeamId);
                if (destTeam) {
                    destTeam.draftPicks.push(pick);
                    found = true;
                    // console.log(`Moved ${move.year} R${move.round} (${move.originalOwner}) to ${move.to}`);
                }
                break;
            }
        }

        if (!found) {
            // Pick doesn't exist (e.g. year out of range). 
            // In a deeper implementation, we would create it.
            // console.warn(`Pick not found: ${move.year} R${move.round} via ${move.originalOwner}`);
        }
    });

    return {
        ...gameState,
        players,
        teams,
        contracts,
        transactions
    };
};
