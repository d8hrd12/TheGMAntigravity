import React from 'react';
import type { Team } from '../../models/Team';
import { PageHeader } from '../ui/PageHeader';

interface TeamHistoryViewProps {
    team: Team;
    onBack: () => void;
}

export const TeamHistoryView: React.FC<TeamHistoryViewProps> = ({ team, onBack }) => {
    // Sort history by year descending (newest first)
    const history = [...(team.history || [])].sort((a, b) => b.year - a.year);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
            <PageHeader
                title={`${team.city} ${team.name} History`}
                onBack={onBack}
            />

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Season</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Record</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Win %</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', textAlign: 'right' }}>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No history recorded yet. Complete a season to see records.
                                </td>
                            </tr>
                        ) : (
                            history.map((h, index) => {
                                const totalGames = h.wins + h.losses;
                                const winPct = totalGames > 0 ? ((h.wins / totalGames) * 100).toFixed(1) : '0.0';

                                return (
                                    <tr key={h.year} style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{h.year} - {h.year + 1}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{h.wins}</span>
                                            <span style={{ margin: '0 5px', color: 'var(--text-secondary)' }}>-</span>
                                            <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{h.losses}</span>
                                        </td>
                                        <td style={{ padding: '15px 20px', color: '#ccc' }}>{winPct}%</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                            {h.playoffResult || '-'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
