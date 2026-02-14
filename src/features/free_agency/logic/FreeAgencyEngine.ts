import type { Team } from '../../../models/Team';
import type { Player } from '../../../models/Player';
import type { GameState } from '../../../store/GameContext';
import { calculateOverall } from '../../../utils/playerUtils';
import { generateContract, calculateContractAmount } from '../../../utils/contractUtils';
import { getTeamDirection, analyzeRosterEcosystem, getCapOutlook } from '../../simulation/logic/TeamStrategyModule';
import { evaluateFreeAgent } from './PlayerEvaluationModule';

const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export interface FreeAgencyOffer {
    id: string;
    playerId: string;
    teamId: string;
    amount: number; // Annual amount
    years: number;
    dayOffered: number;
    isUserOffer: boolean;
    status: 'pending' | 'accepted' | 'rejected' | 'outbid';
}

export interface DaySimulationResult {
    offersMade: FreeAgencyOffer[];
    signings: { playerId: string; teamId: string; amount: number; years: number }[];
    news: string[];
}

// 3. Simulate Day
export const simulateFreeAgencyDay = (
    gameState: GameState,
    day: number
): { newState: GameState; result: DaySimulationResult } => {

    const result: DaySimulationResult = { offersMade: [], signings: [], news: [] };
    let nextState = { ...gameState };

    // Logic split:
    // A. Generate AI Offers
    // B. Process Decisions for Players who have offers

    const freeAgents = nextState.players.filter(p => !p.teamId);

    // A. AI OFFERS
    // Iterate all AI teams
    const aiTeams = nextState.teams.filter(t => t.id !== nextState.userTeamId);

    // Global tracker of new offers to add
    const newOffers: FreeAgencyOffer[] = [];

    aiTeams.forEach(team => {
        const roster = nextState.players.filter(p => p.teamId === team.id);

        // 1. INTELLIGENCE GATHERING
        const direction = getTeamDirection(team, roster);
        const needs = analyzeRosterEcosystem(roster);
        const capOutlook = getCapOutlook(team, roster, nextState.contracts, nextState.salaryCap, nextState.date.getFullYear());

        // 2. Budget Logic
        // Real GMs save money for next year's big class if they are not contending
        // Simplified: If projected space is tight and we are Rebuilding, be conservative
        let effectiveBudget = team.salaryCapSpace;

        if (direction === 'Rebuilding' && capOutlook.projectedSpaceNextYear < 20000000) {
            effectiveBudget *= 0.5; // Save space
        }

        // 3. Scan Free Agents
        // Optimization: Only look at top available or filtered set
        const eligibleTargets = freeAgents
            .filter(p => {
                // Heuristic to save performace: 
                if (effectiveBudget < 1000000) return false;
                // If Contender, ignore players < 70 OVR unless desperate
                if (direction === 'Contender' && calculateOverall(p) < 70) return false;
                return true;
            })
            .sort((a, b) => calculateOverall(b) - calculateOverall(a))
            .slice(0, 50); // Look at top 50 available

        // Limit offers per day (e.g. max 5 active pending offers)
        let activeOffersCount = (nextState.activeOffers || []).filter(o => o.teamId === team.id && o.status === 'pending').length;

        for (const player of eligibleTargets) {
            if (activeOffersCount >= 3) break; // Reduced from 5 to focus quality

            // Check if we already offered
            const existingOffer = (nextState.activeOffers || []).find(o => o.playerId === player.id && o.teamId === team.id);
            if (existingOffer) continue; // Already waiting

            // Check cap
            if (effectiveBudget < 1000000) continue;

            const contractReq = calculateContractAmount(player, nextState.salaryCap);

            // 4. EVALUATE PLAYER
            const evalScore = evaluateFreeAgent(
                player,
                team,
                roster,
                direction,
                needs,
                team.salaryCapSpace,
                contractReq
            );

            // 5. DECISION THRESHOLD
            // Only sign if score is high enough
            let threshold = 55; // Base
            if (direction === 'Contender') threshold = 60; // Picky
            if (activeOffersCount === 0) threshold -= 5; // Need to sign someone

            if (evalScore.totalScore > threshold) {
                // NEGOTIATION LOGIC
                // If score is amazing (>75), offer more
                // If score is barely passing, offer less
                let offerFactor = 1.0;
                if (evalScore.totalScore > 75) offerFactor = 1.0 + ((evalScore.totalScore - 75) / 100); // e.g. 85 score -> 1.1x
                if (evalScore.totalScore < 60) offerFactor = 0.9;

                let offerAmount = Math.floor(contractReq.amount * offerFactor);

                // Strict Cap Limit
                if (offerAmount > team.salaryCapSpace) {
                    offerAmount = team.salaryCapSpace;
                }

                // Sanity check: Don't offer $500k to a Max guy
                if (offerAmount < contractReq.amount * 0.6) continue;

                // BIDDING WAR SIMULATION
                // If player has other offers, we might need to beat them?
                // (Simplified: We just place our best offer based on our value of him)

                const offer: FreeAgencyOffer = {
                    id: generateId(),
                    playerId: player.id,
                    teamId: team.id,
                    amount: offerAmount,
                    years: contractReq.years,
                    dayOffered: day,
                    isUserOffer: false,
                    status: 'pending'
                };
                newOffers.push(offer);
                result.offersMade.push(offer);
                activeOffersCount++;
                effectiveBudget -= offerAmount; // Reserve budget
            }
        }
    });

    // Append new offers to state
    let allOffers = [...(nextState.activeOffers || []), ...newOffers];

    // B. PLAYER DECISIONS
    // A player decides if:
    // 1. He has offers pending for > 1 day OR
    // 2. It's Day 7 (Deadline)

    // Group offers by player
    const offersByPlayer: Record<string, FreeAgencyOffer[]> = {};
    allOffers.filter(o => o.status === 'pending').forEach(o => {
        if (!offersByPlayer[o.playerId]) offersByPlayer[o.playerId] = [];
        offersByPlayer[o.playerId].push(o);
    });

    const signings: { playerId: string; teamId: string; amount: number; years: number }[] = [];
    const updatedContracts = [...nextState.contracts];

    Object.keys(offersByPlayer).forEach(playerId => {
        const playerOffers = offersByPlayer[playerId];
        const player = nextState.players.find(p => p.id === playerId);
        if (!player) return;

        // Decision Logic
        // Chance to decide today = 20% base + 10% per offer + 100% if Day 3+ with specific conditions
        // User Requirement: "One random day from these 7 the player will choose"

        const shouldDecide = Math.random() < 0.3 || day === 7;

        if (shouldDecide && playerOffers.length > 0) {
            // Pick best offer
            // Logic: Money vs Winning

            let bestScore = -1;
            let chosenOffer: FreeAgencyOffer | null = null;
            // Calculate Asking Price / Market Value
            const marketValue = calculateContractAmount(player, nextState.salaryCap).amount;

            for (const offer of playerOffers) {
                const team = nextState.teams.find(t => t.id === offer.teamId);
                const strat = team ? getTeamDirection(team, []) : 'Rebuilding'; // approx

                // Score Offer
                let offerScore = offer.amount; // Base: Money

                // Adjustment: Contender Bonus
                if (strat === 'Contender') {
                    // If player is old/wants ring -> value money less, winning more
                    if (player.age > 29) offerScore *= 1.2;
                }

                if (offerScore > bestScore) {
                    bestScore = offerScore;
                    chosenOffer = offer;
                }
            }

            // LOGIC FIX: Prevent "Cheap Signings"
            // If the best offer is significantly below market value, REJECT IT (unless it's the deadline)
            if (chosenOffer && bestScore < (marketValue * 0.8) && day < 7) {
                // Player decides to wait for a better offer
                chosenOffer = null;
            }

            if (chosenOffer) {
                // SIGNING!
                // Capture values before callback changes
                const signingPlayerId = player.id;
                const signingTeamId = chosenOffer.teamId;
                const signingAmount = chosenOffer.amount;
                const signingYears = chosenOffer.years;
                const signingOfferId = chosenOffer.id;

                signings.push({
                    playerId: signingPlayerId,
                    teamId: signingTeamId,
                    amount: signingAmount,
                    years: signingYears
                });

                // Reject others
                playerOffers.forEach(o => {
                    o.status = (o.id === signingOfferId) ? 'accepted' : 'rejected';
                });

                // News
                const t = nextState.teams.find(x => x.id === signingTeamId);
                result.news.push(`${player.firstName} ${player.lastName} has agreed to sign with the ${t?.name}!`);
            }
        }
    });

    // Apply Signings to State (Roster updates)
    let finalPlayers = nextState.players.map(p => ({ ...p }));
    let finalTeams = nextState.teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));

    signings.forEach(sign => {
        // Update Player
        const pIdx = finalPlayers.findIndex(p => p.id === sign.playerId);
        if (pIdx > -1) {


            // We need to capture previous ID before overwrite.
            const oldTeamId = finalPlayers[pIdx].teamId;
            finalPlayers[pIdx].teamId = sign.teamId;
            finalPlayers[pIdx].acquisition = {
                type: 'free_agent',
                year: nextState.date.getFullYear(),
                previousTeamId: oldTeamId || undefined
            };
            // Contract is stored in separate state, not on player object
        }

        // Update Team
        const tIdx = finalTeams.findIndex(t => t.id === sign.teamId);
        if (tIdx > -1) {
            finalTeams[tIdx].rosterIds.push(sign.playerId);
            finalTeams[tIdx].salaryCapSpace -= sign.amount;
            finalTeams[tIdx].cash -= sign.amount;

            // Add Contract
            updatedContracts.push({
                id: generateId(),
                playerId: sign.playerId,
                teamId: sign.teamId,
                amount: sign.amount,

                yearsLeft: sign.years,
                startYear: nextState.date.getFullYear(),
                role: 'Rotation' // Default role for now, or calculate based on depth chart
            });
        }
    });

    return {
        newState: {
            ...nextState,
            players: finalPlayers,
            teams: finalTeams,
            contracts: updatedContracts,
            activeOffers: allOffers,
            freeAgencyDay: day
        },
        result
    };
};
