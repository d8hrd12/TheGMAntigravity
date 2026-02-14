import type { Player } from '../models/Player';
import type { Contract } from '../models/Contract';
import type { Team } from '../models/Team';
import { calculateOverall } from './playerUtils';
import { generateUUID } from './uuid';


export const calculatePlayerValuation = (player: Player): number => {
    // If no stats, return OVR (Rookies/No Play)
    if (!player.seasonStats || player.seasonStats.gamesPlayed < 10) return calculateOverall(player);

    const s = player.seasonStats;
    const gp = s.gamesPlayed;

    // Game Score Formula (Adjusted)
    // GmSc = PTS + 0.4*FG - 0.7*FGA - 0.4*(FTA - FGM) + 0.5*ORB + 0.3*DRB + STL + 0.7*AST + 0.7*BLK - 0.4*PF - TOV.
    // Reduced Rebound weights (0.7 -> 0.5 ORB, 0.3 DRB stays) to prevent high-rebound/low-score inflation
    const gmSc = (s.points + 0.4 * s.fgMade - 0.7 * s.fgAttempted - 0.4 * (s.ftAttempted - s.ftMade) + 0.5 * s.offensiveRebounds + 0.3 * s.defensiveRebounds + s.steals + 0.6 * s.assists + 0.6 * s.blocks - 0.4 * s.fouls - s.turnovers) / gp;

    // Convert GmSc to "Performance OVR"
    // Adjusted curve: 30 GmSc -> 98, 10 GmSc -> ~70
    let perfOvr = 58 + (gmSc * 1.3);

    // Penalize pure specialists who score very little (< 5 PPG) unless they are elite defenders
    if (s.points / gp < 5 && perfOvr > 75) {
        perfOvr -= 5;
    }

    // Clamp
    return Math.max(40, Math.min(99, perfOvr));
};

export const calculateContractAmount = (player: Player, salaryCap: number = 140000000): { amount: number; years: number; type?: 'standard' | 'prove_it' | 'breakout'; explanation: string } => {
    const overall = calculateOverall(player);
    const performanceVal = calculatePlayerValuation(player);

    // Calculate Base Values for both OVR and Performance
    const getBaseValue = (ovr: number) => {
        if (ovr >= 95) return salaryCap * 0.40; // Supermax
        if (ovr >= 90) return salaryCap * 0.30; // Max
        if (ovr >= 85) return salaryCap * 0.22; // Star
        if (ovr >= 80) return salaryCap * 0.15; // Starter
        if (ovr >= 76) return salaryCap * 0.08; // Rotation
        if (ovr >= 72) return salaryCap * 0.04; // Bench
        return salaryCap * 0.01; // Min
    };

    const ovrValue = getBaseValue(overall);
    const perfValue = getBaseValue(performanceVal);

    let amount = ovrValue;
    let years = 1;
    let explanation = "";
    let type: 'standard' | 'prove_it' | 'breakout' = 'standard';


    const diff = performanceVal - overall;

    // LOGIC BRANCHING
    if (diff < -4 && player.age < 32) {
        // UNDERPERFORMER (PROVE IT DEAL)
        // e.g., 85 OVR playing like a 75 (-10 diff)
        // Takes average of OVR and Low Perf to reset market
        amount = (ovrValue * 0.4 + perfValue * 0.6);
        years = 1;
        type = 'prove_it';
        explanation = `Underperformed (${performanceVal.toFixed(0)} rating). Taking 1-year deal to rebuild value.`;
    } else if (diff > 3) {
        // OVERPERFORMER (BREAKOUT)
        // e.g. 75 OVR playing like 80 (+5 diff)
        // Paid closer to performance
        amount = (ovrValue * 0.3 + perfValue * 0.7);
        // Better players want years, but might bet on themselves if young?
        // Usually breakout players want to lock in money unless they think they can go higher.
        // Let's say they want 3-4 years.
        years = 3;
        type = 'breakout';
        explanation = `Breakout Season (${performanceVal.toFixed(0)} rating). Cashing in.`;
    } else {
        // STANDARD
        amount = (ovrValue * 0.8 + perfValue * 0.2); // Mostly OVR based but slight perf nudge
        years = overall > 80 ? 4 : (overall > 74 ? 3 : 2);
        explanation = "Standard Market Value.";
    }

    // Age / Decline Logic
    if (player.age >= 32) {
        const agePenalty = (player.age - 31) * 0.1; // 10% per year over 31
        // But if they are performing well (LeBron rule), reduce penalty
        const successMod = performanceVal > 85 ? 0.5 : 1.0;

        amount *= (1 - (agePenalty * successMod));
        years = Math.min(years, (player.age > 35 ? 1 : 2));
        explanation += ` (Age ${player.age} Adjustment)`;
    }

    // Low Games Played Penalty (The "Naz Reid" Clause)
    // Applied LAST to ensure it doesn't get overwritten by Prove It / Standard logic
    if (player.seasonStats && player.seasonStats.gamesPlayed < 15) {
        if (overall < 80 && player.age > 24) {
            amount *= 0.4;
            years = 1;
            // Overwrite explanation or append? Append is safer.
            explanation += " (Low Usage Penalty)";
            // If they entered Prove It logic, they already have a low amount, but this crushes it further.
            // If they entered Standard (because games < 10 reset perfVal), this fixes the "Paid for OVR" bug.
        }
    }

    // Determine Years for max guys
    if (amount > salaryCap * 0.25 && player.age < 30) years = 5;

    // Safety Clamps
    const minSalary = salaryCap * 0.008;
    const maxSalary = salaryCap * 0.35;

    // Hard Cap for Low OVR/Perf
    if (overall < 72 && performanceVal < 75) {
        amount = Math.min(amount, salaryCap * 0.05); // Max ~7M for fringe players
    }

    amount = Math.max(minSalary, Math.min(amount, maxSalary));

    return { amount: Math.floor(amount), years, type, explanation };
};

export const calculateExpectedRoleValue = (ovr: number): number => {
    if (ovr >= 85) return 4; // Star
    if (ovr >= 78) return 3; // Starter
    if (ovr >= 74) return 2; // Rotation
    if (ovr >= 70) return 1; // Bench
    return 0; // Prospect
};

export const calculateAdjustedDemand = (
    player: Player,
    marketAmount: number,
    marketYears: number,
    offeredRole: string,
    offeredYears: number,
    isIncumbent: boolean = false
) => {
    // Loyalty Modifier
    let loyaltyMod = 1.0;
    if ((player.loveForTheGame || 0) > 15 && isIncumbent) loyaltyMod -= 0.1; // 10% discount for loyalty
    if (player.morale > 90 && isIncumbent) loyaltyMod -= 0.05; // 5% discount for happiness

    // Home Discount: 10% for being the incumbent team
    const homeDiscountMod = isIncumbent ? 0.90 : 1.0;

    // Role Modifier
    const ovr = calculateOverall(player);
    const expectedRoleVal = calculateExpectedRoleValue(ovr);

    let offeredRoleVal = 0;
    if (offeredRole === 'Star') offeredRoleVal = 4;
    else if (offeredRole === 'Starter') offeredRoleVal = 3;
    else if (offeredRole === 'Rotation') offeredRoleVal = 2;
    else if (offeredRole === 'Bench') offeredRoleVal = 1;

    let roleMod = 1.0;
    if (offeredRoleVal > expectedRoleVal) roleMod = 0.95; // 5% discount for promotion
    if (offeredRoleVal < expectedRoleVal) roleMod = 1.15; // 15% tax for demotion

    // Years Modifier (Flexibility)
    let yearsMod = 1.0;
    const yearDiff = Math.abs(offeredYears - marketYears);
    if (yearDiff > 0) {
        // Charging a 2% "friction" tax per year of difference from their preferred length
        yearsMod += (yearDiff * 0.02);
    }

    return marketAmount * loyaltyMod * homeDiscountMod * roleMod * yearsMod;
};

export const generateContract = (player: Player, startYear: number, salaryCap: number = 140000000): Contract => {
    const { amount, years } = calculateContractAmount(player, salaryCap);

    return {
        id: generateUUID(),
        playerId: player.id,
        teamId: player.teamId || '',
        amount: amount,
        yearsLeft: years,
        startYear: startYear,
        role: 'Rotation' // Default role
    };
};

export const calculateTeamCapSpace = (team: Team, contracts: Contract[], salaryCap: number): number => {
    const teamContracts = contracts.filter(c => c.teamId === team.id && c.yearsLeft > 0);
    const totalSalary = teamContracts.reduce((sum, c) => sum + c.amount, 0);
    return salaryCap - totalSalary;
};
