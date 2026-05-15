import type { Player } from '../../../models/Player';
import type { Team } from '../../../models/Team';
import { calculateOverall } from '../../../utils/playerUtils';
import { calculateEuroBuyoutFee, isEuroPlayerUntouchable } from '../../team/EuroAIGMModule';

import type { Contract } from '../../../models/Contract';

export interface NegotiationResult {
    decision: 'ACCEPTED' | 'REJECTED' | 'COUNTER' | 'INSULTED';
    msg: string;
    counterAmount?: number;
}

/**
 * AI Negotiation Logic for European Buyouts (Club-to-Club)
 */
export function negotiateEuroBuyout(
    player: Player, 
    buyerTeam: Team, 
    sellerTeam: Team, 
    sellerRoster: Player[], 
    allContracts: Contract[],
    offerAmount: number,
    previousOffer?: number
): NegotiationResult {
    // 0. Check Untouchable Status
    const untouchableCheck = isEuroPlayerUntouchable(player, sellerTeam, sellerRoster, buyerTeam);
    if (untouchableCheck.untouchable) {
        return {
            decision: 'REJECTED',
            msg: untouchableCheck.reason || "This player is not for sale."
        };
    }

    const value = calculateEuroBuyoutFee(player, sellerTeam, sellerRoster, allContracts);
    
    // 0.1 Buyout Clause Logic: If they pay the clause, it's an automatic YES.
    const contract = allContracts.find(c => c.playerId === player.id);
    if (contract?.buyoutClause && offerAmount >= contract.buyoutClause) {
        return {
            decision: 'ACCEPTED',
            msg: "The release clause has been met. We have no choice but to accept your offer."
        };
    }

    const ratio = offerAmount / value;

    // 1. Offload Mode (If team is broke or player is a surplus)
    const isOffloading = sellerTeam.cash <= 0 || sellerRoster.filter(p => p.position === player.position).length > 3;
    const targetFloor = isOffloading ? 0.8 : 1.0;

    // 2. Response Logic
    if (ratio >= targetFloor) {
        return {
            decision: 'ACCEPTED',
            msg: "We have reached an agreement. You are free to discuss personal terms with the player."
        };
    }

    if (ratio < 0.4) {
        return {
            decision: 'INSULTED',
            msg: "This offer is a joke. We are not interested in selling at this price."
        };
    }

    // 3. Counter-Offer Logic (based on training)
    let counter = value * 1.3; // Start high (6.5 for 5)
    
    if (previousOffer && offerAmount > previousOffer) {
        const jump = (offerAmount - previousOffer) / value;
        if (jump > 0.15) {
            // Significant move by buyer, we meet in middle
            counter = value * 1.1; // Drop to 5.5 for 5
        }
    }

    if (ratio < 0.7) {
        return {
            decision: 'COUNTER',
            msg: `Your offer is too low for a player of his importance. We want at least €${new Intl.NumberFormat('de-DE').format(Math.round(counter))}.`,
            counterAmount: Math.round(counter)
        };
    }

    return {
        decision: 'COUNTER',
        msg: "We are close, but we want a bit more to let him go.",
        counterAmount: Math.round(value * 1.05)
    };
}

/**
 * AI Negotiation Logic for European Player Contracts
 */
export function negotiateEuroContract(
    player: Player,
    team: Team,
    isContender: boolean,
    offerAmount: number,
    demandAmount: number,
    round: number
): NegotiationResult {
    const ratio = offerAmount / demandAmount;

    if (ratio >= 0.96) {
        return { decision: 'ACCEPTED', msg: "I'm happy with these terms. Let's do it!" };
    }

    if (round >= 4) {
        return { decision: 'INSULTED', msg: "We've talked enough. I'm looking for other options now." };
    }

    // Contender Discount Logic (Training: small discount for contenders)
    const discount = isContender ? 0.92 : 1.0;
    const effectiveDemand = demandAmount * discount;

    if (offerAmount >= effectiveDemand) {
        return { decision: 'ACCEPTED', msg: "Because this is a winning project, I'll accept this offer." };
    }

    // Counter Logic (Training: Offer 1.0, Demand 1.5 -> Counter 1.3)
    const counter = offerAmount + (demandAmount - offerAmount) * 0.6;
    
    return {
        decision: 'COUNTER',
        msg: `Round ${round}/4: I appreciate the interest, but I'm looking for closer to €${new Intl.NumberFormat('de-DE').format(Math.round(counter))}.`,
        counterAmount: Math.round(counter)
    };
}
