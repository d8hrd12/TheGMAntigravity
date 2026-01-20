export interface GMPerk {
    id: string;
    name: string;
    description: string;
    cost: number; // Trust Points cost
    tier: 1 | 2 | 3;
    category: 'scouting' | 'negotiation' | 'medical' | 'charisma' | 'facilities';
    effect: (state: any) => void; // Description of effect, logic handled elsewhere
}

export interface GMGoal {
    id: string;
    description: string;
    type: 'wins' | 'playoffs' | 'financial' | 'roster' | 'stat';
    targetValue: number;
    currentValue: number;
    rewardTrust: number;
    isCompleted: boolean;
    isFailed: boolean;
    deadline?: Date; // e.g., "Trade Deadline" or "End of Season"
}

export interface GMProfile {
    name: string;
    level: number;
    xp: number; // Current Trust Points / XP
    trustPoints: number; // Currency to spend
    totalTrustEarned: number; // Lifetime accumulation for Level

    unlockedPerks: string[]; // IDs of unlocked perks

    currentGoals: GMGoal[];

    // Stats
    seasonsManaged: number;
    championships: number;
    playoffAppearances: number;
    rating: number; // 0-100 Score of GM performance
}

export const INITIAL_GM_PROFILE: GMProfile = {
    name: "User GM",
    level: 1,
    xp: 0,
    trustPoints: 0,
    totalTrustEarned: 0,
    unlockedPerks: [],
    currentGoals: [],
    seasonsManaged: 0,
    championships: 0,
    playoffAppearances: 0,
    rating: 50
};

export const AVAILABLE_PERKS: GMPerk[] = [
    // Tier 1 (Cost 100)
    { id: 'scout_1', name: 'Local Scout', description: 'Reveal exact potential of 1 prospect per year.', cost: 100, tier: 1, category: 'scouting', effect: () => { } },
    { id: 'deal_1', name: 'Smooth Talker', description: 'AI is 5% more likely to accept trade offers.', cost: 100, tier: 1, category: 'negotiation', effect: () => { } },
    { id: 'med_1', name: 'Physio Staff', description: 'Reduce injury duration by 10%.', cost: 100, tier: 1, category: 'medical', effect: () => { } },

    // Tier 2 (Cost 300)
    { id: 'scout_2', name: 'Regional Network', description: 'Reveal exact potential of 3 prospects per year.', cost: 300, tier: 2, category: 'scouting', effect: () => { } },
    { id: 'fac_1', name: 'Fan Experience', description: 'Ticket prices affect morale 20% less.', cost: 300, tier: 2, category: 'facilities', effect: () => { } },

    // Tier 3 (Cost 1000)
    { id: 'char_1', name: 'Legendary Status', description: 'Free Agents are 15% more likely to sign.', cost: 1000, tier: 3, category: 'charisma', effect: () => { } }
];
