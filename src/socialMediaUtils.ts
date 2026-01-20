
import type { Player } from './models/Player';
import type { Team } from './models/Team';
import type { MatchResult } from './features/simulation/SimulationTypes';
import type { SocialMediaPost } from './models/SocialMediaPost';
import { generateUUID } from './utils/uuid';

const HANDLES = [
    { handle: '@NBA_Source', display: 'NBA Source', type: 'INSIDER', verified: true },
    { handle: '@HoopsJunkie', display: 'Hoops Junkie', type: 'ANALYST', verified: false },
    { handle: '@DunksDaily', display: 'Dunks Daily', type: 'FAN', verified: false },
    { handle: '@BallerAlert', display: 'Baller Alert', type: 'INSIDER', verified: true },
    { handle: '@PureHoops', display: 'Pure Hoops', type: 'ANALYST', verified: true },
    { handle: '@StatMuse_Fake', display: 'Stat Muse (Parody)', type: 'FAN', verified: false },
];

export function generateDailyPosts(games: MatchResult[], teams: Team[], players: Player[]): SocialMediaPost[] {
    const posts: SocialMediaPost[] = [];

    games.forEach(game => {
        const homeTeam = teams.find(t => t.id === game.homeTeamId);
        const awayTeam = teams.find(t => t.id === game.awayTeamId);
        if (!homeTeam || !awayTeam) return;

        const winner = game.homeScore > game.awayScore ? homeTeam : awayTeam;
        const loser = game.homeScore > game.awayScore ? awayTeam : homeTeam;
        const diff = Math.abs(game.homeScore - game.awayScore);

        // Randomly pick a handle
        const source = HANDLES[Math.floor(Math.random() * HANDLES.length)];

        if (diff > 20) {
            posts.push(createPost(source, `${winner.name} absolutely dismantled ${loser.name} tonight. Total mismatch. #NBATwitter`, winner.id));
        } else if (diff < 5) {
            posts.push(createPost(source, `What a finish between ${homeTeam.name} and ${awayTeam.name}! This is why we watch. #Clutch`, winner.id));
        } else {
            posts.push(createPost(source, `Solid win for ${winner.name} against ${loser.name}. They're looking focused.`, winner.id));
        }

        // Star player shoutout
        const allStats = [...Object.values(game.boxScore.homeStats), ...Object.values(game.boxScore.awayStats)];
        const topScorer = allStats.sort((a, b) => b.points - a.points)[0];
        if (topScorer && topScorer.points > 30) {
            const player = players.find(p => p.id === topScorer.playerId);
            if (player) {
                posts.push(createPost(
                    HANDLES[Math.floor(Math.random() * HANDLES.length)],
                    `${player.firstName} ${player.lastName} put on a CLINIC tonight. ${topScorer.points} points?! Unstoppable. 🔥`,
                    player.teamId || undefined,
                    player.id
                ));
            }
        }
    });

    return posts;
}

function createPost(source: any, content: string, teamId?: string, playerId?: string): SocialMediaPost {
    return {
        id: generateUUID(),
        handle: source.handle,
        displayName: source.display,
        content,
        likes: Math.floor(Math.random() * 5000),
        retweets: Math.floor(Math.random() * 1000),
        timestamp: new Date(),
        isVerified: source.verified,
        type: source.type,
        relatedTeamId: teamId,
        relatedPlayerId: playerId
    };
}
