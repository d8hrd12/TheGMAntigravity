export interface DraftPick {
    id: string;
    year: number;
    round: 1 | 2;
    originalTeamId: string; // The team whose performance determines the pick's value
    originalTeamName?: string; // Cache for UI
}
