export interface GameTime {
    quarter: number;
    minute: number; // 12 down to 0
    second: number; // 59 down to 0
    totalSeconds: number; // For calculation (e.g., 720 down to 0 per quarter)
}

export type ShotType = 'LAYUP' | 'DUNK' | 'MID_RANGE' | 'THREE_POINT' | 'FREE_THROW';
export const ShotType = {
    LAYUP: 'LAYUP' as ShotType,
    DUNK: 'DUNK' as ShotType,
    MID_RANGE: 'MID_RANGE' as ShotType,
    THREE_POINT: 'THREE_POINT' as ShotType,
    FREE_THROW: 'FREE_THROW' as ShotType
};

export type EventType = 'TIP_OFF' | 'POSSESSION_START' | 'PASS' | 'DRIVE' | 'SHOT' | 'SCORE' | 'MISS' | 'REBOUND' | 'TURNOVER' | 'FOUL' | 'SUBSTITUTION' | 'TIMEOUT' | 'END_QUARTER' | 'GAME_END' | 'FREE_THROW_MADE' | 'FREE_THROW_MISSED' | 'STEAL' | 'BLOCK';
export const EventType = {
    TIP_OFF: 'TIP_OFF' as EventType,
    POSSESSION_START: 'POSSESSION_START' as EventType,
    PASS: 'PASS' as EventType,
    DRIVE: 'DRIVE' as EventType,
    SHOT: 'SHOT' as EventType,
    SCORE: 'SCORE' as EventType,
    MISS: 'MISS' as EventType,
    REBOUND: 'REBOUND' as EventType,
    TURNOVER: 'TURNOVER' as EventType,
    FOUL: 'FOUL' as EventType,
    SUBSTITUTION: 'SUBSTITUTION' as EventType,
    TIMEOUT: 'TIMEOUT' as EventType,
    END_QUARTER: 'END_QUARTER' as EventType,
    GAME_END: 'GAME_END' as EventType,
    FREE_THROW_MADE: 'FREE_THROW_MADE' as EventType,
    FREE_THROW_MISSED: 'FREE_THROW_MISSED' as EventType,
    STEAL: 'STEAL' as EventType,
    BLOCK: 'BLOCK' as EventType
};

export interface MatchEvent {
    id: string;
    type: EventType;
    text: string;
    timestamp: number; // Seconds from start of game (0 to 2880+)
    playerId?: string;
    teamId?: string;
    secondaryPlayerId?: string; // Assist, Defender, etc.
    score?: { home: number, away: number };
    location?: { x: number, y: number }; // 0-100, 0-50
}

export interface PlayerStats {
    playerId: string;
    name: string;
    minutes: number;
    points: number;
    fgMade: number;
    fgAttempted: number;
    threeMade: number;
    threeAttempted: number;
    ftMade: number;
    ftAttempted: number;
    rebounds: number;
    offensiveRebounds: number;
    defensiveRebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    personalFouls: number;
    plusMinus: number;
    consecutiveFieldGoalsMade: number;
}

export interface BoxScore {
    homeStats: Record<string, PlayerStats>;
    awayStats: Record<string, PlayerStats>;
    homeScore: number;
    awayScore: number;
    quarters: number[]; // e.g. [24, 26, 30, 22] - Changed to number[] to match UI expectations
}

export interface InjuryReport {
    playerId: string;
    type: string;
    severity: 'Low' | 'Medium' | 'High';
    returnDate: Date;
}

export interface MatchResult {
    id: string;
    date: Date;
    homeTeamId: string;
    awayTeamId: string;
    winnerId: string;
    homeScore: number;
    awayScore: number;
    boxScore: BoxScore;
    injuries: InjuryReport[];
    events: GameEvent[];
}

export interface SimulationState {
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeRemaining: number; // Seconds in current quarter
    possession: 'HOME' | 'AWAY';
    shotClock: number;
    homeLineup: string[]; // Player IDs
    awayLineup: string[]; // Player IDs
    events: MatchEvent[];
    boxScore: BoxScore;
    homeFouls: number;
    awayFouls: number;
    homeTimeouts: number;
    awayTimeouts: number;
    fatigue: Record<string, number>; // 0-100
    lastEventTime: number; // To track time delta
    gameId: string;
    isFinished: boolean;
    isOvertime: boolean;
}

export interface ShotConfig {
    basePercentage: number;
    attributeKey: string;
    defenseKey: string;
    distanceFactor: number;
}

// --- INTEGRATION TYPES (STEP 6) ---
export type GameEventType =
    | 'action'
    | 'shot_made'
    | 'shot_miss'
    | 'turnover'
    | 'rebound'
    | 'foul'
    | 'free_throw_made'
    | 'free_throw_miss'
    | 'steal'
    | 'block'
    | 'substitution'
    | 'possession_start'
    | 'timeout'
    | 'quarter_end'
    | 'game_end';

export const GameEventType = {
    PASS: 'action' as GameEventType, // Mapped for commentary engine compatibility
    SHOT_MADE: 'shot_made' as GameEventType,
    SHOT_MISS: 'shot_miss' as GameEventType,
    TURNOVER: 'turnover' as GameEventType,
    REBOUND: 'rebound' as GameEventType,
    FOUL: 'foul' as GameEventType,
    FREE_THROW_MADE: 'free_throw_made' as GameEventType,
    FREE_THROW_MISS: 'free_throw_miss' as GameEventType,
    STEAL: 'steal' as GameEventType,
    BLOCK: 'block' as GameEventType,
    SUBSTITUTION: 'substitution' as GameEventType,
    POSSESSION_START: 'possession_start' as GameEventType,
    TIMEOUT: 'timeout' as GameEventType,
    QUARTER_END: 'quarter_end' as GameEventType,
    GAME_END: 'game_end' as GameEventType
};

export interface GameEvent {
    id?: string; // Optional for compatibility, but recommended
    gameTime: number; // Seconds remaining in game
    possessionId: number;
    teamId: string;
    playerId?: string;
    secondaryPlayerId?: string; // Assist, Blocker, Stealer, etc.
    type: GameEventType;

    // Optional details for UI/Debug
    text?: string;
    score?: number;
    subType?: string;
    data?: any;
}

export interface PossessionResult {
    events: GameEvent[];
    possessionEnded: boolean;
    nextOffenseTeamId: string;
    duration: number;
}

export interface PlayerRotationSettings {
    playerId: string;
    minutes: number;
    isStarter: boolean;
    rotationIndex: number;
}

export interface TeamRotationData {
    id: string;
    quarter: 1 | 2 | 3 | 4;
    startMinute: number;
    endMinute: number;
    playerIds: string[];
}

export interface MatchInput {
    homeTeam: any; // Team models can vary, using any to avoid import circularity if needed or just use Team
    awayTeam: any;
    homeRoster: any[];
    awayRoster: any[];
    homeRotation?: TeamRotationData[];
    awayRotation?: TeamRotationData[];
    date: Date;
    userTeamId?: string; // To enforce strict rotation
}
