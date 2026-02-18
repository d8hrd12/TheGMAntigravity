import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

import { calculateContractAmount } from '../../utils/contractUtils';

export const MORALE_THRESHOLDS = {
    ANGRY: 20,
    UNHAPPY: 45,
    CONTENT: 70,
    HAPPY: 90
};

export interface HeatCheckResult {
    isHot: boolean;
    boost: number; // 0 to 10
}

export function calculateHeatCheck(player: Player): HeatCheckResult {
    const stats = player.seasonStats;
    if (!stats || stats.gamesPlayed < 3) return { isHot: false, boost: 0 };

    // Simple heuristic: averaging 25+ ppg over last 3 games (simplified here)
    if (player.overall > 85 && Math.random() < 0.1) {
        return { isHot: true, boost: 5 };
    }

    return { isHot: false, boost: 0 };
}

export function updatePlayerMorale(
    player: Player,
    team: Team,
    wonLastGame: boolean,
    minutesPlayedLastGame: number,
    opponentId?: string,
    salaryCap: number = 140000000
): Player {
    if (!player) return player;

    const currentMorale = typeof player.morale === 'number' && !isNaN(player.morale) ? player.morale : 50;
    let change = 0;

    // 1. Team Performance
    if (team) {
        if (wonLastGame) {
            change += 1;
            if (player.personality === 'Professional') change += 0.5;

            // Rivalry Win Bonus
            if (opponentId && team.rivalIds?.includes(opponentId)) {
                change += 2;
                if (player.personality === 'Loyalist' || player.personality === 'Enforcer') change += 1;
            }
        } else {
            let lossPenalty = 1;

            if (player.personality === 'Diva') lossPenalty = 2.5;
            if (player.personality === 'Loyalist') lossPenalty = 0.5;
            if (player.personality === 'Mercenary') lossPenalty = 0;
            if (player.personality === 'Enforcer') lossPenalty = 1.5;

            change -= lossPenalty;

            // Rivalry Loss Penalty
            if (opponentId && team.rivalIds?.includes(opponentId)) {
                change -= 2;
                if (player.personality === 'Diva' || player.personality === 'Enforcer') change -= 2;
            }

            const wins = team.wins || 0;
            const losses = team.losses || 0;
            const winPct = (wins + losses) > 0 ? wins / (wins + losses) : 0.5;

            if ((player.overall || 0) > 85 && winPct < 0.40) {
                if (player.personality === 'Loyalist') change -= 1;
                else change -= 2;
            }
        }
    }

    // 2. Playing Time & Contract Situations
    const fmv = calculateContractAmount(player, salaryCap);
    const isUnderpaid = (player.contractValue || 0) < (fmv.amount * 0.7);
    let target = player.minutes || 0;

    if (isUnderpaid) {
        target = Math.max(target, 25);
    }

    if (minutesPlayedLastGame < target * 0.7) {
        let benchPenalty = 2;
        if ((player.overall || 0) > 80 && minutesPlayedLastGame < 25) {
            benchPenalty = 5;
        }

        if (player.personality === 'Diva') benchPenalty *= 1.5;
        if (player.personality === 'Workhorse') benchPenalty *= 1.5;
        if (player.personality === 'Mercenary') benchPenalty *= 1.2;

        if (isUnderpaid) change -= (benchPenalty + 2);
        else change -= benchPenalty;

        if (player.personality === 'Diva' && !player.isStarter && (player.overall > 75)) {
            change -= 2;
        }

    } else if (minutesPlayedLastGame > target * 1.2) {
        change += 1;
        if (player.personality === 'Workhorse') change += 1;
        if (isUnderpaid) change += 2;
    } else {
        change += 0.5;
    }

    if (player.personality === 'Unpredictable') {
        change += (Math.random() * 4) - 2;
    }

    let demandTrade = player.demandTrade || false;
    let yearsUnhappy = player.yearsUnhappy || 0;
    let tradeRequested = player.tradeRequested || false;

    let newMorale = Math.max(0, Math.min(100, currentMorale + change));
    if (isNaN(newMorale)) newMorale = 50;

    if (newMorale < MORALE_THRESHOLDS.ANGRY) {
        const tradeDemandChance = player.personality === 'Diva' ? 0.10 : 0.05;
        if (Math.random() < tradeDemandChance) demandTrade = true;
    }

    return {
        ...player,
        morale: newMorale,
        demandTrade,
        yearsUnhappy,
        tradeRequested
    };
}

export function applyTeamDynamics(roster: Player[]): Player[] {
    const toxicPlayers = roster.filter(p => (p.morale || 50) < 20);
    const leaders = roster.filter(p =>
        (p.personality === 'Silent Leader' || p.personality === 'Loyalist') &&
        (p.morale || 50) > 80
    );

    const hasLeader = leaders.length > 0;
    if (toxicPlayers.length === 0) return roster;

    let penalty = toxicPlayers.length * 0.5;
    if (hasLeader) penalty = penalty * 0.5;

    return roster.map(p => {
        if ((p.morale || 50) < 20) return p;
        if (p.personality === 'Mercenary') return p;
        const newMorale = Math.max(0, (p.morale || 50) - penalty);
        return { ...p, morale: newMorale };
    });
}

export function checkTradeRequests(player: Player): Player {
    let { yearsUnhappy = 0, tradeRequested = false, morale = 50 } = player;

    if (morale < 40) {
        yearsUnhappy++;
    } else if (morale > 70) {
        yearsUnhappy = 0;
        tradeRequested = false;
    }

    if (yearsUnhappy >= 1 && morale < 35) {
        tradeRequested = true;
    }

    return { ...player, yearsUnhappy, tradeRequested };
}

export const checkProveItDemands = (player: Player, date: Date): { player: Player, news?: { headline: string, content: string } } => {
    if (player.contractType !== 'prove_it') return { player };

    const isDeadlineMonth = date.getMonth() === 1; // Feb
    const stats = player.seasonStats;
    if (!stats || stats.gamesPlayed < 5) return { player };

    const mpg = stats.minutes / stats.gamesPlayed;

    if (mpg < 24) {
        if (date.getMonth() === 11 || date.getMonth() === 0) {
            if (Math.random() < 0.05) {
                return {
                    player,
                    news: {
                        headline: `${player.lastName} Frustrated with Role`,
                        content: `${player.lastName}, on a one-year 'prove it' deal, is reportedly furious about his lack of playing time (${mpg.toFixed(1)} MPG).`
                    }
                };
            }
        }
        else if (isDeadlineMonth && !player.tradeRequested) {
            return {
                player: { ...player, tradeRequested: true, morale: 0 },
                news: {
                    headline: `${player.lastName} Demands Trade!`,
                    content: `After failing to secure a significant role, ${player.lastName} has formally requested a trade before the deadline to save his next contract.`
                }
            };
        }
    }

    return { player };
};
