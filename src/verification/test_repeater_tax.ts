
import { calculateAnnualFinancials } from '../features/finance/FinancialEngine';
import type { Team } from '../models/Team';
import type { Contract } from '../models/Contract';

const mockTeam: Team = {
    id: 'test-team',
    name: 'Test',
    city: 'City',
    abbreviation: 'TST',
    cash: 0,
    salaryCapSpace: 0,
    debt: 0,
    fanInterest: 1.0,
    ownerPatience: 50,
    marketSize: 'Medium',
    wins: 0,
    losses: 0,
    conference: 'East',
    rosterIds: [],
    draftPicks: [],
    rivalIds: [],
    history: [],
    financials: {
        totalIncome: 0,
        totalExpenses: 0,
        dailyIncome: 0,
        dailyExpenses: 0,
        seasonHistory: []
    }
};

const salaryCap = 140000000;
const luxuryTaxThreshold = 170000000;

// Create contracts totaling $180M ($10M over Tax Threshold)
const contracts: Contract[] = [
    { id: '1', playerId: 'p1', teamId: 'test-team', amount: 180000000, yearsLeft: 1, startYear: 2025, role: 'Star' }
];

console.log('--- Repeater Tax Verification ---');
console.log(`Payroll: $180M`);
console.log(`Tax Threshold: $170M`);
console.log(`Overage: $10M`);
console.log('---------------------------------');

// Test Year 1 (0 consecutive) -> Rate 1.5 -> Tax $15M
const reportYear1 = calculateAnnualFinancials(mockTeam, contracts, salaryCap, luxuryTaxThreshold, 0);
console.log(`Year 1 (0 consecutive): Expected Tax $15.0M | Actual: $${(reportYear1.luxuryTaxPaid / 1e6).toFixed(1)}M`);

// Test Year 2 (1 consecutive) -> Rate 2.75 -> Tax $27.5M
const reportYear2 = calculateAnnualFinancials(mockTeam, contracts, salaryCap, luxuryTaxThreshold, 1);
console.log(`Year 2 (1 consecutive): Expected Tax $27.5M | Actual: $${(reportYear2.luxuryTaxPaid / 1e6).toFixed(1)}M`);

// Test Year 3 (2 consecutive) -> Rate 4.5 -> Tax $45M
const reportYear3 = calculateAnnualFinancials(mockTeam, contracts, salaryCap, luxuryTaxThreshold, 2);
console.log(`Year 3 (2 consecutive): Expected Tax $45.0M | Actual: $${(reportYear3.luxuryTaxPaid / 1e6).toFixed(1)}M`);
