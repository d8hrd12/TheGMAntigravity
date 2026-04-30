export type GMPhilosophy = 'Win Now' | 'Youth' | 'Financial' | 'Balanced';

export type AI_GM = {
    id: string;
    name: string;
    age: number;
    skills: {
        trading: number;      // 0-100 (Finding value in trades, harder to exploit)
        drafting: number;     // 0-100 (Finding sleepers in draft)
        negotiation: number;  // 0-100 (Lowering player salary demands)
        reputation: number;   // 0-100 (Attracting better free agents)
        financials: number;   // 0-100 (Staying under cap/tax, avoiding debt)
    };
    philosophy: GMPhilosophy;
    experience: number;
    teamId?: string; // Current team ID (empty if in FA pool)
    contractYears?: number;
    
    // Performance Tracking
    history: { 
        year: number;
        teamId: string; 
        wins: number; 
        losses: number; 
        playoffResult?: string; 
        isFired?: boolean;
    }[];
    
    tenureStartYear: number;
    jobSecurity: number; // 0-100 (Fires at 0)
};
