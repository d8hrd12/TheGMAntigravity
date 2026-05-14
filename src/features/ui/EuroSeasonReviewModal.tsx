import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Star, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../store/GameContext';

interface EuroSeasonReviewModalProps {
    review: {
        euroLeagueWinner: string;
        euroCupWinner: string;
        promoted: string;
        relegated: string;
    };
    onClose: () => void;
}

export const EuroSeasonReviewModal: React.FC<EuroSeasonReviewModalProps> = ({ review, onClose }) => {
    const { teams } = useGame();

    const findTeamLogo = (teamName: string) => {
        return teams.find(t => t.name === teamName)?.logo;
    };

    const TeamDisplay = ({ label, teamName, icon, primaryColor }: { label: string, teamName: string, icon: React.ReactNode, primaryColor: string }) => {
        const logo = findTeamLogo(teamName);
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '24px',
                border: `1px solid ${primaryColor}44`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                flex: 1,
                minWidth: '200px',
                boxShadow: `0 10px 30px ${primaryColor}11`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: primaryColor
                }}>
                    {icon}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {label}
                </div>
                {logo ? (
                    <img src={logo} alt={teamName} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }} />
                ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>
                        {teamName.charAt(0)}
                    </div>
                )}
                <div style={{ fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', color: 'var(--text-main)' }}>{teamName.toUpperCase()}</div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)',
            zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '100%', maxWidth: '800px', background: 'var(--bg-card)',
                borderRadius: '32px', border: '1px solid var(--border-color)',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)', overflow: 'hidden',
                animation: 'reviewFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header Decoration */}
                <div style={{ height: '6px', background: 'linear-gradient(90deg, #f1c40f, #e67e22, #f39c12)' }} />
                
                <div style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(241, 196, 15, 0.1)', padding: '10px 24px', borderRadius: '40px', color: '#f1c40f', marginBottom: '16px' }}>
                            <Trophy size={20} />
                            <span style={{ fontWeight: 900, letterSpacing: '1px', fontSize: '0.8rem' }}>EUROPEAN FINALS REVIEW</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>Season Champions</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
                        <TeamDisplay 
                            label="EuroLeague Champion" 
                            teamName={review.euroLeagueWinner} 
                            icon={<Trophy size={100} />} 
                            primaryColor="#f1c40f" 
                        />
                        <TeamDisplay 
                            label="EuroCup Champion" 
                            teamName={review.euroCupWinner} 
                            icon={<Star size={100} />} 
                            primaryColor="#3498db" 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                        <div style={{ flex: 1, background: 'rgba(46, 204, 113, 0.05)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(46, 204, 113, 0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#2ecc71', textTransform: 'uppercase', letterSpacing: '1px' }}>Promoted to EuroLeague</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{review.promoted}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, background: 'rgba(231, 76, 60, 0.05)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(231, 76, 60, 0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(231, 76, 60, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c' }}>
                                <TrendingDown size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '1px' }}>Relegated to EuroCup</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{review.relegated}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%', padding: '20px', borderRadius: '18px',
                            background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none',
                            fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <CheckCircle2 size={24} />
                        CONTINUE TO OFFSEASON
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes reviewFadeIn {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};
