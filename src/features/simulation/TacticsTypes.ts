
export type PaceType = 'Very Slow' | 'Slow' | 'Normal' | 'Fast' | 'Seven Seconds';
export type OffensiveFocus = 'Balanced' | 'Inside' | 'Perimeter' | 'PickAndRoll';
export type DefensiveStrategy =
    | 'Man-to-Man'
    | 'Zone 2-3'
    | 'Zone 3-2'
    | 'Switch'
    | 'Drop'
    | 'Full Court Press';

export interface TeamStrategy {
    pace: PaceType;
    offensiveFocus: OffensiveFocus;
    defense: DefensiveStrategy;
}

export const PACE_MULTIPLIERS: Record<PaceType, number> = {
    'Very Slow': 0.88,  // Adjusted for ~90 possessions
    'Slow': 0.94,
    'Normal': 1.0,      // ~95 possessions
    'Fast': 1.08,
    'Seven Seconds': 1.18 // Adjusted for ~102 possessions
};

// Bonus weights for actions based on focus
export const FOCUS_BONUSES: Record<OffensiveFocus, Record<string, number>> = {
    'Balanced': { drive: 1.0, shot: 1.0, pass: 1.0, post: 1.0 },
    'Inside': { drive: 1.2, post: 1.4, shot: 0.8, pass: 1.1 },
    'Perimeter': { shot: 1.3, drive: 0.9, post: 0.7, pass: 1.2 },
    'PickAndRoll': { pass: 1.3, drive: 1.2, shot: 0.9, post: 0.8 }
};

export const DEFENSIVE_SCHEME_EFFECTS: Record<DefensiveStrategy, any> = {
    'Man-to-Man': { isolationModifier: 0, rimProtection: 1.0, perimeterContest: 1.0 },
    'Zone 2-3': { isolationModifier: -5, rimProtection: 1.2, perimeterContest: 0.85, rebModifier: -0.05 },
    'Zone 3-2': { isolationModifier: -5, rimProtection: 0.85, perimeterContest: 1.2, rebModifier: -0.05 },
    'Switch': { isolationModifier: -10, rimProtection: 0.95, perimeterContest: 0.95, mismatchModifier: 10 },
    'Drop': { isolationModifier: 0, rimProtection: 1.15, midrangeModifier: 0.1, rebModifier: 0.02 },
    'Full Court Press': { turnoverForced: 0.05, energyDrain: 1.5, foulRisk: 1.2 }
};
