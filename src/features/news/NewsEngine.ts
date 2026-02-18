import type { NewsStory } from '../../models/NewsStory';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { MatchResult } from '../simulation/SimulationTypes';

export const NewsEngine = {
    generateGameNews: (match: MatchResult, home: Team, away: Team, players: Player[]): NewsStory | null => {
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

        const isRivalry = home.rivalIds?.includes(away.id) || away.rivalIds?.includes(home.id);
        if (isRivalry) {
            const winner = match.winnerId === home.id ? home : away;
            const loser = match.winnerId === home.id ? away : home;
            return {
                id: crypto.randomUUID(),
                date: new Date(match.date),
                headline: `RIVALRY: ${winner.abbreviation} Best ${loser.abbreviation}`,
                content: `In a heated rivalry matchup, the ${winner.name} managed to outlast the ${loser.name}. Tensions were high at the final whistle.`,
                type: 'GAME',
                priority: 4,
                relatedTeamId: winner.id
            };
        }

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

        return null;
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

    generatePlayerStatement: (player: Player, team: Team, match: MatchResult, date: Date): NewsStory | null => {
        const isWin = match.winnerId === team.id;
        const stats = (isWin ? match.boxScore.homeStats : match.boxScore.awayStats)[player.id];
        if (!stats) return null;

        const isKey = player.overall > 80;
        const isHighPersonality = ['Diva', 'Enforcer', 'Loyalist', 'Silent Leader'].includes(player.personality);

        if (!isKey && !isHighPersonality) return null;
        if (Math.random() > 0.3) return null;

        let headline = "";
        let content = "";

        if (isWin) {
            if (player.personality === 'Diva') {
                headline = `${player.lastName}: "I'm the Engine"`;
                content = `After the win, ${player.lastName} told reporters: "We're a different team when I'm controlling the pace. I need those touches."`;
            } else if (player.personality === 'Loyalist') {
                headline = `${player.lastName} Praises Team Unity`;
                content = `"It's not about my stats," ${player.lastName} said. "It's about the badge on the front of the jersey. Great team win today."`;
            } else if (player.personality === 'Silent Leader') {
                headline = `${player.lastName} Focused on the Goal`;
                content = `In a rare post-game comment, ${player.lastName} noted: "One win doesn't mean anything. We have a lot of work to do if we want the title."`;
            } else {
                headline = `${player.lastName} on the Win`;
                content = `"Great bounce back for the guys. We played our system and it worked," said ${player.lastName} after the victory.`;
            }
        } else {
            if (player.personality === 'Diva') {
                headline = `${player.lastName} Frustrated by Usage`;
                content = `A visibly upset ${player.lastName} commented on the loss: "It's hard to win when the ball isn't in my hands in winning time."`;
            } else if (player.personality === 'Enforcer') {
                headline = `${player.lastName}: "We Were Soft"`;
                content = `${player.lastName} didn't hold back after the loss, saying the team lacked physicality and 'heart'.`;
            } else if (player.personality === 'Loyalist') {
                headline = `${player.lastName} Stays Positive`;
                content = `"We'll get it right," ${player.lastName} insisted. "The guys in this room have each other's backs."`;
            }
        }

        if (!headline) return null;

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline,
            content,
            type: 'PLAYER_TALK',
            priority: 3,
            relatedPlayerId: player.id,
            relatedTeamId: team.id
        };
    },

    generateDraftScouting: (draftClass: Player[], date: Date): NewsStory | null => {
        if (!draftClass || draftClass.length === 0) return null;

        const topProspects = [...draftClass].sort((a, b) => (b.potential || 0) - (a.potential || 0));
        const top = topProspects[0];

        const headlines = [
            { h: `Scouting Report: The Rise of ${top.lastName}`, c: `Scouts are calling ${top.firstName} ${top.lastName} a "generational talent" with a ceiling of ${top.potential}.` },
            { h: `The Draft Race Deepens`, c: `With ${top.lastName} leading the pack, teams are already looking at their lottery odds.` },
            { h: `${top.lastName} Comparison: The Next Superstar?`, c: `Long-time scouts compare prospect ${top.lastName} to some of the greatest to ever play.` }
        ];

        const pick = headlines[Math.floor(Math.random() * headlines.length)];

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: pick.h,
            content: pick.c,
            type: 'DRAFT',
            priority: 3,
            relatedPlayerId: top.id
        };
    },

    generateLeaguePulse: (teams: Team[], date: Date): NewsStory | null => {
        if (!teams || teams.length === 0) return null;

        const sorted = [...teams].sort((a, b) => b.wins - a.wins);
        const top = sorted[0];
        const bottom = sorted[sorted.length - 1];

        const storyPool = [
            { h: `League Pulse: ${top.abbreviation} Dominating`, c: `The ${top.name} continue to set the pace for the league, while the ${bottom.name} are struggling.` },
            { h: `Power Rankings Shift`, c: `After a wild week, the ${top.abbreviation} have climbed to the top of the league hierarchy.` }
        ];

        const pick = storyPool[Math.floor(Math.random() * storyPool.length)];

        return {
            id: crypto.randomUUID(),
            date: new Date(date),
            headline: pick.h,
            content: pick.c,
            type: 'GENERAL',
            priority: 4,
            relatedTeamId: top.id
        };
    },

    generateRumorNews: (players: Player[], teams: Team[], date: Date): NewsStory | null => {
        const unhappyStars = players.filter(p => (p.morale < 50) && (p.overall > 82));
        if (unhappyStars.length === 0) return null;

        const player = unhappyStars[Math.floor(Math.random() * unhappyStars.length)];
        const team = teams.find(t => t.id === player.teamId);
        if (!team) return null;

        const rumorPool = [
            { h: `Discord in ${team.city}?`, c: `Sources say ${player.lastName} is increasingly frustrated with the team's direction.` },
            { h: `${player.lastName} Comments Spark Controversy`, c: `${player.lastName} made a cryptic post appearing to criticize staff.` },
            { h: `Trade Request Incoming?`, c: `Rumors suggest ${player.firstName} ${player.lastName} may request a trade soon.` }
        ];

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

        // 1. Streak Stories
        teams.forEach(team => {
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
                    content: `The ${team.name} extend their winning streak to ${winStreak} games.`,
                    type: 'GENERAL',
                    priority: 3,
                    relatedTeamId: team.id
                });
            } else if (lossStreak >= 5 && lossStreak % 5 === 0) {
                stories.push({
                    id: crypto.randomUUID(),
                    date: new Date(date),
                    headline: `${team.city} Crisis: Lost ${lossStreak} in a Row`,
                    content: `Panic is setting in for the ${team.name} as they drop their ${lossStreak}th in a row.`,
                    type: 'GENERAL',
                    priority: 3,
                    relatedTeamId: team.id
                });
            }
        });

        // 2. Rookie Watch
        const rookies = players.filter(p => p.careerStats.length === 0 && p.seasonStats.gamesPlayed > 0);
        const topRookie = rookies.sort((a, b) => (b.seasonStats.points / b.seasonStats.gamesPlayed) - (a.seasonStats.points / a.seasonStats.gamesPlayed))[0];

        if (topRookie && Math.random() < 0.1) {
            stories.push({
                id: crypto.randomUUID(),
                date: new Date(date),
                headline: `Rookie Watch: ${topRookie.lastName} Impresses`,
                content: `${topRookie.firstName} ${topRookie.lastName} continues to lead the rookie class.`,
                type: 'GENERAL',
                priority: 2,
                relatedPlayerId: topRookie.id
            });
        }

        // 3. Draft Scouting (5% chance)
        if (Math.random() < 0.05) {
            const scouting = NewsEngine.generateDraftScouting(players.filter(p => !p.teamId), date);
            if (scouting) stories.push(scouting);
        }

        // 4. League Pulse (Mondays)
        if (date.getDay() === 1) {
            const pulse = NewsEngine.generateLeaguePulse(teams, date);
            if (pulse) stories.push(pulse);
        }

        return stories;
    }
};
