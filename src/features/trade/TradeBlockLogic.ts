import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import { getTeamState } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';

// Updates the trading block for all AI teams
export function updateLeagueTradingBlocks(
    teams: Team[],
    allPlayers: Player[],
    contracts: Contract[],
    userTeamId: string
): Team[] {
    return teams.map(team => {
        if (team.id === userTeamId) return team; // Skip User

        const roster = allPlayers.filter(p => p.teamId === team.id);
        const state = getTeamState(team);

        let block: { playerId: string; askingPriceDescription: string }[] = [];
        let needs: string[] = [];

        if (state === 'Rebuilding') {
            needs = ['Draft Picks', 'Young Talent (<23)'];

            // Sell Veterans (Age > 27, OVR > 75)
            const vets = roster.filter(p => p.age > 27 && (p.overall || calculateOverall(p)) > 75);
            vets.forEach(p => {
                // Don't trade if Morale is super high and they are "Loyalist"? (Optional complexity)
                block.push({ playerId: p.id, askingPriceDescription: '1st Round Picks / High Upside Prospects' });
            });

            // Sell Expiring Role Players (Rentals)
            const expirings = roster.filter(p => {
                const c = contracts.find(c => c.playerId === p.id);
                return c && c.yearsLeft === 1 && p.age > 26;
            });
            expirings.forEach(p => {
                if (!block.find(b => b.playerId === p.id)) {
                    block.push({ playerId: p.id, askingPriceDescription: '2nd Round Picks' });
                }
            });

        } else if (state === 'Contender') {
            needs = ['3&D Wing', 'Rim Protection', 'Vets'];

            // Trade Youth that isn't ready (Age < 23, OVR < 75) to get help now
            const projects = roster.filter(p => p.age < 23 && (p.overall || calculateOverall(p)) < 75);
            projects.forEach(p => {
                block.push({ playerId: p.id, askingPriceDescription: 'Veteran Bench Help' });
            });

            // Dump Salary? (Not implemented deep yet)
        } else {
            // "Retooling" / Playoff Team
            // More opportunistic. Trade unhappy players?
            const unhappy = roster.filter(p => p.morale < 30);
            unhappy.forEach(p => {
                block.push({ playerId: p.id, askingPriceDescription: 'Change of Scenery (Equal Value)' });
            });
        }

        // CAP SIZE: Don't put entire team on block
        return {
            ...team,
            tradingBlock: block.slice(0, 3), // Limit to top 3 actionable items
            teamNeeds: needs
        };
    });
}
