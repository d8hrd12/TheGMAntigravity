import React from 'react';
import { LayoutDashboard, Play, Trophy } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { formatDate } from '../../utils/dateUtils';
import { ensureColorVibrancy, lightenColor } from '../../utils/colorUtils';

interface HeroSectionProps {
    onEnterPlayoffs: () => void;
    onStartSeasonTrigger: () => void;
    onStartTrainingTrigger: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    onEnterPlayoffs,
    onStartSeasonTrigger,
    onStartTrainingTrigger
}) => {
    const {
        teams,
        userTeamId,
        date,
        seasonPhase,
        dailyMatchups,
        advanceDay,
        startLiveGameFn,
        triggerDraft
    } = useGame();

    const userTeam = teams.find(t => t.id === userTeamId);
    if (!userTeam) return null;

    const userMatchup = dailyMatchups.find(m => m.homeId === userTeamId || m.awayId === userTeamId);
    const opponentId = userMatchup ? (userMatchup.homeId === userTeamId ? userMatchup.awayId : userMatchup.homeId) : null;
    const opponent = teams.find(t => t.id === opponentId);

    return (
        <div style={{
            background: 'var(--surface-glass)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                background: ensureColorVibrancy(userTeam.colors?.primary || '#FF5F1F'),
                filter: 'blur(100px)',
                opacity: 0.15,
                borderRadius: '50%',
                zIndex: 0
            }} />

            {/* Team Background Logo */}
            <img
                src={userTeam.logo || `https://a.espncdn.com/i/teamlogos/nba/500/${userTeam.abbreviation === 'UTA' ? 'utah' :
                    userTeam.abbreviation === 'NOP' ? 'no' :
                        userTeam.abbreviation.toLowerCase()
                    }.png`}
                alt=""
                style={{
                    position: 'absolute',
                    right: '-5%',
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-10deg)',
                    height: '300px',
                    width: '350px',
                    objectFit: 'contain',
                    opacity: 0.35,
                    zIndex: 0,
                    userSelect: 'none',
                    pointerEvents: 'none'
                }}
                onError={(e) => {
                    e.currentTarget.style.display = 'none'; // Fallback to nothing if fails
                }}
            />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                <div style={{ marginTop: '30px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                        {seasonPhase.replace('_', ' ')} • {formatDate(date)}
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2.8rem',
                        lineHeight: '1.1',
                        letterSpacing: '-1.5px',
                        background: `linear-gradient(135deg, ${lightenColor(ensureColorVibrancy(userTeam.colors?.primary || '#000000'), 40)}, #ffffff)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.2))'
                    }}>
                        {userTeam.city}<br />{userTeam.name}
                    </h1>
                </div>

                <div style={{
                    textAlign: 'right',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ fontWeight: 800, lineHeight: 1, color: 'var(--text)', whiteSpace: 'nowrap', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        {userTeam.wins}-{userTeam.losses}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {userTeam.wins > userTeam.losses ? 'Winning Record' : 'Rebuilding'}
                    </div>
                </div>
            </div>

            {/* Primary Action Button - Context Aware */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', position: 'relative', zIndex: 2 }}>
                {seasonPhase === 'regular_season' && (
                    <>
                        <button
                            onClick={() => advanceDay()}
                            className="btn-primary"
                            style={{
                                flex: 1,
                                padding: '16px',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: `linear-gradient(135deg, ${ensureColorVibrancy(userTeam.colors?.primary || '#3498db')}, ${ensureColorVibrancy(userTeam.colors?.secondary || '#3498db')})`,
                                boxShadow: `0 8px 20px -4px ${ensureColorVibrancy(userTeam.colors?.primary || '#3498db')}80`
                            }}
                        >
                            <LayoutDashboard size={20} />
                            Simulate Day
                        </button>
                        <button
                            onClick={() => startLiveGameFn('next')}
                            style={{
                                flex: 1,
                                padding: '16px',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px -4px rgba(230, 126, 34, 0.5)'
                            }}
                        >
                            <Play size={20} /> {opponent ? `Play vs ${opponent.abbreviation}` : 'Play Next'}
                        </button>

                    </>
                )}
                {String(seasonPhase).startsWith('playoffs') && (
                    <button
                        onClick={onEnterPlayoffs}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            padding: '16px',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #f1c40f, #e67e22)',
                            color: '#000'
                        }}
                    >
                        <Trophy size={20} />
                        Enter Playoffs
                    </button>
                )}
                {seasonPhase === 'offseason' && (
                    <button
                        onClick={triggerDraft}
                        className="btn-primary"
                        style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}>
                        Start Draft
                    </button>
                )}
                {seasonPhase === 'pre_season' && (
                    <>
                        <button
                            onClick={onStartTrainingTrigger}
                            className="btn-primary"
                            style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: '#e67e22' }}
                        >
                            Training Camp
                        </button>
                        <button
                            onClick={() => onStartSeasonTrigger()}
                            className="btn-primary"
                            style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: '#27ae60' }}>
                            Start Regular Season
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
