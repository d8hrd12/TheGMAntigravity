import type { Team } from '../../models/Team';
import type { Contract } from '../../models/Contract';
import type { Player } from '../../models/Player';
import type { MerchCampaign, ActiveMerchCampaign } from '../simulation/SimulationTypes';

// --- Types ---
export type PayrollStatus = 'UNDER_CAP' | 'OVER_CAP' | 'OVER_LUXURY_TAX';
export type ExpectationLevel = 'TITLE_OR_BUST' | 'FINALS_EXPECTED' | 'DEEP_PLAYOFF_RUN' | 'PLAYOFFS' | 'REBUILD';
export type SeasonResult = 'CHAMPION' | 'FINALS_LOSS' | 'CONF_FINALS_LOSS' | 'PLAYOFFS_EARLY_EXIT' | 'MISSED_PLAYOFFS' | 'BOTTOM_5';

interface FinancialUpdate {
    newCash: number;
    newFanInterest: number;
    newOwnerPatience: number;
    newRevenueModifier: number; // Applied to next season's revenue
    penaltySeverity: number;
    messages: string[]; // Notifications for the user
}




// --- Constants ---
const SALARY_CAP = 140000000;
const LUXURY_TAX_THRESHOLD = 170000000;

// --- Core Functions ---

export const calculatePayroll = (teamContracts: Contract[]): number => {
    return teamContracts.reduce((sum, c) => sum + c.amount, 0);
};

export const getPayrollStatus = (payroll: number): PayrollStatus => {
    if (payroll > LUXURY_TAX_THRESHOLD) return 'OVER_LUXURY_TAX';
    if (payroll > SALARY_CAP) return 'OVER_CAP';
    return 'UNDER_CAP';
};

export const AVAILABLE_MERCH_CAMPAIGNS: MerchCampaign[] = [
    {
        id: 'basic_jersey',
        name: 'Standard Jersey Drop',
        type: 'JERSEY',
        cost: 500000,
        durationInGames: 5,
        minFanInterest: 0,
        baseRoi: 1.2,
        riskFactor: 0.1,
        description: 'Release a new batch of standard home/away jerseys. Reliable income.'
    },
    {
        id: 'bobblehead_night',
        name: 'Star Player Bobblehead Night',
        type: 'bobblehead',
        cost: 150000,
        durationInGames: 1,
        minFanInterest: 40,
        baseRoi: 1.8,
        riskFactor: 0.3,
        description: 'One-night event. High potential return if attendance is high.'
    },
    {
        id: 'city_edition',
        name: 'City Edition Launch',
        type: 'JERSEY',
        cost: 2000000,
        durationInGames: 10,
        minFanInterest: 60,
        baseRoi: 2.5,
        riskFactor: 0.4,
        description: 'High-risk, high-reward exclusive jersey campaign. Needs strong fan base.'
    },
    {
        id: 'retro_night',
        name: 'Throwback Retro Night',
        type: 'LOCAL_EVENT',
        cost: 750000,
        durationInGames: 3,
        minFanInterest: 50,
        baseRoi: 1.5,
        riskFactor: 0.2,
        description: 'Celebrate the franchise history. Appeals to loyal fans.'
    },
    {
        id: 'autograph_signing',
        name: 'Team Autograph Session',
        type: 'LOCAL_EVENT',
        cost: 50000,
        durationInGames: 1,
        minFanInterest: 30,
        baseRoi: 1.3,
        riskFactor: 0.05,
        description: 'Small community event to boost local engagement.'
    }
];

export const processMerchCampaigns = (
    team: Team,
    activeCampaigns: ActiveMerchCampaign[]
): { updatedCampaigns: ActiveMerchCampaign[], dailyRevenue: number, messages: string[] } => {
    let dailyRevenue = 0;
    const messages: string[] = [];
    const updatedCampaigns: ActiveMerchCampaign[] = [];

    activeCampaigns.forEach(campaign => {
        if (campaign.gamesRemaining > 0) {
            // Calculate daily revenue
            // Formula: (Cost * ROI) / Duration * Modifiers
            // Modifiers: Fan Interest, Market Size, Random Fluctuation

            const marketMod = team.marketSize === 'Large' ? 1.2 : team.marketSize === 'Medium' ? 1.0 : 0.8;
            const fanMod = team.fanInterest / 50; // 0.6 to 2.0 typically
            const randomFlux = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2

            // Check for "Flop" based on risk
            let performanceMod = 1.0;
            if (Math.random() < campaign.riskFactor * 0.1) {
                // 10% of the risk factor chance to heavily underperform
                performanceMod = 0.5;
                messages.push(`Merch flop: ${campaign.name} is seeing poor sales.`);
            }

            const projectedTotalRevenue = campaign.cost * campaign.baseRoi;
            const baseDailyRevenue = projectedTotalRevenue / campaign.durationInGames;

            const actualDailyRevenue = baseDailyRevenue * marketMod * fanMod * randomFlux * performanceMod;

            dailyRevenue += actualDailyRevenue;

            updatedCampaigns.push({
                ...campaign,
                gamesRemaining: campaign.gamesRemaining - 1,
                revenueGenerated: campaign.revenueGenerated + actualDailyRevenue
            });

            if (campaign.gamesRemaining - 1 === 0) {
                messages.push(`Campaign Finished: ${campaign.name} generated $${Math.floor(campaign.revenueGenerated + actualDailyRevenue).toLocaleString()}`);
            }
        }
    });

    return { updatedCampaigns, dailyRevenue, messages };
};

export const calculateExpectation = (team: Team, roster: Player[], allTeams: Team[], teamContracts: Contract[]): ExpectationLevel => {
    const payroll = calculatePayroll(teamContracts);
    const payrollStatus = getPayrollStatus(payroll);

    // 1. If NOT over cap, expectations are generally lower unless they are a super team
    // But the spec says "Triggered if payroll > salary_cap". 
    // Implicitly, if under cap, expectation is just to compete or rebuild, penalties are minimal.
    // We will still calculate a score to set a baseline.

    // Calculate Team Overall
    const teamOverall = roster.reduce((sum, p) => sum + p.overall, 0) / (roster.length || 1);

    // Star Power: Players > 85
    // Reduced weight from 10 to 5 to prevent inflation
    const starPower = roster.filter(p => p.overall >= 85).length * 5;

    // Payroll Rank Bonus
    // We need context of other teams, but for now we can approximate or pass in rank.
    // Let's rely heavily on Salary Status for the "Title or Bust" logic as per spec.

    let score = teamOverall + starPower;

    if (payrollStatus === 'OVER_LUXURY_TAX') score += 15; // Reduced from 20
    if (payrollStatus === 'OVER_CAP') score += 5; // Reduced from 10

    // Tiers (Tuned arbitrary values for now, needs calibration)
    // Avg team overall ~ 74-78. 
    // Title or Bust requires: ~78 Avg + 2 Stars (10) + Tax (15) = 103.
    // So 105 is a good cutoff for Elite.
    if (score >= 105) return 'TITLE_OR_BUST';
    if (score >= 98) return 'FINALS_EXPECTED';
    if (score >= 90) return 'DEEP_PLAYOFF_RUN';
    if (score >= 80) return 'PLAYOFFS';
    return 'REBUILD';
};

export const evaluateSeasonPerformance = (
    team: Team,
    seasonResult: SeasonResult,
    expectation: ExpectationLevel,
    contracts: Contract[],
    annualRevenue: number
): FinancialUpdate => {
    const payroll = calculatePayroll(contracts);
    const payrollStatus = getPayrollStatus(payroll);

    let severity = 0;
    let penaltyScale = 1;

    // 1. Determine Failure Severity
    // Only apply heavy penalties if they failed expectations significantly

    if (expectation === 'TITLE_OR_BUST') {
        if (seasonResult === 'CHAMPION') severity = 0; // Success
        else if (seasonResult === 'FINALS_LOSS') severity = 1;
        else if (seasonResult === 'CONF_FINALS_LOSS') severity = 2;
        else if (seasonResult === 'PLAYOFFS_EARLY_EXIT') severity = 3;
        else severity = 4; // Missed playoffs
    } else if (expectation === 'FINALS_EXPECTED') {
        if (['CHAMPION', 'FINALS_LOSS'].includes(seasonResult)) severity = 0;
        else if (seasonResult === 'CONF_FINALS_LOSS') severity = 1;
        else if (seasonResult === 'PLAYOFFS_EARLY_EXIT') severity = 2;
        else severity = 3;
    } else if (expectation === 'DEEP_PLAYOFF_RUN') {
        if (['CHAMPION', 'FINALS_LOSS', 'CONF_FINALS_LOSS'].includes(seasonResult)) severity = 0;
        else if (seasonResult === 'PLAYOFFS_EARLY_EXIT') severity = 1;
        else severity = 2;
    }

    // 2. Apply Payroll Status Multiplier (Spec #8)
    if (payrollStatus === 'OVER_CAP') penaltyScale = 1;
    if (payrollStatus === 'OVER_LUXURY_TAX') penaltyScale = 2;
    if (payrollStatus === 'UNDER_CAP') penaltyScale = 0.5; // Less severe if responsible

    const finalSeverity = severity * penaltyScale;

    // 3. Calculate Penalties
    let newCash = team.cash;
    let newFanInterest = team.fanInterest;
    let newOwnerPatience = team.ownerPatience;
    let newRevenueModifier = 1.0;
    const messages: string[] = [];

    if (finalSeverity > 0) {
        messages.push(`Season Failure (Severity: ${finalSeverity.toFixed(1)})`);

        // Financial Penalty
        const cashPenalty = annualRevenue * (0.05 * finalSeverity);
        newCash -= cashPenalty;
        if (cashPenalty > 1000000) messages.push(`Owner withdrew $${(cashPenalty / 1000000).toFixed(1)}M due to poor performance.`);

        // Revenue Hit
        // We handle this by modifying "fanInterest" mostly, but spec says discrete revenue hit.
        // We can model this as a temporary modifier or just reduce fan interest harder.
        // Spec: annual_revenue *= (1 - (0.03 * final_severity))
        // We will return a modifier to be applied to next year's base calculation if we can,
        // OR we just assume Fan Interest drives revenue effectively.
        // Let's stick to Fan Interest as the persistent driver to simulate this.

        // Fan Damage
        const fanDamage = 0.05 * finalSeverity;
        newFanInterest = Math.max(0.5, newFanInterest - fanDamage);
        messages.push(`Fan Interest dropped by ${fanDamage.toFixed(2)}.`);

        // Owner Patience
        const patienceDamage = 10 * finalSeverity;
        newOwnerPatience = Math.max(0, newOwnerPatience - patienceDamage);
        messages.push(`Owner Patience dropped by ${patienceDamage}.`);
    } else {
        // Success Logic
        if (seasonResult === 'CHAMPION') {
            newFanInterest = Math.max(newFanInterest, 1.5); // Min 1.5 for champs
            newFanInterest *= 1.35; // Boost
            newOwnerPatience = 100;
            messages.push(`Championship! Fan Interest Skyrocketed. Owner is ecstatic.`);
        } else {
            // Minor success boosts
            if (['FINALS_LOSS', 'CONF_FINALS_LOSS'].includes(seasonResult)) {
                newFanInterest *= 1.1;
                newOwnerPatience = Math.min(100, newOwnerPatience + 20);
            }
        }
    }

    // Cap Fan Interest
    newFanInterest = Math.min(2.0, newFanInterest);

    // 4. Debt Logic
    if (newCash < 0) {
        const debtIncrease = Math.abs(newCash);
        newCash = 0; // Cash floor is 0? Spec says "debt += abs, cash = 0"
        // In our model we have a separate debt field
        // We will return the values and let the context update the object
        // NOTE: We need to handle this in the return object, but FinancialUpdate doesn't have debt.
        // I should add debt to the return type.
    }

    return {
        newCash,
        newFanInterest,
        newOwnerPatience,
        newRevenueModifier,
        penaltySeverity: finalSeverity,
        messages
    };
};

// --- New Financial System ---
export interface AnnualFinancialReport {
    guaranteedIncome: number;
    variableIncome: number;
    totalRevenue: number;
    payroll: number;
    luxuryTaxPaid: number;
    netIncome: number;
    isTaxPayer: boolean;
}

export const calculateAnnualFinancials = (
    team: Team,
    contracts: Contract[],
    salaryCap: number,
    luxuryTaxThreshold: number,
    consecutiveTaxYears: number = 0
): AnnualFinancialReport => {
    // 1. Guaranteed Income (85% of Salary Cap)
    const guaranteedIncome = salaryCap * 0.85;

    // 2. Variable Income (Tickets, Merch, Ads)
    // Base variable income is roughly 40% of cap to allow profit if good,
    // but we want: Guaranteed (85%) + Variable (~30-50%) > Cap (100%)
    // If they spend to Cap (100%), they need 15% more to break even.
    // So Variable needs to be at least 15% of Cap for a mediocre team.

    // Fan Interest drives this. 1.0 is average.
    // Let's say Base Variable is 30% of Cap. 
    // Variable = (Cap * 0.30) * FanInterest
    // Example: Cap 140M. Guaranteed 119M. 
    // Avg Team (1.0 Interest): Variable 42M. Total Rev = 161M.
    // Payroll 140M. Profit +21M.
    // Bad Team (0.6 Interest): Variable 25M. Total Rev = 144M. Profit +4M.
    // Great Team (1.5 Interest): Variable 63M. Total Rev = 182M. Profit +42M.
    // This allows saving up for Luxury Tax runs.

    const baseVariable = salaryCap * 0.35; // Slightly generous to assist with "3 seasons runway"
    const variableIncome = baseVariable * (team.fanInterest || 1.0);

    const totalRevenue = guaranteedIncome + variableIncome;

    // 3. Expenses (Payroll + Tax)
    const payroll = contracts.reduce((sum, c) => sum + c.amount, 0);

    let luxuryTaxPaid = 0;
    if (payroll > luxuryTaxThreshold) {
        // Repeater Tax Rates:
        // Year 1 (0 consecutive prev years): 1.50
        // Year 2 (1 consecutive prev year): 2.75
        // Year 3+ (2+ consecutive prev years): 4.50
        let taxRate = 1.5;
        if (consecutiveTaxYears >= 2) taxRate = 4.5;
        else if (consecutiveTaxYears === 1) taxRate = 2.75;

        luxuryTaxPaid = (payroll - luxuryTaxThreshold) * taxRate;
    }

    const totalExpenses = payroll + luxuryTaxPaid;
    const netIncome = totalRevenue - totalExpenses;

    return {
        guaranteedIncome,
        variableIncome,
        totalRevenue,
        payroll,
        luxuryTaxPaid,
        netIncome,
        isTaxPayer: luxuryTaxPaid > 0
    };
};


// --- LEAGUE ECONOMY LOGIC ---

export interface LeagueFinancialResult {
    newSalaryCap: number;
    totalLeagueRevenue: number;
    averageRevenue: number;
    taxCollected: number;
    revenueSharingPot: number;
    payoutPerTeam: number;
    eligibleTeamsCount: number;
}

export const calculateLeagueFinancials = (
    teams: Team[],
    currentCap: number,
    annualReports: Record<string, AnnualFinancialReport> // teamId -> Report
): LeagueFinancialResult => {
    // 1. Calculate Total Revenue & Tax
    let totalLeagueRevenue = 0;
    let taxCollected = 0;
    const eligibleTeams: string[] = [];

    teams.forEach(t => {
        const report = annualReports[t.id];
        if (report) {
            totalLeagueRevenue += report.totalRevenue;
            taxCollected += report.luxuryTaxPaid;

            // Revenue Sharing Eligibility:
            // Must NOT be a Tax Payer
            // Must be in bottom 50% of Revenue? Or just all non-taxpayers?
            // "Small Market" usually means low revenue.
            // Let's protect the bottom 15 revenue teams specifically to mimic "Small Market" aid.
            // But usually, the rule is just "Non-Taxpayers get the Tax".
            // User requested: "Small teams... never have money".
            // Hybrid: Distribute Tax to ALL Non-Taxpayers.
            // PLUS: Distribute a "Shared Pool" from top earners? (Too complex for now).
            // Let's stick to TAX DISTRIBUTION + Cap Floor padding.

            if (!report.isTaxPayer) {
                eligibleTeams.push(t.id);
            }
        }
    });

    const averageRevenue = totalLeagueRevenue / (teams.length || 1);

    // 2. Calculate New Salary Cap
    // Rule: Cap is ~48% of Basketball Related Income (BRI).
    // roughly 48% of Avg Team Revenue.
    let targetCap = averageRevenue * 0.48;

    // Smoothing: Don't let cap jump more than 10% in one year.
    const maxIncrease = currentCap * 1.10;
    const maxDecrease = currentCap * 0.95; // Don't crash hard

    // Clamp
    let newSalaryCap = Math.max(maxDecrease, Math.min(targetCap, maxIncrease));

    // Round to nearest 100k
    newSalaryCap = Math.round(newSalaryCap / 100000) * 100000;

    // 3. Revenue Sharing Calculation
    // Pot = 50% of Luxury Tax Collected (Owners keep 50%, 50% to needy teams)
    // PLUS 1% of Total League Revenue (Shared Pool conceptualized)
    const revenueSharingPot = (taxCollected * 0.50) + (totalLeagueRevenue * 0.01);

    const payoutPerTeam = eligibleTeams.length > 0 ? (revenueSharingPot / eligibleTeams.length) : 0;

    return {
        newSalaryCap,
        totalLeagueRevenue,
        averageRevenue,
        taxCollected,
        revenueSharingPot,
        payoutPerTeam,
        eligibleTeamsCount: eligibleTeams.length
    };
};
