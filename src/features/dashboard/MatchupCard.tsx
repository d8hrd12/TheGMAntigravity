import React from 'react';
import { useGame } from '../../store/GameContext';
import { formatDate } from '../../utils/dateUtils';
import { ensureColorVibrancy } from '../../utils/colorUtils';

export const MatchupCard: React.FC = () => {
    const { dailyMatchups, userTeamId, teams, date, seasonPhase } = useGame();

    if (seasonPhase !== 'regular_season') return null;

    const userMatchup = dailyMatchups.find(m => m.homeId === userTeamId || m.awayId === userTeamId);

    // Fallback if no matchup
    if (!userMatchup) {
        return (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', marginBottom: '20px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>No Game Today</div>
            </div>
        )
    }

    const isHome = userMatchup.homeId === userTeamId;
    const opponentId = isHome ? userMatchup.awayId : userMatchup.homeId;
    const opponent = teams.find(t => t.id === opponentId);
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!opponent || !userTeam) return null;

    // Helper for team section
    const renderTeamHalf = (team: any, title: string) => (
        <div style={{
            flex: 1,
            position: 'relative',
            background: '#ffffff', // Explicit white
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '140px',
            borderRight: title === 'HOME' ? '1px solid #eee' : 'none'
        }}>
            {/* Watermark Logo */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(2)', // Large 200% scale
                width: '100px',
                height: '100px',
                opacity: 0.1, // Faded
                backgroundImage: team.logo ? `url(${team.logo})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
                filter: 'grayscale(100%)', // Black/White watermark
                zIndex: 1
            }}>
                {!team.logo && (
                    <div style={{
                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '5em', fontWeight: 900, color: '#000000'
                    }}>
                        {team.abbreviation}
                    </div>
                )}
            </div>

            {/* Foreground Content */}
            <div style={{ zIndex: 10, textAlign: 'center', color: '#000000', padding: '0 10px' }}>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    marginBottom: '4px',
                    lineHeight: 1.1,
                    color: '#000000' // Explicit Black
                }}>
                    {team.name}
                </div>
                <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    opacity: 0.8,
                    color: '#000000' // Explicit Black
                }}>
                    {team.wins}-{team.losses}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 600, marginTop: '4px', color: '#000000' }}>
                    {title}
                </div>
            </div>
        </div>
    );

    return (
        <div className="glass-panel" style={{
            padding: '0',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '20px',
            border: '1px solid var(--border)',
            background: 'var(--surface-glass)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            {/* Optional Header - kept minimal or removed as per plan? 
                Plan said "Remove the 'Next Up' header". I'll follow that.
                But maybe I should keep the date somewhere?
                The original code had a header with date. 
                "Remove the 'Next Up' header". I will remove it entirely to get the clean duotone look.
            */}

            {/* Content Container - Split into two equal sides */}
            <div style={{ display: 'flex', height: '140px', position: 'relative' }}>

                {/* VS Badge - Absolute Center */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    background: 'black',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                    VS
                </div>

                {/* Left Side */}
                {renderTeamHalf(userTeam, isHome ? 'HOME' : 'AWAY')}

                {/* Right Side */}
                {renderTeamHalf(opponent, isHome ? 'AWAY' : 'HOME')}

            </div>
            {/* 
                If the user wants the date back, I can add a small footer or header.
                For now, "clean aesthetic" often implies minimal text.
                I'll leave it out as per "Remove the 'Next Up' header".
            */}
        </div>
    );
};
