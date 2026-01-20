import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

import { calculateContractAmount } from '../../utils/contractUtils';

export const MORALE_THRESHOLDS = {
    ANGRY: 20,
    UNHAPPY: 45,
    CONTENT: 70,
    HAPPY: 90
};

export function updatePlayerMorale(player: Player, team: Team, wonLastGame: boolean, minutesPlayedLastGame: number, salaryCap: number = 140000000): Player {
    if (!player) return player;

    // Ensure inputs are valid
    const currentMorale = typeof player.morale === 'number' && !isNaN(player.morale) ? player.morale : 50;

    let change = 0;

    // 1. Team Performance
    if (team) {
        if (wonLastGame) {
            change += 1; // Winning cures everything
            if (player.personality === 'Professional') change += 0.5; // Pros love efficiency
        } else {
            // Losing hurts morale
            let lossPenalty = 1;

            // Personality Modifiers
            if (player.personality === 'Diva') lossPenalty = 2.5;
            if (player.personality === 'Loyalist') lossPenalty = 0.5;
            if (player.personality === 'Mercenary') lossPenalty = 0; // Don't care as long as I get paid
            if (player.personality === 'Enforcer') lossPenalty = 1.5; // Hates losing

            change -= lossPenalty;

            // If team is tanking (low wins), stars get frustrated faster
            const wins = team.wins || 0;
            const losses = team.losses || 0;
            const winPct = (wins + losses) > 0 ? wins / (wins + losses) : 0.5;

            if ((player.overall || 0) > 85 && winPct < 0.40) {
                // Stars hate losing
                if (player.personality === 'Loyalist') change -= 1; // Loyalists still hurt, but less
                else change -= 2;
            }
        }
    }

    // 2. Playing Time & Contract Situations
    // Check for "Prove It" / Underpaid situations
    // Fair Market Value
    const fmv = calculateContractAmount(player, salaryCap);
    const isUnderpaid = (player.contractValue || 0) < (fmv.amount * 0.7);

    // Target minutes logic
    let target = player.minutes || 0;

    // If underpaid (e.g. took a pay cut to prove themselves), they EXPECT minutes.
    if (isUnderpaid) {
        // Boost expectation if they feel they deserve more money -> "Let me play so I can get paid next year"
        target = Math.max(target, 25);
    }

    if (minutesPlayedLastGame < target * 0.7) {
        // Did not play enough
        let benchPenalty = 2;

        if ((player.overall || 0) > 80 && minutesPlayedLastGame < 25) {
            benchPenalty = 5;
        }

        if (player.personality === 'Diva') benchPenalty *= 1.5;
        if (player.personality === 'Workhorse') benchPenalty *= 1.5; // Wants to work
        if (player.personality === 'Mercenary') benchPenalty *= 1.2; // Needs stats for contract

        if (isUnderpaid) {
            // The fatal combo: Not getting paid AND not playing
            change -= (benchPenalty + 2);
        } else {
            change -= benchPenalty;
        }

        // Personality Check: Is Starter?
        if (player.personality === 'Diva' && !player.isStarter && (player.overall > 75)) {
            change -= 2; // "I should be starting!"
        }

    } else if (minutesPlayedLastGame > target * 1.2) {
        // Overplayed (maybe happy for minutes, but fatigued?)
        change += 1;
        if (player.personality === 'Workhorse') change += 1; // Loves the grind
        if (isUnderpaid) change += 2; // "I'm earning my next contract!" - Bonus happiness
    } else {
        // Met expectations
        change += 0.5;
    }

    // Unpredictable Variance
    if (player.personality === 'Unpredictable') {
        const randomSwing = (Math.random() * 4) - 2; // -2 to +2
        change += randomSwing;
    }

    // 3. Trade Demand Logic
    let demandTrade = player.demandTrade || false;
    let yearsUnhappy = player.yearsUnhappy || 0;
    let tradeRequested = player.tradeRequested || false;

    let newMorale = Math.max(0, Math.min(100, currentMorale + change));
    if (isNaN(newMorale)) newMorale = 50; // Safety Fallback

    // 4. Persistence of unhappiness
    if (newMorale < MORALE_THRESHOLDS.ANGRY) {
        // If extremely angry, chance to demand trade immediately
        // Divas crack faster
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

// Check for Team Dynamics (Toxic Influence & Leadership)
export function applyTeamDynamics(roster: Player[]): Player[] {
    const toxicPlayers = roster.filter(p => (p.morale || 50) < 20);

    // Check for Leaders
    const leaders = roster.filter(p =>
        (p.personality === 'Silent Leader' || p.personality === 'Loyalist') &&
        (p.morale || 50) > 80
    );

    const hasLeader = leaders.length > 0;

    if (toxicPlayers.length === 0) return roster;

    // Leader Buff: Leaders absorb some toxicity
    // If we have a leader, halve the penalty
    let penalty = toxicPlayers.length * 0.5;
    if (hasLeader) penalty = penalty * 0.5;

    return roster.map(p => {
        if ((p.morale || 50) < 20) return p; // Toxic players don't hurt themselves more

        // Mercenaries dont care about locker room vibes
        if (p.personality === 'Mercenary') return p;

        const newMorale = Math.max(0, (p.morale || 50) - penalty);
        return { ...p, morale: newMorale };
    });
}

// End of Season / Deadline Logic
export function checkTradeRequests(player: Player): Player {
    let { yearsUnhappy = 0, tradeRequested = false, morale = 50 } = player;

    if (morale < 40) {
        yearsUnhappy++;
    } else if (morale > 70) {
        yearsUnhappy = 0;
        tradeRequested = false; // Player is happy again, rescinds request
    }

    // If unhappy for a year and still unhappy, or miserable now
    if (yearsUnhappy >= 1 && morale < 35) {
        tradeRequested = true;
    }

    return { ...player, yearsUnhappy, tradeRequested };
}

export const checkProveItDemands = (player: Player, date: Date): { player: Player, news?: { headline: string, content: string } } => {
    if (player.contractType !== 'prove_it') return { player };

    // Deadline check (Feb 1st approx)
    const isDeadlineMonth = date.getMonth() === 1; // Feb

    // Check performance logic
    const stats = player.seasonStats;
    if (!stats || stats.gamesPlayed < 5) return { player }; // Too early

    const mpg = stats.minutes / stats.gamesPlayed;

    // Unhappy condition for Prove-It player:
    // Not getting minutes to prove themself (<24 MPG)

    if (mpg < 24) {
        // Warning Phase (Dec/Jan)
        if (date.getMonth() === 11 || date.getMonth() === 0) {
            // 5% chance of rumor per day
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
        // Deadline Phase (Feb) - Demand Trade
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
