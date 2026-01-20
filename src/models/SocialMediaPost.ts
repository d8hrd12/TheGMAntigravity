
export interface SocialMediaPost {
    id: string;
    handle: string; // e.g. @NBA_Insider, @Local_Lakers_Fan
    displayName: string;
    content: string;
    likes: number;
    retweets: number;
    timestamp: Date;
    isVerified: boolean;
    avatar?: string;
    relatedPlayerId?: string;
    relatedTeamId?: string;
    type: 'FAN' | 'INSIDER' | 'PLAYER' | 'ANALYST';
}
