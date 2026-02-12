
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

// Defining types that match SimulationTypes.ts to ensure compatibility

export interface PlayerStats {
    playerId: string;
    teamId: string;
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
    personalFouls: number; // Mapped from 'fouls'
    plusMinus: number;
    [key: string]: number | string; // Index signature for dynamic access
}

export interface BoxScoreStats extends PlayerStats { } // Alias if needed, or just use PlayerStats

export interface GameEvent {
    id: string;
    type: "action" | "shot_made" | "shot_miss" | "turnover" | "rebound" | "foul" | "free_throw" | "steal" | "block" | "substitution" | "possession_start" | "timeout";
    description: string;
    quarter: number;
    timeRemaining: number;
    possessionId: number; // Added for compatibility
    text?: string;
    data?: any;
    teamId: string; // Required for compatibility
    playerId?: string;
    gameTime: number; // Required for compatibility
    subType?: string;
    score?: number; // Changed to number for compatibility
}

export interface BoxScore {
    homeStats: Record<string, PlayerStats>;
    awayStats: Record<string, PlayerStats>;
    homeScore: number;
    awayScore: number;
    quarters: number[]; // e.g. [24, 26, 30, 22] for Home? Or combined? SimulationTypes says number[]
}

export interface MatchResult {
    id: string;
    date: Date;
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    winnerId: string;
    stats: PlayerStats[]; // Flat list
    boxScore: BoxScore; // Structured
    playByPlay: string[];
    events: GameEvent[];
    injuries: any[];
}

export interface TeamRotationData {
    startingLineup: string[];
    bench: string[];
    rotationPlan: any[];
}

export function simulateMatch(args: any): MatchResult {
    // Stub implementation
    const homeId = args.homeTeam?.id || 'home';
    const awayId = args.awayTeam?.id || 'away';

    return {
        id: 'stub_' + Date.now(),
        date: args.date || new Date(),
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeScore: 100,
        awayScore: 90,
        winnerId: homeId,
        stats: [],
        boxScore: {
            homeStats: {},
            awayStats: {},
            homeScore: 100,
            awayScore: 90,
            quarters: [25, 25, 25, 25]
        },
        playByPlay: [],
        events: [],
        injuries: []
    };
}
