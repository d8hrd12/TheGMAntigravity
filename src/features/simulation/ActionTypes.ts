
export type ActionType = 'DRIVE' | 'SHOOT' | 'PASS' | 'POST_UP' | 'ISOLATION' | 'PICK_AND_ROLL' | 'KICK_OUT' | 'CATCH_AND_FINISH';

export type ShotZone = 'RIM' | 'MID_RANGE' | 'THREE_POINT';

export interface ActionWeight {
    action: ActionType;
    weight: number; // 0-100+
}

export interface ShotOutcome {
    made: boolean;
    points: number;
    zone: ShotZone;
    contestLevel: number; // 0 (Open) to 10 (Smothered)
    block: boolean;
    foul: boolean;
}

export interface DriveOutcome {
    success: boolean; // Blew by defender
    turnover: boolean;
    foul: boolean;
    forcedPickup: boolean; // Stopped, forced to pass/shoot
}

export interface PassOutcome {
    success: boolean;
    turnover: boolean;
    assistPotential: boolean; // Pass led to immediate open shot
    receiverId: string;
}
