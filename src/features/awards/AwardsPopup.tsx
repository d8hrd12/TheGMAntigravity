import React from 'react';
import type { SeasonAwards, AwardWinner } from '../../models/Awards';

interface AwardsPopupProps {
    awards: SeasonAwards;
    onClose: () => void;
}

export const AwardsPopup: React.FC<AwardsPopupProps> = ({ awards, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            backdropFilter: 'blur(8px)'
        }}>
            <div className="glass-panel" style={{
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '25px',
                borderRadius: '20px',
                position: 'relative',
                border: '1px solid var(--primary)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ textAlign: 'center', marginBottom: '5px', fontSize: '1.8rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {awards.year} Season Awards
                </h2>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                    {awards.champion ? (
                        <>
                            <div style={{ fontSize: '1.2rem', color: '#f1c40f', fontWeight: 'bold' }}>CHAMPIONS!</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '10px 0' }}>
                                {awards.champion.teamName}
                            </div>
                        </>
                    ) : (
                        "The regular season has concluded!"
                    )}
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {awards.champion && awards.finalsMvp && (
                        <AwardCard title="Finals MVP" winner={awards.finalsMvp} icon="🏆" highlight />
                    )}
                    <AwardCard title="League MVP" winner={awards.mvp} icon="👑" highlight={!awards.champion} />
                    <AwardCard title="Rookie of the Year" winner={awards.roty} icon="👶" />
                    <AwardCard title="Defensive Player of the Year" winner={awards.dpoy} icon="🛡️" />
                    <AwardCard title="Most Improved Player" winner={awards.mip} icon="📈" />
                </div>

                <button
                    onClick={onClose}
                    className="glass-panel"
                    style={{
                        width: '100%',
                        marginTop: '30px',
                        padding: '15px',
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {awards.champion ? "Proceed to Draft" : "Proceed to Playoffs"}
                </button>
            </div>
        </div>
    );
};

const AwardCard = ({ title, winner, icon, highlight = false }: { title: string, winner: AwardWinner, icon: string, highlight?: boolean }) => {
    if (winner.playerId === 'err') return null;

    return (
        <div style={{
            background: highlight ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
            padding: '15px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            border: highlight ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ fontSize: '2rem' }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    {title}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>
                    {winner.playerName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{winner.teamName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{winner.statsSummary}</span>
                </div>
            </div>
        </div>
    );
};
