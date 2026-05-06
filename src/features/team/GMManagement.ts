import type { GameState } from '../../store/GameContext';
import type { AI_GM } from '../../models/AI_GM';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { generateGM } from './gmGenerator';
import { getTeamDirection } from '../trade/TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';

/**
 * Calculates a score (0-100) for a GM's performance based on team results and strategy.
 */
export const calculateGMPerformance = (team: Team, gm: AI_GM): number => {
    // 1. Winning Component (40%)
    const winPct = (team.wins || 0) / Math.max(1, (team.wins || 0) + (team.losses || 0));
    let winScore = winPct * 100;
    
    // Adjust based on direction (Rebuilders aren't expected to win)
    if (team.strategy?.direction === 'Rebuilding') {
        winScore = Math.min(100, winScore * 1.5 + 40); // 30% win pct is "good" for rebuilder
    } else if (team.strategy?.direction === 'Contender') {
        winScore = winPct < 0.5 ? winScore * 0.5 : winScore; // 50% is "bad" for contender
    }

    // 2. Financial Component (20%)
    const cash = team.cash || 0;
    let finScore = 50;
    const financialSkill = gm.skills.financials || 50;
    
    // Skill bonus: Better GMs "handle" lower cash better in owners' eyes
    const adjustedCash = cash + (financialSkill * 200000); 
    if (adjustedCash > 50000000) finScore = 90;
    if (adjustedCash < 0) finScore = 20;

    // 3. Consistency (40%) - How well did they stick to focus?
    const consistencyScore = 70; 

    return (winScore * 0.4) + (finScore * 0.2) + (consistencyScore * 0.4);
};

/**
 * Processes league-wide GM changes. Usually called at end of season.
 */
export const processGMDismissals = (
    teams: Team[],
    gms: AI_GM[],
    userTeamId: string
): { updatedGms: AI_GM[], newsItems: string[] } => {
    const newsItems: string[] = [];
    const updatedGms = [...gms];

    teams.forEach(team => {
        if (team.id === userTeamId) return;

        const gmIndex = updatedGms.findIndex(g => g.id === team.gmId);
        if (gmIndex === -1) return;

        const gm = updatedGms[gmIndex];
        const performance = calculateGMPerformance(team, gm);

        // Update Job Security
        // Reputation factor: High rep GMs lose security slower and gain it faster
        const reputation = gm.skills.reputation || 50;
        const repFactor = 1 + (reputation - 50) / 100; // 0.5 to 1.5

        let securityChange = 0;
        if (performance < 45) securityChange = -15 / repFactor;
        else if (performance < 55) securityChange = -5 / repFactor;
        else if (performance > 75) securityChange = 10 * repFactor;
        else if (performance > 65) securityChange = 5 * repFactor;

        const newSecurity = Math.max(0, Math.min(100, gm.jobSecurity + securityChange));
        updatedGms[gmIndex] = { ...gm, jobSecurity: newSecurity };

        // FIRE LOGIC: 
        // 1. Security reaches 0.
        // 2. Random chance if security is low (< 30)
        const fired = newSecurity === 0 || (newSecurity < 30 && Math.random() < 0.3);

        if (fired) {
            newsItems.push(`The ${team.city} ${team.name} have fired GM ${gm.name} following poor organizational results.`);
            
            // Move to Free Agents
            updatedGms[gmIndex] = { ...updatedGms[gmIndex], teamId: undefined, jobSecurity: 50 };

            // Hire NEW GM
            // 1. Try to pick from Free Agents (GMs with teamId = null)
            const available = updatedGms.filter(g => g.teamId === null && g.id !== gm.id);
            let newGm: AI_GM;

            if (available.length > 0) {
                newGm = available[Math.floor(Math.random() * available.length)];
                const newGmIndex = updatedGms.findIndex(g => g.id === newGm.id);
                updatedGms[newGmIndex] = { ...newGm, teamId: team.id, jobSecurity: 80 };
            } else {
                // Generate fresh talent
                newGm = generateGM({ teamId: team.id });
                updatedGms.push(newGm);
            }

            newsItems.push(`The ${team.city} ${team.name} have hired ${newGm.name} as their new General Manager.`);
            
            // Update team link (This normally happens in state update but we return gms)
            // The caller must update team.gmId
        }
    });

    return { updatedGms, newsItems };
};

/**
 * Re-evaluates a team's strategic direction each offseason.
 * Rules (from real basketball logic):
 * - Young core (avg age < 27) that hasn't developed -> keep building, don't panic
 * - Young core (avg age 27+) that still failed -> blow it up, tank for picks
 * - Team with a superstar + winning record -> Contender
 * - Team aging with no future -> Retool or Rebuild
 */
export const updateTeamStrategy = (
    team: Team,
    roster: Player[],
    year: number
): Team => {
    if (roster.length === 0) return team;

    const direction = getTeamDirection(team, roster);

    // Analyze roster quality
    const topPlayers = [...roster].sort((a, b) => (b.overall || 0) - (a.overall || 0)).slice(0, 5);
    const hasElite = topPlayers.some(p => calculateOverall(p) >= 87);
    const hasYoungStar = roster.some(p => p.age <= 26 && calculateOverall(p) >= 83);
    const avgTopAge = topPlayers.reduce((s, p) => s + p.age, 0) / topPlayers.length;

    // Failed rebuild detection: core aged out (27+) without developing
    const agedFailedCore = avgTopAge >= 27 && !hasElite && !hasYoungStar;

    // Determine new strategic direction
    let newDirection: 'Contender' | 'PlayoffTeam' | 'Young_Developing' | 'Rebuilding';
    let newFocus: 'Balanced' | 'Win Now' | 'Future' | 'Financial';

    if (direction === 'Contender' || (hasElite && team.wins > team.losses)) {
        newDirection = 'Contender';
        newFocus = 'Win Now';
    } else if (direction === 'PlayoffTeam' && hasYoungStar) {
        newDirection = 'PlayoffTeam';
        newFocus = 'Balanced';
    } else if (direction === 'Young_Developing' || (hasYoungStar && !agedFailedCore)) {
        newDirection = 'Young_Developing';
        newFocus = 'Future';
    } else if (agedFailedCore) {
        // Core aged out without developing — full rebuild
        newDirection = 'Rebuilding';
        newFocus = 'Future';
    } else {
        newDirection = 'Rebuilding';
        newFocus = 'Future';
    }

    // Only update if direction actually changes (avoid thrashing)
    const currentDirection = team.strategy?.direction;
    const lastChangeYear = team.strategy?.lastDirectionChangeYear || 0;
    const yearsSinceChange = year - lastChangeYear;

    // Don't flip direction more than once every 2 years (stability)
    if (currentDirection === newDirection || yearsSinceChange < 2) {
        return {
            ...team,
            strategy: {
                ...team.strategy!,
                focus: newFocus,
                aggressiveness: newDirection === 'Contender' ? 85 : newDirection === 'Rebuilding' ? 30 : 60,
                lastDirectionChangeYear: team.strategy?.lastDirectionChangeYear || year
            }
        };
    }

    return {
        ...team,
        strategy: {
            direction: newDirection,
            focus: newFocus,
            aggressiveness: newDirection === 'Contender' ? 85 : newDirection === 'Rebuilding' ? 30 : 60,
            lastDirectionChangeYear: year
        }
    };
};
