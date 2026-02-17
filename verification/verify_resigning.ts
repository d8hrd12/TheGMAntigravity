
import { calculateOverall } from './src/utils/playerUtils';

// Mock types
interface Player {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    morale: number;
    teamId: string | null;
    careerStats: any[];
}

interface Team {
    id: string;
    abbreviation: string;
    wins: number;
    losses: number;
    cash: number;
    rosterIds: string[];
}

// Mocking the logic I just added to GameContext.tsx
const simulateResigning = (player: Player, team: Team) => {
    const ovr = calculateOverall(player as any);
    const isStar = ovr >= 85;
    const isStarter = ovr >= 78;
    const isYoung = player.age < 24 && ovr >= 70;

    const teamSuccess = team.wins / (Math.max(1, team.wins + team.losses));
    const happiness = player.morale || 80;

    let wantsOut = false;
    if (happiness < 60 || teamSuccess < 0.4) {
        wantsOut = true;
    }

    let shouldSign = false;

    if (wantsOut) {
        // High chance to refuse
        const refuseChance = (happiness < 40) ? 0.9 : 0.7;
        // In simulation, we check Math.random() > refuseChance
        // For testing, let's just log the probability
        console.log(`Player ${player.lastName} (${ovr} OVR, ${happiness} Morale, ${teamSuccess.toFixed(2)} Win%): Wants Out? ${wantsOut}, Refuse Probability: ${refuseChance}`);
    } else {
        if (isStar || (isStarter && team.rosterIds.length < 15)) {
            shouldSign = true;
        }
        if (isYoung) shouldSign = true;
        console.log(`Player ${player.lastName} (${ovr} OVR): Regular Sign Logic triggered. shouldSign: ${shouldSign}`);
    }
};

// Test Cases
const players: Player[] = [
    { id: '1', firstName: 'Unhappy', lastName: 'Star', age: 28, morale: 30, teamId: null, careerStats: [{ teamId: 'A' }] },
    { id: '2', firstName: 'Losing', lastName: 'Starter', age: 25, morale: 80, teamId: null, careerStats: [{ teamId: 'B' }] },
    { id: '3', firstName: 'Happy', lastName: 'Star', age: 28, morale: 95, teamId: null, careerStats: [{ teamId: 'C' }] }
];

const teams: Record<string, Team> = {
    'A': { id: 'A', abbreviation: 'ST1', wins: 50, losses: 32, cash: 100000000, rosterIds: [] },
    'B': { id: 'B', abbreviation: 'LT1', wins: 10, losses: 72, cash: 100000000, rosterIds: [] },
    'C': { id: 'C', abbreviation: 'HT1', wins: 60, losses: 22, cash: 100000000, rosterIds: [] }
};

console.log("--- Resigning Verification ---");
simulateResigning(players[0], teams['A']); // Unhappy Star (Low Morale)
simulateResigning(players[1], teams['B']); // Losing Starter (Poor Team Success)
simulateResigning(players[2], teams['C']); // Happy Star (High Morale, High Success)
