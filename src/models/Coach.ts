export type PlayingStyle =
    | 'Pace and Space'    // High Pace, Perimeter Focus
    | 'Grit and Grind'     // Slow Pace, Defense Focus, Inside
    | 'Triangle'           // Normal Pace, Balanced, High Passing
    | 'Dribble Drive'      // Fast Pace, Inside Focus (Drive)
    | 'Seven Seconds'      // Very Fast, Perimeter
    | 'Princeton'         // High Passing, Balanced
    | 'Defensive Wall';   // Slow, Heavy Defense Focus

export interface Coach {
    id: string;
    firstName: string;
    lastName: string;
    rating: {
        offense: number;
        defense: number;
        talentDevelopment: number;
    };
    style: PlayingStyle;
    teamId: string | null;
    contract: {
        salary: number;
        yearsRemaining: number;
    };
}

export const STYLE_DESCRIPTIONS: Record<PlayingStyle, string> = {
    'Pace and Space': 'Prioritizes three-point shooting and high-speed transition play.',
    'Grit and Grind': 'Focuses on suffocating defense and physical post play.',
    'Triangle': 'A complex system emphasizing spacing and constant ball movement.',
    'Dribble Drive': 'Relies on perimeter penetration to create layups and open shots.',
    'Seven Seconds': 'Extremely high tempo aiming for shots within 7 seconds of possession.',
    'Princeton': 'Emphasizes high-post passing and constant off-ball cutting.',
    'Defensive Wall': 'Sacrifices pace to ensure the paint and perimeter are locked down.'
};
