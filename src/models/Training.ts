export const TrainingFocus = {
    BALANCED: 'Balanced',
    SHOOTING: 'Shooting',
    PLAYMAKING: 'Playmaking',
    DEFENSE: 'Defense',
    PHYSICAL: 'Physical',
    FUNDAMENTALS: 'Fundamentals', // Good for very young players or pure regression control
    NONE: 'None'
} as const;

export type TrainingFocus = typeof TrainingFocus[keyof typeof TrainingFocus];

export interface AttributeChange {
    attributeName: string;
    oldValue: number;
    newValue: number;
    delta: number;
}

export interface ProgressionResult {
    playerId: string;
    name: string;
    focus: TrainingFocus;
    changes: AttributeChange[];
    overallChange: number; // New OVR - Old OVR
    isRegression: boolean; // True if net negative or mostly negative
}
