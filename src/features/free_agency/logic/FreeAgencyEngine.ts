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

        // 2. Budget Logic & GM3/GM4 Setup
        // Real GMs save money for next year's big class if they are not contending
        let effectiveBudget = team.salaryCapSpace;

        // GM3: Playoff Team adapting based on Core Age
        let playOffStrategy: 'Save' | 'Push' | 'Depth' = 'Depth';
        if (direction === 'PlayoffTeam') {
            const top3 = roster.sort((a, b) => calculateOverall(b) - calculateOverall(a)).slice(0, 3);
            const avgCoreAge = top3.reduce((sum, p) => sum + p.age, 0) / 3;
            if (avgCoreAge < 25) {
                playOffStrategy = 'Save';
                if (capOutlook.projectedSpaceNextYear < 20000000) effectiveBudget *= 0.3; // Save money for young core
            } else if (avgCoreAge > 29) {
                playOffStrategy = 'Push'; // Willing to overpay for a star
            } else if (roster.length < 10) {
                playOffStrategy = 'Depth'; // Sign multiple role players
            }
        }

        if (direction === 'Rebuilding' && capOutlook.projectedSpaceNextYear < 20000000) {
            effectiveBudget *= 0.5; // Save space
        }

        // 3. Scan Free Agents
        // Optimization: Only look at top available or filtered set
        const eligibleTargets = freeAgents
            .filter(p => {
                const isOwnPlayer = p.teamId === team.id || p.acquisition?.previousTeamId === team.id;
                if (effectiveBudget < 1000000 && !isOwnPlayer) return false;
                
                const ovr = calculateOverall(p);

                // GM1: Rebuilders restrict signing older stars. Only sign young players or cheap depth
                if (direction === 'Rebuilding' && !isOwnPlayer) {
                    if (ovr > 78 && p.age > 24) return false; // Ignore older good players, save cap/assets
                }

                if (direction === 'Contender' && ovr < 70) return false;

                // GM3: Playoff Team logic
                if (direction === 'PlayoffTeam') {
                    if (playOffStrategy === 'Depth' && ovr > 78 && effectiveBudget < 25000000) return false; // Don't blow all money on 1 guy
                }

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

            const isOwnPlayer = player.teamId === team.id || player.acquisition?.previousTeamId === team.id;

            // Check cap: Skip if over cap and not own player (unless it's minimum)
            const VET_MINIMUM = 1100000;
            if (effectiveBudget < offerAmount && !isOwnPlayer && offerAmount > VET_MINIMUM) continue;

            // --- FINANCIAL FIX: Debt Signing Ban ---
            if (team.cash < 0 && !isOwnPlayer) {
                offerAmount = VET_MINIMUM;
            }

            // Strict Cap Limit for external players
            if (offerAmount > effectiveBudget && !isOwnPlayer) {
                offerAmount = Math.max(VET_MINIMUM, effectiveBudget);
            }

            // GM4: Financial GM Logic
            // Financial GMs avoid giving long-term deals to older players unless they are elite stars
            let offerYears = contractReq.years;
            const gm = nextState.aiGms?.find(g => g.teamId === team.id);
            if (gm?.philosophy === 'Financial' && player.age > 28 && calculateOverall(player) < 88) {
                offerYears = Math.min(offerYears, 2); // Max 2 years for older non-stars
            }

            // GM3: Playoff Team Overpay Logic
            if (direction === 'PlayoffTeam' && playOffStrategy === 'Push' && calculateOverall(player) >= 83) {
                offerAmount = Math.floor(offerAmount * 1.15); // Overpay to win now
            }

                // Sanity check: Don't offer $500k to a Max guy (unless it's the only option due to debt/cap)
                // If in debt, we allow the min offer even if it's way below market, because that's their only tool.
                if (team.cash >= 0 && offerAmount < contractReq.amount * 0.6) continue;

                // BIDDING WAR SIMULATION
                // If player has other offers, we might need to beat them?
                // (Simplified: We just place our best offer based on our value of him)

                const offer: FreeAgencyOffer = {
                    id: generateId(),
                    playerId: player.id,
                    teamId: team.id,
                    amount: offerAmount,
                    years: offerYears,
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
            const ovr = calculateOverall(player);
            const isOriginalTeam = (teamId: string) => player.acquisition?.previousTeamId === teamId;

            for (const offer of playerOffers) {
                const team = nextState.teams.find(t => t.id === offer.teamId);
                if (!team) continue;
                
                const roster = nextState.players.filter(p => p.teamId === team.id);
                const strat = getTeamDirection(team, roster);
                
                // Base: Money
                let offerScore = offer.amount; 

                // --- P1: Prime Superstars (OVR 90+) ---
                if (ovr >= 90) {
                    if (isOriginalTeam(offer.teamId)) offerScore *= 1.3; // Loyalty
                    if (strat === 'Contender') offerScore *= 1.2; // Immediate Contender
                }

                // --- P2: Aging Veterans (Age 35+ OR Age 33+ with OVR < 80) ---
                // Ring Chasing: Take vet minimum to join Contender
                if (player.age >= 35 || (player.age >= 33 && ovr < 80)) {
                    if (strat === 'Contender') {
                        offerScore = offer.amount * 5.0; // Overwhelming preference for contenders
                    } else {
                        offerScore *= 0.5; // Massive penalty for bad teams
                    }
                }

                // --- P3: Young Prospects (Age <= 24, POT >= 85) ---
                if (player.age <= 24 && player.potential >= 85) {
                    if (strat === 'Rebuilding') {
                        // Assume Rebuilders can guarantee minutes
                        offerScore *= 1.25; 
                    } else if (offer.years === 1) {
                        // "Prove It" 1-year deal on a good team
                        offerScore *= 1.2;
                    }
                }

                // --- P4: Injury/Rebound Players (OVR dropped, or prove_it type) ---
                // We'll approximate "down year" by checking if market value is lower than expected for their POT/former OVR
                // Or simply checking age and contract years offered
                if (player.contractType === 'prove_it' || offer.amount < marketValue * 0.8) {
                    if (player.age < 30) {
                        // Wants a 1-year deal on a Contender
                        if (offer.years === 1 && strat === 'Contender') offerScore *= 1.5;
                        else if (offer.years > 1) offerScore *= 0.7; // Hates multi-year cheap deals
                    } else {
                        // Older: values security over everything
                        if (offer.years >= 3) offerScore *= 1.5;
                        if (strat === 'Rebuilding' && offer.years >= 3) offerScore *= 1.3;
                    }
                }

                if (offerScore > bestScore) {
                    bestScore = offerScore;
                    chosenOffer = offer;
                }
            }

            // LOGIC FIX: Prevent "Cheap Signings"
            // If the best offer is significantly below market value, REJECT IT (unless it's the deadline)
            if (chosenOffer && bestScore < (marketValue * 0.8) && day < 7 && ovr < 90 && player.age < 33) {
                // Players will wait for better offers unless they are ring chasing veterans
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

    // --- COACH NEGOTIATIONS ---
    const coachSignings: { coachId: string; teamId: string; amount: number; years: number }[] = [];
    const updatedCoachOffers = [...(nextState.activeCoachOffers || [])];

    // AI Coaches bidding
    // (Simplified AI bidding for coaches for now - mostly focuses on User competition)
    // Actually, let's just process User and AI results.

    // Group coach offers
    const coachOffersByCoach: Record<string, FreeAgencyOffer[]> = {};
    updatedCoachOffers.filter(o => o.status === 'pending').forEach(o => {
        if (!coachOffersByCoach[o.playerId]) coachOffersByCoach[o.playerId] = [];
        coachOffersByCoach[o.playerId].push(o);
    });

    Object.keys(coachOffersByCoach).forEach(coachId => {
        const offers = coachOffersByCoach[coachId];
        const coach = nextState.coaches.find(c => c.id === coachId);
        if (!coach) return;

        // Coaches decide on Day 1-3 with 40% chance, or Day 7
        const shouldDecide = Math.random() < 0.4 || day === 7;
        
        if (shouldDecide && offers.length > 0) {
            // Pick best offer
            let bestScore = -1;
            let chosenOffer: FreeAgencyOffer | null = null;
            
            for (const offer of offers) {
                const team = nextState.teams.find(t => t.id === offer.teamId);
                const score = offer.amount * (team && team.wins > team.losses ? 1.2 : 1.0);
                if (score > bestScore) {
                    bestScore = score;
                    chosenOffer = offer;
                }
            }

            if (chosenOffer) {
                coachSignings.push({
                    coachId: coachId,
                    teamId: chosenOffer.teamId,
                    amount: chosenOffer.amount,
                    years: chosenOffer.years
                });

                // Update offer statuses
                offers.forEach(o => {
                    o.status = (o.id === chosenOffer?.id) ? 'accepted' : 'rejected';
                });
                
                const t = nextState.teams.find(x => x.id === chosenOffer.teamId);
                result.news.push(`Coach ${coach.firstName} ${coach.lastName} has signed with the ${t?.name}!`);
            }
        }
    });

    // Apply Coach Signings
    let finalCoaches = [...nextState.coaches];
    coachSignings.forEach(sign => {
        const cIdx = finalCoaches.findIndex(c => c.id === sign.coachId);
        if (cIdx > -1) {
            finalCoaches[cIdx] = { 
                ...finalCoaches[cIdx], 
                teamId: sign.teamId,
                contract: { salary: sign.amount, yearsRemaining: sign.years }
            };
        }
        const tIdx = finalTeams.findIndex(t => t.id === sign.teamId);
        if (tIdx > -1) {
            finalTeams[tIdx].coachId = sign.coachId;
        }
    });

    return {
        newState: {
            ...nextState,
            players: finalPlayers,
            teams: finalTeams,
            coaches: finalCoaches,
            contracts: updatedContracts,
            activeOffers: allOffers,
            activeCoachOffers: updatedCoachOffers,
            freeAgencyDay: day
        },
        result
    };
};
