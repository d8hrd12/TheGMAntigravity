export interface NewsStory {
    id: string;
    date: Date;
    headline: string;
    content: string;
    type: 'TRADE' | 'INJURY' | 'GAME' | 'AWARD' | 'RUMOR' | 'TRANSACTION' | 'GENERAL';
    image?: string;
    relatedTeamId?: string;
    relatedPlayerId?: string;
    priority: number; // 1 (Low) to 5 (Breaking/High)
}
