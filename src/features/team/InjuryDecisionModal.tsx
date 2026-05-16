import React from 'react';
import type { Player } from '../../models/Player';
import { ShieldAlert, Activity, UserCog, Bot } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { optimizeRotation } from '../../utils/rotationUtils';

interface InjuryDecisionModalProps {
    player: Player;
    type: 'injury' | 'recovery';
    onClose: () => void;
}

export const InjuryDecisionModal: React.FC<InjuryDecisionModalProps> = ({ player, type, onClose }) => {
    const { teams, updateRotation, players, leagueType, setView } = useGame();
    const team = teams.find(t => t.id === player.teamId);

    const handleAutoOptimize = () => {
        // Trigger AI optimization for user team
        const userPlayers = players.filter(p => p.teamId === player.teamId);
        const targetMins = leagueType === 'EURO' ? 200 : 240;
        
        // We call the same logic as AI teams but for user team
        const healthyPlayers = userPlayers.filter(p => !p.injury);
        
        if (healthyPlayers.length >= 5) {
            const strategy = team?.rotationStrategy || (leagueType === 'EURO' ? 'Standard' : 'Heavy Starters');
            const optimized = optimizeRotation(healthyPlayers, strategy as any, targetMins);
            
            const updates = optimized.map((p: any) => ({
                id: p.id,
                minutes: p.minutes,
                isStarter: p.isStarter,
                rotationIndex: p.rotationIndex
            }));

            // Add injured players with 0 mins
            userPlayers.filter(p => p.injury).forEach(p => {
                updates.push({ id: p.id, minutes: 0, isStarter: false, rotationIndex: 999 });
            });

            updateRotation(updates);
        }
        onClose();
    };

    const handleManualAdjust = () => {
        setView('team_roster');
        onClose();
    };

    const severityColor = player.injury?.severity === 'High' ? '#e74c3c' : player.injury?.severity === 'Medium' ? '#f1c40f' : '#3498db';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 30000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                width: '100%',
                maxWidth: '450px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Header */}
                <div style={{ 
                    padding: '30px 30px 20px 30px', 
                    textAlign: 'center',
                    background: type === 'injury' ? `linear-gradient(180deg, ${severityColor}15 0%, transparent 100%)` : 'linear-gradient(180deg, #2ecc7115 0%, transparent 100%)'
                }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '20px',
                        background: type === 'injury' ? `${severityColor}20` : '#2ecc7120',
                        color: type === 'injury' ? severityColor : '#2ecc71',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px auto'
                    }}>
                        {type === 'injury' ? <ShieldAlert size={32} /> : <Activity size={32} />}
                    </div>
                    
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                        {type === 'injury' ? 'Injury Timeout' : 'Player Recovered'}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>
                        {type === 'injury' 
                            ? `${player.firstName} ${player.lastName} has sustained an injury and is unavailable.`
                            : `${player.firstName} ${player.lastName} has fully recovered and is ready to play.`
                        }
                    </p>
                </div>

                {/* Details */}
                <div style={{ padding: '0 30px 30px 30px' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        padding: '20px',
                        marginBottom: '30px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Player</span>
                            <span style={{ fontWeight: 700 }}>{player.firstName} {player.lastName}</span>
                        </div>
                        {type === 'injury' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Injury</span>
                                    <span style={{ fontWeight: 700, color: severityColor }}>{player.injury?.type}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Recovery Time</span>
                                    <span style={{ fontWeight: 700 }}>
                                        {player.injury?.gamesRemaining !== undefined 
                                            ? `${player.injury.gamesRemaining} Games` 
                                            : `~${Math.ceil((new Date(player.injury!.returnDate).getTime() - new Date().getTime()) / 86400000)} Days`
                                        }
                                    </span>
                                </div>
                            </>
                        )}
                        {type === 'recovery' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Status</span>
                                <span style={{ fontWeight: 700, color: '#2ecc71' }}>Fully Cleared</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button 
                            onClick={handleManualAdjust}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: 'var(--text-main)',
                                color: 'var(--bg-app)',
                                border: 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <UserCog size={18} />
                            Manual Rotation Adjust
                        </button>
                        
                        <button 
                            onClick={handleAutoOptimize}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: 'transparent',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <Bot size={18} />
                            Let Assistant Optimize
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};
