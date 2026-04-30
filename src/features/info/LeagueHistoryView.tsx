import React, { useState } from 'react';
import { Trophy, Award, ChevronLeft } from 'lucide-react';
import { useGame } from '../../store/GameContext';

export const LeagueHistoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { awardsHistory, teams } = useGame();
    const [mode, setMode] = useState<'champions' | 'awards'>('champions');

    return (
        <div className="animate-fade" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={onBack} className="btn-modern" style={{ padding: '8px' }}>
                    <ChevronLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>League History</h1>
            </div>

            {/* Toggle Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'var(--bg-card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <button 
                    onClick={() => setMode('champions')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: mode === 'champions' ? 'var(--primary)' : 'transparent',
                        color: mode === 'champions' ? '#fff' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Trophy size={18} />
                    Past Champions
                </button>
                <button 
                    onClick={() => setMode('awards')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: mode === 'awards' ? 'var(--primary)' : 'transparent',
                        color: mode === 'awards' ? '#fff' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Award size={18} />
                    Season Awards
                </button>
            </div>

            <div className="modern-card">
                {mode === 'champions' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {awardsHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <Trophy size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                <p style={{ fontSize: '0.85rem' }}>No championship history yet.</p>
                            </div>
                        ) : (
                            awardsHistory.slice().reverse().map(award => {
                                const team = teams.find(t => t.id === award.championId);
                                return (
                                    <div key={award.year} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem', width: '60px' }}>{award.year}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {team?.logo ? (
                                                    <img src={team.logo} alt={team.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: team?.colors?.primary || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                                                        {team?.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{team?.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>NBA CHAMPIONS</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>FINALS MVP</div>
                                            <div style={{ fontWeight: 800 }}>{award.finalsMvp?.name || 'N/A'}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {awardsHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                                <Award size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                <p style={{ fontSize: '0.85rem' }}>No award history yet.</p>
                            </div>
                        ) : (
                            awardsHistory.slice().reverse().map(award => (
                                <div key={award.year} style={{ padding: '20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>SEASON {award.year}</span>
                                        <Award size={20} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                        <AwardItem label="MVP" winner={award.mvp?.playerName} />
                                        <AwardItem label="ROY" winner={award.roty?.playerName} />
                                        <AwardItem label="DPOY" winner={award.dpoy?.playerName} />
                                        <AwardItem label="MIP" winner={award.mip?.playerName} />
                                        <AwardItem label="COY" winner={award.coy?.playerName} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const AwardItem = ({ label, winner }: { label: string, winner?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{winner || '---'}</span>
    </div>
);
