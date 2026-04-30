export const TrainingFocus = {
    BALANCED: 'Balanced',
    SHOOTING: 'Shooting',
    PLAYMAKING: 'Playmaking',
    DEFENSE: 'Defense',
    PHYSICAL: 'Physical',
    FUNDAMENTALS: 'Fundamentals', // Good for very young players or pure regression control
    NONE: 'None',
    NATURAL: 'Natural'
} as const;

export type TrainingFocus = typeof TrainingFocus[keyof typeof TrainingFocus];

export const TrainingFocusLabels: Record<TrainingFocus, string> = {
    [TrainingFocus.BALANCED]: 'Balanced Development',
    [TrainingFocus.SHOOTING]: 'Finishing & Shooting',
    [TrainingFocus.PLAYMAKING]: 'Passing & Handling',
    [TrainingFocus.DEFENSE]: 'Defense & Rebounding',
    [TrainingFocus.PHYSICAL]: 'Athleticism & Conditioning',
    [TrainingFocus.FUNDAMENTALS]: 'Basic Fundamentals',
    [TrainingFocus.NONE]: 'No Focus (Rest)',
    [TrainingFocus.NATURAL]: 'Natural Growth'
};

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
