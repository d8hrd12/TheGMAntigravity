import type { Coach } from '../../models/Coach';
import type { Team } from '../../models/Team';
import { generateCoach, getTacticsForStyle } from './coachGenerator';

/**
 * Evaluates a team's coach performance and determines if they should be fired.
 *
 * Logic:
 * - A coach is evaluated based on the team's win rate vs. expected win rate.
 * - Expected win rate is derived from the team's overall roster quality.
 * - If the team is significantly underperforming AND has had recent "correcting moves" (trades),
 *   the coach is given a grace period. Otherwise, they may be fired.
 *
 * @param team - The team to evaluate.
 * @param coach - The current coach of the team.
 * @param seasonGamesPlayed - How many games have been played this season.
 * @param recentTradeCount - Number of trades made in the last ~30 days (correcting moves).
 * @returns `true` if the coach should be fired, `false` otherwise.
 */
export function shouldFireCoach(
    team: Team,
    coach: Coach,
    seasonGamesPlayed: number,
    recentTradeCount: number = 0
): boolean {
    // Don't evaluate early in the season
    if (seasonGamesPlayed < 20) return false;

    const totalGames = (team.wins || 0) + (team.losses || 0);
    if (totalGames < 20) return false;

    const actualWinRate = (team.wins || 0) / totalGames;

    // Expected win rate based on coach rating (higher-rated coaches on bad teams still get fired)
    // We use a simple heuristic: a team with a 75-rated coach should win ~45% of games
    const avgCoachRating = (coach.rating.offense + coach.rating.defense) / 2;
    const expectedWinRate = 0.2 + (avgCoachRating - 60) / (98 - 60) * 0.5; // Maps 60->0.2, 98->0.7

    const underperformance = expectedWinRate - actualWinRate;

    // If significantly underperforming (more than 15% below expectation)
    if (underperformance > 0.15) {
        // Grace period: if team made correcting moves (trades) recently, give them more time
        if (recentTradeCount >= 2 && seasonGamesPlayed < 60) {
            console.log(`[CoachEval] ${team.name} coach ${coach.lastName} underperforming but has grace period (${recentTradeCount} recent trades).`);
            return false;
        }

        // Probability of firing increases with underperformance severity
        const fireProbability = Math.min(0.9, underperformance * 3);
        const roll = Math.random();
        if (roll < fireProbability) {
            console.log(`[CoachEval] ${team.name} fires coach ${coach.lastName}! Win rate: ${(actualWinRate * 100).toFixed(0)}% vs expected ${(expectedWinRate * 100).toFixed(0)}%`);
            return true;
        }
    }

    return false;
}

/**
 * Fires a coach from a team and optionally hires a replacement from the free agent pool.
 * Returns updated coaches and teams arrays.
 */
export function fireCoach(
    team: Team,
    coaches: Coach[],
    teams: Team[]
): { updatedCoaches: Coach[]; updatedTeams: Team[] } {
    const updatedCoaches = coaches.map(c => {
        if (c.id === team.coachId) {
            return { ...c, teamId: null as null, contract: { ...c.contract, yearsRemaining: 0 } };
        }
        return c;
    });

    const updatedTeams = teams.map(t => {
        if (t.id === team.id) {
            return { ...t, coachId: undefined };
        }
        return t;
    });

    return { updatedCoaches, updatedTeams };
}

/**
 * Hires the best available free agent coach for a team.
 * If no free agents are available, generates a new coach.
 */
export function hireCoach(
    team: Team,
    coaches: Coach[],
    teams: Team[]
): { updatedCoaches: Coach[]; updatedTeams: Team[] } {
    const updatedCoaches = [...coaches];
    const updatedTeams = teams.map(t => ({ ...t }));

    const freeAgents = updatedCoaches.filter(c => !c.teamId);

    let hired: Coach;
    if (freeAgents.length === 0) {
        hired = generateCoach(team.id);
        updatedCoaches.push(hired);
    } else {
        // Sort by combined rating with some randomness
        freeAgents.sort((a, b) =>
            (b.rating.offense + b.rating.defense) - (a.rating.offense + a.rating.defense)
        );
        const pickIndex = Math.floor(Math.random() * Math.min(3, freeAgents.length));
        hired = freeAgents[pickIndex];

        const coachIdx = updatedCoaches.findIndex(c => c.id === hired.id);
        if (coachIdx !== -1) {
            updatedCoaches[coachIdx] = {
                ...hired,
                teamId: team.id,
                contract: { salary: hired.contract.salary, yearsRemaining: 2 + Math.floor(Math.random() * 2) }
            };
            hired = updatedCoaches[coachIdx];
        }
    }

    const teamIdx = updatedTeams.findIndex(t => t.id === team.id);
    if (teamIdx !== -1) {
        updatedTeams[teamIdx] = {
            ...updatedTeams[teamIdx],
            coachId: hired.id,
            tactics: getTacticsForStyle(hired.style)
        };
    }

    console.log(`[CoachHire] ${team.name} hired ${hired.firstName} ${hired.lastName} (${hired.style})`);
    return { updatedCoaches, updatedTeams };
}
