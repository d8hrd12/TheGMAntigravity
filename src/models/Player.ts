export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface PlayerAttributes {
    // Scoring & Offense
    finishing: number;      // FG%, 2P%, FTA
    midRange: number;       // Mid Range %, FG%
    threePointShot: number; // 3P%, 3PA
    freeThrow: number;      // FT%
    playmaking: number;     // Assists, TOV
    ballHandling: number;   // TOV, Usage
    offensiveRebound: number; // ORB

    // Defense & Physicality
    interiorDefense: number; // Blocks, Height
    perimeterDefense: number; // Steals, PF
    stealing: number;       // Steals
    blocking: number;       // Blocks
    defensiveRebound: number; // DRB
    athleticism: number;    // Age, Height, Position (Speed/Vert)
    basketballIQ: number;   // Age, A/TO
}

export interface SeasonStats {
    gamesPlayed: number;
    minutes: number;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: number;
    offensiveRebounds: number;
    defensiveRebounds: number;
    fgMade: number;
    fgAttempted: number;
    threeMade: number;
    threeAttempted: number;
    ftMade: number;
    ftAttempted: number;
    plusMinus: number;
}

export interface CareerStat extends SeasonStats {
    season: number;
    teamId: string;
    overall?: number; // Historical OVR for development tracking
    isPlayoffs?: boolean;
}

export type Personality = 'Unpredictable' | 'Professional' | 'Workhorse' | 'Diva' | 'Loyalist' | 'Mercenary' | 'Enforcer' | 'Silent Leader';

export interface Player {
    id: string;
    faceId?: string;
    contractValue?: number;
    firstName: string;
    lastName: string;
    position: Position;
    secondaryPosition?: Position;
    age: number;
    height: number; // in cm
    weight: number; // in kg
    personality: Personality;

    attributes: PlayerAttributes;
    previousAttributes?: PlayerAttributes; // For tracking progression

    // Dynamic
    morale: number; // 0-100
    fatigue: number; // 0-100

    seasonStats: SeasonStats;
    playoffStats?: SeasonStats;
    careerStats: CareerStat[];
    overall: number;

    // Contract (linked later)
    jerseyNumber: number;
    teamId: string | null;

    // Tendencies (Behavioral) - v2 Model
    tendencies: {
        shooting: number; // 45-100: Calculated from Skills + Role
        passing: number;  // 45-100: Calculated from Skills + Role
        inside: number;   // 45-100: Derived from Shooting Ratio
        outside: number;  // 45-100: Derived from Shooting Ratio

        // Legacy/Detail (Optional - Can keep or derive)
        // For now, minimal set as requested. We can expand if needed.
        // We will keep 'defensiveAggression' etc as they don't conflict.
        defensiveAggression: number;
        foulTendency: number;
    };

    // Rotation / Coaching
    minutes: number; // Target minutes per game (0-48)
    isStarter: boolean;
    rotationIndex?: number; // 0-based index for rotation order
    potential: number;
    archetype?: string;
    loveForTheGame: number;
    badges?: Record<string, 'bronze' | 'silver' | 'gold' | 'hall_of_fame'>;
    isHallOfFame?: boolean;
    isRetired?: boolean;
    demandTrade?: boolean;
    yearsUnhappy?: number; // Consecutive years with poor morale
    tradeRequested?: boolean; // Formal trade request active
    contractType?: 'standard' | 'prove_it' | 'max';
    tradeRequestDeadline?: Date; // For prove-it deals

    acquisition?: {
        type: 'draft' | 'free_agent' | 'trade' | 'initial';
        year: number;
        details?: string; // e.g. "Round 1, Pick 5"
        previousTeamId?: string;
    };

    injury?: {
        type: string;
        returnDate: Date;
        severity: 'Low' | 'Medium' | 'High';
    };
}
