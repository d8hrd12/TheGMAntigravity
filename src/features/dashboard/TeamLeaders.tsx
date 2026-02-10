import React from 'react';
import { useGame } from '../../store/GameContext';
import { Trophy, User } from 'lucide-react';

export const TeamLeaders: React.FC = () => {
    const { players, userTeamId } = useGame();

    const teamPlayers = players.filter(p => p.teamId === userTeamId);

    // Helper to get stat per game
    const getStatPerGame = (player: any, category: 'points' | 'assists' | 'rebounds') => {
        const stats = player.seasonStats;
        if (!stats || !stats.gamesPlayed) return 0;
        return (stats[category] || 0) / stats.gamesPlayed;
    };

    // Helper to get top player for a category
    const getTopPlayer = (category: 'points' | 'assists' | 'rebounds') => {
        if (teamPlayers.length === 0) return null;
        return [...teamPlayers].sort((a, b) => getStatPerGame(b, category) - getStatPerGame(a, category))[0];
    };

    const topScorer = getTopPlayer('points');
    const topAssister = getTopPlayer('assists');
    const topRebounder = getTopPlayer('rebounds');

    const renderLeader = (title: string, player: typeof topScorer, stat: number, label: string) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: 'var(--surface-active)',
            borderRadius: '12px',
            border: '1px solid var(--border)'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid var(--border)'
            }}>
                {/* Placeholder for player face/avatar if available, else icon */}
                <User size={20} color="var(--text-secondary)" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>{title}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {player ? `${player.firstName.charAt(0)}. ${player.lastName}` : '-'}
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {stat.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{label}</div>
            </div>
        </div>
    );

    return (
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Trophy size={18} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>Team Leaders</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {renderLeader('Points', topScorer, topScorer ? getStatPerGame(topScorer, 'points') : 0, 'PPG')}
                {renderLeader('Assists', topAssister, topAssister ? getStatPerGame(topAssister, 'assists') : 0, 'APG')}
                {renderLeader('Rebounds', topRebounder, topRebounder ? getStatPerGame(topRebounder, 'rebounds') : 0, 'RPG')}
            </div>
        </div>
    );
};
