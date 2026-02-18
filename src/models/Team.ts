import type { DraftPick } from './DraftPick';

export interface CoachStrategy {
    pace: number; // 0-100 (Slow -> Fast)
    threePointAggression: number; // 0-100 (Conservative -> Modern)
    defensiveIntensity: number; // 0-100 (Passive -> Physical)
    rotationDepth: number; // 8-12
}

export interface RotationSegment {
    id: string;
    quarter: 1 | 2 | 3 | 4;
    startMinute: number; // 12.0 start
    endMinute: number;   // 0.0 end
    playerIds: string[]; // Exactly 5
}

export interface Team {
    id: string;
    rotationSchedule?: RotationSegment[];
    name: string;
    city: string;
    abbreviation: string;
    logo?: string; // Base64 data URL

    // Financials
    salaryCapSpace: number; // This can be calculated from contracts
    // budget: number; // REMOVED: Replaced by cash
    cash: number; // Actual money in bank
    debt: number; // Accumulated debt
    fanInterest: number; // 0.5 to 2.0
    ownerPatience: number; // 0 to 100
    marketSize: 'Small' | 'Medium' | 'Large';

    financials: {
        totalIncome: number;
        totalExpenses: number;
        dailyIncome: number;
        dailyExpenses: number;
        seasonHistory: {
            year: number;
            profit: number;
            revenue: number;
            payroll: number;
            luxuryTax: number;
        }[];
    };

    // Luxury Tax Repeater Status
    consecutiveTaxYears?: number;

    // Roster logic
    rosterIds: string[];

    wins: number;
    losses: number;

    conference: 'East' | 'West';
    colors?: {
        primary: string;
        secondary: string;
    };
    draftPicks: DraftPick[];
    rivalIds: string[];
    history: { year: number; wins: number; losses: number; playoffResult?: string; }[];

    // Strategy
    coachId?: string;
    tactics?: import('../features/simulation/TacticsTypes').TeamStrategy;
    // coachSettings?: CoachStrategy; // DEPRECATED
}
