import React from 'react';
import { useGame } from '../../store/GameContext';
import { Trophy, TrendingUp } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface RecentGamesProps {
    onSelectGame: (game: any) => void;
}

export const RecentGames: React.FC<RecentGamesProps> = ({ onSelectGame }) => {
    const { games, userTeamId } = useGame();

    const teamGames = games
        .filter(g => g.homeScore !== undefined && (g.homeTeamId === userTeamId || g.awayTeamId === userTeamId))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const getFormCircle = (game: any) => {
        const isHome = game.homeTeamId === userTeamId;
        const win = isHome ? (game.homeScore > game.awayScore) : (game.awayScore > game.homeScore);
        return (
            <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: win ? '#10B981' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
            >
                {win ? 'W' : 'L'}
            </div>
        );
    };

    return (
        <DashboardCard variant="white" title="Recent Form" icon={<TrendingUp size={16} />} action={<span style={{ fontWeight: 700, opacity: 0.4, fontSize: '0.7rem' }}>View All</span>}>
            <div style={{ display: 'flex', gap: '10px', padding: '4px 0' }}>
                {teamGames.length > 0 ? (
                    teamGames.reverse().map(game => getFormCircle(game))
                ) : (
                    <div style={{ opacity: 0.3, fontSize: '0.8rem', fontStyle: 'italic' }}>No games played yet this season.</div>
                )}
            </div>
        </DashboardCard>
    );
};
