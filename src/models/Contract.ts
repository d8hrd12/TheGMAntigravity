export interface Contract {
    id: string;
    playerId: string;
    teamId: string;
    amount: number; // Annual salary
    yearsLeft: number;
    startYear: number;
    role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect';
}
