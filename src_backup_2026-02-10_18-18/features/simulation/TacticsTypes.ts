
export type PaceType = 'Very Slow' | 'Slow' | 'Normal' | 'Fast' | 'Seven Seconds';
export type OffensiveFocus = 'Balanced' | 'Inside' | 'Perimeter' | 'PickAndRoll';
export type DefensiveStrategy = 'Man-to-Man' | 'Zone 2-3' | 'Zone 3-2' | 'Full Court Press';

export interface TeamStrategy {
    pace: PaceType;
    offensiveFocus: OffensiveFocus;
    defense: DefensiveStrategy;
}

export const PACE_MULTIPLIERS: Record<PaceType, number> = {
    'Very Slow': 0.85,  // ~18s per possession
    'Slow': 0.92,       // ~16s
    'Normal': 1.0,      // ~14s
    'Fast': 1.1,        // ~12s
    'Seven Seconds': 1.25 // ~8-10s
};

// Bonus weights for actions based on focus
export const FOCUS_BONUSES: Record<OffensiveFocus, Record<string, number>> = {
    'Balanced': { drive: 1.0, shot: 1.0, pass: 1.0, post: 1.0 },
    'Inside': { drive: 1.3, post: 1.5, shot: 0.7, pass: 1.1 },
    'Perimeter': { shot: 1.4, drive: 0.9, post: 0.6, pass: 1.2 },
    'PickAndRoll': { pass: 1.4, drive: 1.2, shot: 0.9, post: 0.8 }
};
