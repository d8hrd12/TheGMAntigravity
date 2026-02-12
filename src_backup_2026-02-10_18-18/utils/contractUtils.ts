import type { Player } from '../models/Player';
import type { Contract } from '../models/Contract';
import type { Team } from '../models/Team';
import { calculateOverall } from './playerUtils';
import { generateUUID } from './uuid';

export const calculateContractAmount = (player: Player, salaryCap: number = 140000000): { amount: number; years: number; type?: 'standard' | 'prove_it' | 'breakout'; explanation: string } => {
    const overall = calculateOverall(player);
    let amount = 0;
    let years = 1;
    let explanation = "";

    // Granular Tiers based on Salary Cap Percentage
    if (overall >= 95) {
        amount = salaryCap * 0.40; // Supermax
        years = 5;
        explanation = "Supermax MVP Caliber";
    } else if (overall >= 90) {
        amount = salaryCap * 0.30; // Max
        years = 4;
        explanation = "Franchise Cornerstone";
    } else if (overall >= 85) {
        amount = salaryCap * 0.22; // Star
        years = 4;
        explanation = "All-Star Level";
    } else if (overall >= 80) {
        amount = salaryCap * 0.15; // High Starter (~21M)
        years = 3;
        explanation = "Quality Starter";
    } else if (overall >= 76) {
        amount = salaryCap * 0.08; // Rotation (~11M)
        years = 3;
        explanation = "Key Rotation Piece";
    } else if (overall >= 72) {
        amount = salaryCap * 0.04; // Bench (~5.6M)
        years = 2;
        explanation = "Bench Contributor";
    } else {
        amount = salaryCap * 0.01; // Minimum (~1.4M)
        years = 1;
        explanation = "Minimum Salary";
    }

    // Performance Adjustments (Context matters)
    const stats = player.seasonStats;
    let type: 'standard' | 'prove_it' | 'breakout' = 'standard';

    // Age / Decline Logic
    if (player.age >= 32) {
        if (overall < 80) {
            amount *= 0.7; // 30% Discount
            explanation += " (Aging Role Player)";
            years = Math.min(years, 2);
        } else {
            amount *= 0.9; // 10% Discount for aging stars
            explanation += " (Aging Star)";
            years = Math.min(years, 3);
        }
    }

    // Performance "Prove It" vs "Cash In"
    if (stats && stats.gamesPlayed > 20) {
        const ppg = stats.points / stats.gamesPlayed;
        const efficiency = ((stats.points + stats.rebounds + stats.assists + stats.steals + stats.blocks) - (stats.fgAttempted - stats.fgMade) - (stats.turnovers)) / stats.gamesPlayed;

        // "Prove It" (Good ratings but bad play)
        // e.g., 80 OVR but 8 PPG
        if (overall >= 78 && ppg < 10) {
            amount *= 0.6; // 40% reduction
            years = 1;
            type = 'prove_it';
            explanation += " (Bad Season - Prove It Deal)";
        }

        // "Cash In" (Outperforming ratings)
        // e.g., 74 OVR but 15 PPG
        // Only trigger if they are NOT already being paid Star Money
        else if (amount < (salaryCap * 0.15) && ppg > 16) {
            amount = Math.max(amount * 1.5, salaryCap * 0.12);
            if (years < 3) years = 3;
            type = 'breakout';
            explanation += " (Breakout Season - Cashing In)";
        }
    }

    // Stable Random Variance based on Player ID
    // We want some variability across players, but stability for the same player
    const seed = player.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stableRand = (Math.abs(Math.sin(seed)) * 10000) % 1;
    const variance = 0.95 + stableRand * 0.1;
    amount *= variance;

    // Safety Clamps
    const minSalary = salaryCap * 0.008; // ~1.1M
    const maxSalary = salaryCap * 0.35; // Cap individual max at 35% generally

    // Hard check: If OVR < 75, NEVER exceed 12M (approx 8.5% cap) unless young (<22)
    if (overall < 75 && player.age > 24) {
        amount = Math.min(amount, salaryCap * 0.085);
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
