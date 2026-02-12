export interface TradeProposal {
    userPlayerIds: string[];
    userPickIds: string[];
    aiPlayerIds: string[];
    aiPickIds: string[];
    aiTeamId: string;
    status: 'pending' | 'accepted' | 'rejected';
}
