import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { GMGoal, GMProfile } from '../../models/GMProfile';
import { generateUUID } from '../../utils/uuid';

export const generateSeasonGoals = (team: Team, roster: Player[], expectation: string): GMGoal[] => {
    const goals: GMGoal[] = [];

    // Base Goal: Winning
    if (expectation === 'TITLE_OR_BUST') {
        goals.push({
            id: generateUUID(),
            description: "Win the Championship",
            type: 'playoffs',
            targetValue: 4, // 4 rounds won? Or just flag
            currentValue: 0,
            rewardTrust: 1000,
            isCompleted: false,
            isFailed: false,
            deadline: undefined // End of playoffs
        });
    } else if (expectation === 'FINALS_EXPECTED') {
        goals.push({
            id: generateUUID(),
            description: "Reach the NBA Finals",
            type: 'playoffs',
            targetValue: 3, // Win Conf Finals
            currentValue: 0,
            rewardTrust: 500,
            isCompleted: false,
            isFailed: false
        });
    } else if (expectation === 'REBUILD') {
        // Talent Acquisition Goal
        goals.push({
            id: generateUUID(),
            description: "Acquire two 1st Round Picks",
            type: 'roster',
            targetValue: 2,
            currentValue: team.draftPicks.filter(p => p.round === 1).length, // Need to track *acquired* vs initial? Simplified to "Have at end of season"
            rewardTrust: 300,
            isCompleted: false,
            isFailed: false
        });

        // Development Goal
        const youngPlayers = roster.filter(p => p.age < 23);
        if (youngPlayers.length > 0) {
            goals.push({
                id: generateUUID(),
                description: "Develop a Young Player (Age < 23) to +3 OVR",
                type: 'stat', // Custom type really
                targetValue: 3,
                currentValue: 0,
                rewardTrust: 250,
                isCompleted: false,
                isFailed: false
            });
        }
    } else {
        // Playoffs Goal
        goals.push({
            id: generateUUID(),
            description: "Make the Playoffs",
            type: 'playoffs',
            targetValue: 1, // Make R1
            currentValue: 0,
            rewardTrust: 200,
            isCompleted: false,
            isFailed: false
        });
    }

    // Financial Goal?
    if (team.salaryCapSpace < -20000000) { // Deep in tax
        goals.push({
            id: generateUUID(),
            description: "Reduce Luxury Tax Bill (Get under apron)",
            type: 'financial',
            targetValue: 0,
            currentValue: team.salaryCapSpace,
            rewardTrust: 400,
            isCompleted: false,
            isFailed: false
        });
    }

    return goals;
};


export const checkGoalProgress = (goals: GMGoal[], team: Team, roster: Player[], seasonResult?: string): GMGoal[] => {
    // This needs to be called periodically or at end of season
    return goals.map(g => {
        if (g.isCompleted || g.isFailed) return g;

        if (g.type === 'playoffs') {
            // Check seasonResult if provided
            // Simplified check logic would go here
            if (seasonResult) {
                if (g.description.includes("Win the Championship") && seasonResult === 'CHAMPION') return { ...g, isCompleted: true };
                if (g.description.includes("Finals") && (seasonResult === 'CHAMPION' || seasonResult === 'FINALS_LOSS')) return { ...g, isCompleted: true };
                if (g.description.includes("Playoffs") && seasonResult !== 'MISSED_PLAYOFFS') return { ...g, isCompleted: true };
            }
        }

        // Rebuild goals
        if (g.description.includes("1st Round Picks")) {
            const firsts = team.draftPicks.filter(p => p.round === 1).length;
            if (firsts >= g.targetValue) return { ...g, isCompleted: true };
        }

        // Stat goals (Development)
        if (g.description.includes("Develop a Young Player")) {
            const youngPlayers = roster.filter(p => p.age < 23);
            // We need to track progress. currentValue = max gain seen?
            // This is hard without history. Let's simplify: check if ANY young player has OVR >= Initial + Target
            // For now, assume we just check current OVR > 80 as a proxy or skip complex stat tracking for v1
            if (youngPlayers.some(p => p.overall >= 80)) return { ...g, isCompleted: true }; // Simplified proxy definition
        }

        // Financial
        if (g.type === 'financial') {
            if (team.salaryCapSpace > g.targetValue) return { ...g, isCompleted: true };
        }

        return g;
    });
};

export const processGMGoalUpdates = (profile: GMProfile, team: Team, roster: Player[], seasonResult?: string) => {
    const updatedGoals = checkGoalProgress(profile.currentGoals, team, roster, seasonResult);

    let xpGained = 0;
    const newCompletedGoals = updatedGoals.filter(g => g.isCompleted && !profile.currentGoals.find((og: GMGoal) => og.id === g.id)?.isCompleted);

    newCompletedGoals.forEach(g => {
        xpGained += g.rewardTrust;
    });

    // Check for leveling up
    let newLevel = profile.level;
    let newTotalTrust = profile.totalTrustEarned + xpGained;
    // Simple level curve: Level * 1000 ? 
    // Level 1 -> 2 needs 1000 total. Level 2 -> 3 needs 3000 total?
    // Let's just say every 1000 XP is a level for simplicity now
    newLevel = 1 + Math.floor(newTotalTrust / 1000);

    const updatedProfile: GMProfile = {
        ...profile,
        currentGoals: updatedGoals,
        trustPoints: profile.trustPoints + xpGained,
        xp: profile.xp + xpGained,
        totalTrustEarned: newTotalTrust,
        level: newLevel
    };

    return {
        updatedProfile,
        xpGained,
        goalsCompleted: newCompletedGoals
    };
};
