export interface AwardWinner {
    playerId: string;
    playerName: string;
    teamId: string;
    teamName: string;
    statsSummary: string;
    avatar?: string;
}

export interface SeasonAwards {
    year: number;
    mvp: AwardWinner;
    roty: AwardWinner;
    dpoy: AwardWinner;
    mip: AwardWinner;
    allStars: {
        west: AwardWinner[];
        east: AwardWinner[];
    };
    champion?: {
        teamId: string;
        teamName: string;
    };
    finalsMvp?: AwardWinner;
}
