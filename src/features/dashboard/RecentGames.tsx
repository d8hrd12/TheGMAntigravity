import React from 'react';
import { useGame } from '../../store/GameContext';
import { Trophy, TrendingUp } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface RecentGamesProps {
    onSelectGame: (game: any) => void;
    conferencePosition?: string;
}

export const RecentGames: React.FC<RecentGamesProps> = ({ onSelectGame, conferencePosition }) => {
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: win ? 'var(--accent)' : 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                {win ? 'W' : 'L'}
            </div>
        );
    };

    return (
        <DashboardCard 
            variant="primary" 
            title="Recent Form" 
            icon={<TrendingUp size={16} />} 
            action={<button className="btn-modern" style={{ width: 'auto', padding: '4px 10px', fontSize: '0.6rem' }}>View All</button>}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {teamGames.length > 0 ? (
                        teamGames.reverse().map(game => getFormCircle(game))
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>No games played yet.</div>
                    )}
                </div>

                {conferencePosition && (
                    <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                            {conferencePosition.replace(/[^0-9]/g, '')}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{conferencePosition.replace(/[0-9]/g, '')}</span>
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rank</div>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};
