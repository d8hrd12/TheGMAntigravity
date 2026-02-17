import React, { useMemo } from 'react';
import { useGame, type PlayoffSeries } from '../../../store/GameContext';
import { ArrowRight, Trophy, Calendar, Users, Activity, Play } from 'lucide-react';


interface PlayoffHeroProps {
    series: PlayoffSeries;
    onSimGame: () => void;
    onPlayGame: () => void;
    onViewGameplan: () => void;
    onViewRotation: () => void;
}

export const PlayoffHero: React.FC<PlayoffHeroProps> = ({ series, onSimGame, onPlayGame, onViewGameplan, onViewRotation }) => {
    const { teams, userTeamId } = useGame();

    const homeTeam = teams.find(t => t.id === series.homeTeamId);
    const awayTeam = teams.find(t => t.id === series.awayTeamId);

    if (!homeTeam || !awayTeam) return null;

    const userIsHome = userTeamId === homeTeam.id;
    const opponent = userIsHome ? awayTeam : homeTeam;

    const userWins = userIsHome ? series.homeWins : series.awayWins;
    const opponentWins = userIsHome ? series.awayWins : series.homeWins;

    const gameNumber = series.homeWins + series.awayWins + 1;
    const isHomeCourt = [0, 1, 4, 6].includes(gameNumber - 1) ? series.homeTeamId : series.awayTeamId;
    const userHasHomeCourt = isHomeCourt === userTeamId;

    // Series Status Text
    const statusText = useMemo(() => {
        if (userWins > opponentWins) return `Leading ${userWins}-${opponentWins}`;
        if (opponentWins > userWins) return `Trailing ${opponentWins}-${userWins}`;
        return `Tied ${userWins}-${userWins}`;
    }, [userWins, opponentWins]);

    const statusColor = useMemo(() => {
        if (userWins > opponentWins) return 'var(--success, #10B981)';
        if (opponentWins > userWins) return 'var(--danger, #EF4444)';
        return 'var(--text-secondary, #9CA3AF)';
    }, [userWins, opponentWins]);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.05))',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(var(--primary-rgb), 0.2)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                opacity: 0.05,
                transform: 'rotate(15deg)'
            }}>
                <Trophy size={150} color="var(--text)" />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <span style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 4px rgba(var(--primary-rgb), 0.3)'
                    }}>
                        {series.round === 4 ? 'NBA FINALS' : `ROUND ${series.round} • GAME ${gameNumber}`}
                    </span>
                </div>

                {/* Vertical Matchup Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>

                    {/* Top Team (Home usually, or separate?) Let's do Side by Side for teams still, but clearer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                        {/* User Team */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{userIsHome ? homeTeam.abbreviation : awayTeam.abbreviation}</div>
                        </div>

                        {/* Score */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: statusColor, lineHeight: 1 }}>
                                {userWins}-{opponentWins}
                            </div>
                        </div>

                        {/* Opponent */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                {userIsHome ? awayTeam.abbreviation : homeTeam.abbreviation}
                            </div>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        {userHasHomeCourt ? 'Home Game' : 'Away Game'} @ {userHasHomeCourt ? homeTeam.city : awayTeam.city}
                    </div>

                </div>

                {/* Primary Action: PLAY GAME */}
                <button
                    onClick={onPlayGame}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.4)',
                        background: 'var(--success, #10B981)', // Green for Play
                        border: 'none',
                        color: 'white'
                    }}
                >
                    <Play size={20} fill="currentColor" />
                    PLAY GAME {gameNumber}
                </button>

                {/* Secondary Actions Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                        onClick={onSimGame}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            padding: '12px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Activity size={16} />
                        Sim Day
                    </button>

                    <button
                        onClick={onViewRotation}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            padding: '12px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Users size={16} />
                        Rotation
                    </button>
                </div>

            </div>
        </div>
    );
};
