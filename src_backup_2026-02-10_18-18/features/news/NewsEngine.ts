import type { NewsStory } from '../../models/NewsStory';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { MatchResult } from '../simulation/SimulationTypes';
import type { TradeProposal } from '../../models/TradeProposal';

export const NewsEngine = {
    generateGameNews: (match: MatchResult, home: Team, away: Team, players: Player[]): NewsStory | null => {
        // 1. High Scoring Performance (50+ points)
        const allStats = [...Object.values(match.boxScore.homeStats), ...Object.values(match.boxScore.awayStats)] as any[];
        const bigPerformance = allStats.find(s => s.points >= 50);

        if (bigPerformance) {
            const player = players.find(p => p.id === bigPerformance.playerId);
            if (player) {
                return {
                    id: crypto.randomUUID(),
                    date: new Date(match.date),
                    headline: `${player.lastName} Drops ${bigPerformance.points}!`,
                    content: `${player.firstName} ${player.lastName} exploded for ${bigPerformance.points} points in a game between ${home.abbreviation} and ${away.abbreviation}.`,
                    type: 'GAME',
                    priority: 5,
                    relatedPlayerId: player.id,
                    relatedTeamId: player.teamId || undefined
                };
            }
        }

        // 2. Upset
        const scoreDiff = Math.abs((match.boxScore as any).homeScore - (match.boxScore as any).awayScore);
        if (scoreDiff >= 40) {
            const winner = match.winnerId === home.id ? home : away;
            const loser = match.winnerId === home.id ? away : home;
            return {
                id: crypto.randomUUID(),
                date: new Date(match.date),
                headline: `${winner.city} DESTROYS ${loser.city}`,
                content: `It was a massacre as the ${winner.name} defeated the ${loser.name} by ${scoreDiff} points!`,
                type: 'GAME',
                priority: 3,
                relatedTeamId: winner.id
            };
        }

        // 3. Buzzer Beater / Close Game
        if (scoreDiff <= 2) {
            const winner = match.winnerId === home.id ? home : away;
            return {
                id: crypto.randomUUID(),
                date: new Date(match.date),
                headline: `${winner.abbreviation} Wins Thriller!`,
                content: `The game between ${home.abbreviation} and ${away.abbreviation} went down to the wire, decided by just ${scoreDiff} points.`,
                type: 'GAME',
                priority: 2,
                relatedTeamId: winner.id
            };
        }

        return null; // No news worthy event
    },

    generateInjuryNews: (player: Player, team: Team, injuryName: string, duration: number, date: Date): NewsStory => {
        const isStar = (player.overall || 0) > 85;
        const priority = isStar ? 5 : duration > 30 ? 4 : 2;

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: `${player.lastName} Out ${duration} Days`,
            content: `${team.city} ${team.name} star ${player.firstName} ${player.lastName} has suffered a ${injuryName} and is expected to miss ${duration} days.`,
            type: 'INJURY',
            priority,
            relatedPlayerId: player.id,
            relatedTeamId: team.id
        };
    },

    generateTradeNews: (team1Id: string, team2Id: string, teams: Team[], date: Date): NewsStory => {
        const team1 = teams.find(t => t.id === team1Id);
        const team2 = teams.find(t => t.id === team2Id);

        if (!team1 || !team2) return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: "Trade Completed",
            content: "A trade has been finalized.",
            type: 'TRADE',
            priority: 3
        };

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: `BLOCKBUSTER: ${team1.abbreviation} & ${team2.abbreviation} Swap`,
            content: `${team1.city} and ${team2.city} have agreed to a trade involving multiple assets.`,
            type: 'TRADE',
            priority: 5,
            relatedTeamId: team1.id
        };
    },

    generateRumorNews: (players: Player[], teams: Team[], date: Date): NewsStory | null => {
        // Find unhappy stars
        // Unhappy = Morale < 50
        // Star = Overall > 82
        const unhappyStars = players.filter(p => (p.morale < 50) && (p.overall > 82));

        if (unhappyStars.length === 0) return null;

        // Pick one randomly
        const player = unhappyStars[Math.floor(Math.random() * unhappyStars.length)];
        const team = teams.find(t => t.id === player.teamId);

        if (!team) return null;

        const rumorPool = [
            { h: `Discord in ${team.city}?`, c: `Sources say ${player.lastName} is increasingly frustrated with the team's direction.` },
            { h: `${player.lastName} Comments Spark Controversy`, c: `${player.lastName} made a cryptic post on social media appearing to criticize the coaching staff.` },
            { h: `Trade Request Incoming?`, c: `Rumors are swirling that ${player.firstName} ${player.lastName} may request a trade out of ${team.city} soon.` }
        ];

        // Personality Flavor
        if (player.personality === 'Diva') {
            rumorPool.push({ h: `${player.lastName} Wants More Touches`, c: `The high-scoring star is reportedly unhappy with his role in the offense.` });
            rumorPool.push({ h: `Locker Room Friction?`, c: `Rumors suggest ${player.lastName} and technical staff aren't seeing eye-to-eye after recent losses.` });
        } else if (player.personality === 'Loyalist') {
            rumorPool.push({ h: `${player.lastName} Urges Unity`, c: `Despite the slump, ${player.lastName} is telling teammates to stay the course.` });
        } else if (player.personality === 'Mercenary') {
            rumorPool.push({ h: `${player.lastName} Focused on Business`, c: `When asked about the team's struggles, ${player.lastName} noted he is simply fulfilling his contract.` });
        } else if (player.personality === 'Workhorse') {
            rumorPool.push({ h: `${player.lastName} Putting in Extra Hours`, c: `Spotted at the facility at 2 AM, ${player.lastName} is trying to lead by example.` });
        }

        const rumor = rumorPool[Math.floor(Math.random() * rumorPool.length)];

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: rumor.h,
            content: rumor.c,
            type: 'RUMOR',
            priority: 4,
            relatedPlayerId: player.id,
            relatedTeamId: team.id
        };
    },

    generateDailyStories: (teams: Team[], players: Player[], games: MatchResult[], date: Date): NewsStory[] => {
        const stories: NewsStory[] = [];

        // 1. Streak Stories (3+ Games)
        teams.forEach(team => {
            // Calculate current streak
            // We need game history for this team, sorted by date desc
            const teamGames = games
                .filter(g => g.homeTeamId === team.id || g.awayTeamId === team.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            if (teamGames.length < 3) return;

            let winStreak = 0;
            let lossStreak = 0;

            for (const game of teamGames) {
                const isWin = game.winnerId === team.id;
                if (isWin) {
                    if (lossStreak > 0) break;
                    winStreak++;
                } else {
                    if (winStreak > 0) break;
                    lossStreak++;
                }
            }

            if (winStreak >= 5 && winStreak % 5 === 0) {
                stories.push({
                    id: crypto.randomUUID(),
                    date: new Date(date),
                    headline: `${team.city} on Fire! Won ${winStreak} Straight`,
                    content: `The ${team.name} are the hottest team in the league right now, extending their winning streak to ${winStreak} games.`,
                    type: 'GENERAL',
                    priority: 3,
                    relatedTeamId: team.id
                });
            } else if (lossStreak >= 5 && lossStreak % 5 === 0) {
                stories.push({
                    id: crypto.randomUUID(),
                    date: new Date(date),
                    headline: `${team.city} Crisis: Lost ${lossStreak} in a Row`,
                    content: `Panic is setting in for the ${team.name} as they drop their ${lossStreak}th consecutive game.`,
                    type: 'GENERAL',
                    priority: 3,
                    relatedTeamId: team.id
                });
            }
        });

        // 2. Rookie Watch
        const rookies = players.filter(p => p.careerStats.length === 0 && p.seasonStats.gamesPlayed > 0);
        const topRookie = rookies.sort((a, b) => (b.seasonStats.points / b.seasonStats.gamesPlayed) - (a.seasonStats.points / a.seasonStats.gamesPlayed))[0];

        if (topRookie && Math.random() < 0.1) { // 10% chance per day to talk about top rookie
            stories.push({
                id: crypto.randomUUID(),
                date: new Date(date),
                headline: `Rookie Watch: ${topRookie.lastName} Impresses`,
                content: `${topRookie.firstName} ${topRookie.lastName} continues to lead the rookie class, averaging ${(topRookie.seasonStats.points / topRookie.seasonStats.gamesPlayed).toFixed(1)} PPG.`,
                type: 'GENERAL',
                priority: 2,
                relatedPlayerId: topRookie.id
            });
        }

        // 3. Rivalry Hype (Next Day's Games)
        // Note: We need dailyMatchups or schedule to know who plays next.
        // Assuming simple random checks or looking at schedule passed in isn't easy here without passing schedule.
        // We will skip pre-game hype for now or rely on GameContext to call this with 'tomorrow' games if needed.
        // Let's settle for "Power Ranking" hype occasionally.

        if (Math.random() < 0.05) { // Occasional Power Ranking mention
            const topTeam = teams.sort((a, b) => (b.wins / (b.wins + b.losses || 1)) - (a.wins / (a.wins + a.losses || 1)))[0];
            if (topTeam) {
                stories.push({
                    id: crypto.randomUUID(),
                    date: new Date(date),
                    headline: `League Leaders: ${topTeam.city} Dominating`,
                    content: `The ${topTeam.name} sit atop the standings with a record of ${topTeam.wins}-${topTeam.losses}. Are they the favorites to win it all?`,
                    type: 'GENERAL',
                    priority: 2,
                    relatedTeamId: topTeam.id
                });
            }
        }

        return stories;
    }
};
