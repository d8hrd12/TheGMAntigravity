import React, { useMemo, useState } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateDaysBetween } from '../../utils/dateUtils';
import { Activity, ShieldAlert, HeartPulse } from 'lucide-react';

export const InjuryReportView: React.FC = () => {
    const { players, teams, userTeamId, date } = useGame();
    const [filter, setFilter] = useState<'all' | 'my_team'>('all');

    const injuredPlayers = useMemo(() => {
        return players.filter(p => p.injury).sort((a, b) => {
            // Sort by return date (soonest first)
            return new Date(a.injury!.returnDate).getTime() - new Date(b.injury!.returnDate).getTime();
        });
    }, [players]);

    const filteredPlayers = filter === 'my_team'
        ? injuredPlayers.filter(p => p.teamId === userTeamId)
        : injuredPlayers;

    const formatDate = (d: Date) => {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            {/* Header / Filter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity color="#e74c3c" /> Injury Report
                </h2>
                <div style={{ display: 'flex', background: 'var(--surface)', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            padding: '6px 12px',
                            background: filter === 'all' ? 'var(--primary)' : 'transparent',
                            color: filter === 'all' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}
                    >
                        League
                    </button>
                    <button
                        onClick={() => setFilter('my_team')}
                        style={{
                            padding: '6px 12px',
                            background: filter === 'my_team' ? 'var(--primary)' : 'transparent',
                            color: filter === 'my_team' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}
                    >
                        My Team
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredPlayers.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <HeartPulse size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <div>No active injuries reported.</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredPlayers.map(player => {
                            const team = teams.find(t => t.id === player.teamId);
                            const daysLeft = calculateDaysBetween(date, player.injury!.returnDate);
                            const severityColor = player.injury!.severity === 'High' ? '#e74c3c' : player.injury!.severity === 'Medium' ? '#f1c40f' : '#3498db';

                            return (
                                <div key={player.id} style={{
                                    background: 'var(--surface)',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        {/* Severity Icon */}
                                        <div style={{
                                            width: '40px', height: '40px',
                                            borderRadius: '8px',
                                            background: `${severityColor}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: severityColor
                                        }}>
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{player.firstName} {player.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {team ? team.name : 'Free Agent'} • {player.position}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{player.injury!.type}</div>
                                        <div style={{ fontSize: '0.8rem', color: severityColor, fontWeight: 500 }}>
                                            Return: {formatDate(player.injury!.returnDate)} ({daysLeft} days)
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
