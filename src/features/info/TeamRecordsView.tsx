import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { PageHeader } from '../ui/PageHeader';

export const TeamRecordsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { teams, userTeamId, teamRecords } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);
    
    const records = teamRecords && userTeamId ? (teamRecords[userTeamId] || []) : [];

    return (
        <div className="animate-fade" style={{ padding: '0', maxWidth: '500px', margin: '0 auto' }}>
            <PageHeader 
                title="Team Legends & Records" 
                subtitle="All-Time Franchise Milestones"
                onBack={onBack} 
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />
            <div style={{ padding: '20px' }}>

            <div className="modern-card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, #fff 100%)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: userTeam?.colors?.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800, flexShrink: 0 }}>
                        {userTeam?.name.charAt(0)}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', marginBottom: '4px' }}>{userTeam?.name} All-Time Records</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>The greatest single-game performances in franchise history.</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {records.length === 0 ? (
                    <div className="modern-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <Star size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                        <p style={{ fontSize: '0.85rem' }}>No franchise records set yet.</p>
                        <p style={{ fontSize: '0.7rem' }}>Statistical legends will appear here after standout games.</p>
                    </div>
                ) : (
                    records.map((rec, idx) => (
                        <div key={idx} className="modern-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', transition: 'transform 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', flexShrink: 0 }}>
                                <Star size={24} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{rec.category}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-main)' }}>{rec.year}</div>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0' }}>{rec.value}</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rec.playerName}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>vs {rec.opponentName}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* TEAM HISTORY SECTION */}
            <div className="modern-card" style={{ marginTop: '24px' }}>
                <div className="card-header" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
                        <h2 className="card-title">Franchise Milestones</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userTeam?.history && userTeam.history.length > 0 ? (
                        userTeam.history.slice().reverse().map((h, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontWeight: 800 }}>{h.year}</div>
                                <div style={{ fontSize: '0.85rem' }}>{h.wins}-{h.losses}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: h.playoffResult ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    {h.playoffResult || 'Missed Playoffs'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No franchise history yet.</p>
                    )}
                </div>
            </div>

            </div>
        </div>
    );
};
