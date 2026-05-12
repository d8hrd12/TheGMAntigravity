import type { Player } from '../../../models/Player';
import type { Team } from '../../../models/Team';
import type { Contract } from '../../../models/Contract';
import { calculateOverall } from '../../../utils/playerUtils';
import { type RosterNeeds, type TeamDirection } from '../../simulation/logic/TeamStrategyModule';

// ----------------------------------------------------------------------------
// PLAYER EVALUATION MODULE
// Implements 6-Dimension Scoring Model
// ----------------------------------------------------------------------------

export interface EvaluationScore {
    totalScore: number;
    breakdown: {
        fit: number;
        timeline: number;
        contract: number;
        liquidity: number;
        opportunity: number;
        risk: number;
    };
}

export const evaluateFreeAgent = (
    player: Player,
    team: Team,
    roster: Player[],
    teamDirection: TeamDirection,
    needs: RosterNeeds,
    salaryCapSpace: number,
    projectedContract: { amount: number, years: number }
): EvaluationScore => {

    // Base Stats
    const ovr = calculateOverall(player);
    const age = player.age;
    const potential = player.potential;

    // 1. ON-COURT FIT (0-40)
    let fitScore = 0;

    // Need alignment
    if (needs.positionalGaps.includes(player.position)) {
        fitScore += 20; // Huge bonus for filling a gap
    } else if (needs.primaryNeed.includes(player.position)) {
        fitScore += 15;
    }

    // Role Logic
    const playersAtPos = roster.filter(p => p.position === player.position);
    const bestAtPos = playersAtPos.length > 0 ? Math.max(...playersAtPos.map(p => calculateOverall(p))) : 0;

    if (ovr > bestAtPos) {
        // Upgrade
        fitScore += 10;
    } else if (playersAtPos.length < 2) {
        // Depth
        fitScore += 5;
    } else {
        // Surplus
        fitScore -= 5;
    }

    // GM2: Contenders strictly prioritize need, UNLESS an elite veteran is available for cheap
    if (teamDirection === 'Contender') {
        const isCheapVetStar = ovr >= 80 && projectedContract.amount <= 6000000;
        
        if (isCheapVetStar) {
            fitScore += 25; // Ignore fit, just get the talent
        } else if (!needs.positionalGaps.includes(player.position) && !needs.primaryNeed.includes(player.position)) {
            fitScore -= 15; // Penalize players that don't fill a need for a contender
        }
    } else {
        // Scheme Fit (Placeholder for now, assuming standard)
        if (ovr > 80) fitScore += 10; // Talent fits everywhere for non-contenders
    }

    // Clamp
    fitScore = Math.max(0, Math.min(40, fitScore));


    // 2. TIMELINE FIT (0-20)
    let timelineScore = 10; // Start neutral

    if (teamDirection === 'Rebuilding' || teamDirection === 'RisingCore') {
        if (age <= 24) timelineScore += 10;
        else if (age <= 26) timelineScore += 5;
        else if (age > 29) timelineScore -= 10;
    } else if (teamDirection === 'Contender') {
        if (ovr >= 80) timelineScore += 10; // Win now
        if (age < 22 && ovr < 75) timelineScore -= 5; // Can't wait
    }

    timelineScore = Math.max(0, Math.min(20, timelineScore));


    // 3. CONTRACT EFFICIENCY (0-20)
    let contractScore = 10;
    
    const isEuro = team.conference === 'EuroLeague' || team.conference === 'EuroCup';
    const estimatedCap = isEuro ? 25000000 : 140000000;
    const capHitPct = projectedContract.amount / estimatedCap;

    // Value Check
    let marketValue = 0;
    if (isEuro) {
        if (ovr >= 95) marketValue = 3500000;
        else if (ovr >= 90) marketValue = 2500000;
        else if (ovr >= 85) marketValue = 1500000;
        else if (ovr >= 80) marketValue = 800000;
        else if (ovr >= 75) marketValue = 400000;
        else marketValue = 250000;
    } else {
        if (ovr >= 90) marketValue = 45000000;
        else if (ovr >= 85) marketValue = 30000000;
        else if (ovr >= 80) marketValue = 18000000;
        else if (ovr >= 75) marketValue = 8000000;
        else marketValue = 2000000;
    }

    if (projectedContract.amount < marketValue * 0.8) contractScore += 10; // Steal
    else if (projectedContract.amount > marketValue * 1.2) contractScore -= 10; // Overpay

    // Cap Flexibility
    const flexibilityThreshold = isEuro ? 1000000 : 5000000;
    if (salaryCapSpace - projectedContract.amount < flexibilityThreshold) contractScore -= 5; // Tight fit

    contractScore = Math.max(0, Math.min(20, contractScore));


    // 4. TRADE LIQUIDITY (0-10)
    let liquidityScore = 5;

    if (projectedContract.years <= 2) liquidityScore += 3; // Easy to move
    if (age > 32 && projectedContract.years > 3) liquidityScore -= 5; // Untradable albatross
    if (ovr >= 85) liquidityScore += 5; // Always liquid

    liquidityScore = Math.max(0, Math.min(10, liquidityScore));


    // 5. OPPORTUNITY COST (0-10)
    let opportunityScore = 5;

    // Does it block a young prospect?
    const youngProspectAtPos = playersAtPos.find(p => p.age < 24 && p.potential > 80);
    if (youngProspectAtPos && ovr > calculateOverall(youngProspectAtPos) && ovr < calculateOverall(youngProspectAtPos) + 5) {
        // Signing a guy barely better than our prospect
        opportunityScore -= 5;
    }

    // Saving cap for next year? (If contender, future relies on present, so less penalty)
    if (teamDirection !== 'Contender' && projectedContract.years > 1) {
        // opportunityScore -= 2; // Slight penalty for long term deals if not contending
    }

    opportunityScore = Math.max(0, Math.min(10, opportunityScore));


    // 6. RISK PROFILE (0-10)
    let riskScore = 10; // Start perfect

    if (age > 33) riskScore -= 5; // Regression risk
    // Injury history would go here
    if (ovr < 75 && projectedContract.amount > 10000000) riskScore -= 5; // Bust risk

    riskScore = Math.max(0, Math.min(10, riskScore));


    // TOTAL
    const total = fitScore + timelineScore + contractScore + liquidityScore + opportunityScore + riskScore;

    return {
        totalScore: total,
        breakdown: {
            fit: fitScore,
            timeline: timelineScore,
            contract: contractScore,
            liquidity: liquidityScore,
            opportunity: opportunityScore,
            risk: riskScore
        }
    };
};
