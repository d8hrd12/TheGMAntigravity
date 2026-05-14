import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

interface MidSeasonProgressionModalProps {
    players: Player[];
    teams: Team[];
    onClose: () => void;
}

export const MidSeasonProgressionModal: React.FC<MidSeasonProgressionModalProps> = ({ players, teams, onClose }) => {
    // Get top 10 players by inSeasonProgress
    const topPlayers = React.useMemo(() => {
        return players
            .filter(p => p.inSeasonProgress && p.inSeasonProgress > 0)
            .sort((a, b) => (b.inSeasonProgress || 0) - (a.inSeasonProgress || 0))
            .slice(0, 10);
    }, [players]);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--bg-main)',
                padding: '30px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '85vh',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                color: 'var(--text-main)',
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid var(--text-main)', paddingBottom: '15px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>Mid-Season Breakouts</h2>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        The trade deadline has passed. Here are the top 10 players who have had breakout performances this season!
                    </p>
                </div>

                {topPlayers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                        No players had a significant breakout this season.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {topPlayers.map((p, idx) => {
                            const team = teams.find(t => t.id === p.teamId);
                            return (
                                <div key={p.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    background: 'var(--bg-card-hover)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--bg-card-hover)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ 
                                            width: '28px', 
                                            height: '28px', 
                                            borderRadius: '14px', 
                                            background: 'var(--text-main)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontWeight: 900,
                                            fontSize: '0.9rem'
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.firstName} {p.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                                                {team ? `${team.abbreviation} | ` : ''}{p.position} | {p.age} yrs
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ 
                                            color: '#2ecc71', 
                                            fontWeight: 900, 
                                            fontSize: '1.2rem',
                                            textShadow: '0 0 10px rgba(46, 204, 113, 0.3)'
                                        }}>
                                            ▲ +{p.inSeasonProgress} OVR
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                            Now {p.overall} OVR
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button 
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--text-main)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginTop: '25px',
                        transition: 'background 0.2s',
                        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
                    }}
                >
                    Continue Season
                </button>
            </div>
        </div>
    );
};
