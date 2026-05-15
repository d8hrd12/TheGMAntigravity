import React, { useState, useMemo } from 'react';
import type { Team } from '../../models/Team';
import { PageHeader } from '../ui/PageHeader';
import { useGame } from '../../store/GameContext';
import type { Player } from '../../models/Player';
import type { RetiredPlayer } from '../../store/GameContext';

interface TeamHistoryViewProps {
    team: Team;
    onBack: () => void;
    onSelectPlayer?: (id: string) => void;
}

export const TeamHistoryView: React.FC<TeamHistoryViewProps> = ({ team, onBack, onSelectPlayer }) => {
    const { awardsHistory } = useGame();

    const history = [...(team.history || [])].sort((a, b) => b.year - a.year);

    // Count rings for this team
    const rings = awardsHistory.filter(h => h.champion?.teamId === team.id).length;

    return (
        <div style={{ padding: '0 0 calc(40px + env(safe-area-inset-bottom)) 0', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)' }}>
            <PageHeader 
                title={`${team.name} History`} 
                subtitle="Historical Career Records"
                onBack={onBack} 
                teamColor={team.colors?.primary}
            />
            <div style={{ padding: '20px' }}>

            {/* Team Summary Banner */}
            <div style={{
                display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
            }}>
                <div className="modern-card" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{rings}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>🏆 Championships</div>
                </div>
                <div className="modern-card" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{history.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Seasons</div>
                </div>
                <div className="modern-card" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>
                        {history.reduce((a, h) => a + h.wins, 0)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>All-Time Wins</div>
                </div>
            </div>

            {/* SEASONS TABLE */}
            <div className="modern-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Season</th>
                            <th style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Record</th>
                            <th style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Win %</th>
                            <th style={{ padding: '12px 20px', color: 'var(--text-muted)', textAlign: 'right' }}>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No history recorded yet. Complete a season to see records.
                                </td>
                            </tr>
                        ) : (
                            history.map((h, index) => {
                                const totalGames = h.wins + h.losses;
                                const winPct = totalGames > 0 ? ((h.wins / totalGames) * 100).toFixed(1) : '0.0';
                                const isChamp = awardsHistory.some(aw => aw.year === h.year && aw.champion?.teamId === team.id);
                                return (
                                    <tr key={h.year} style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        background: isChamp ? 'var(--warning-glow)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '12px 20px', fontWeight: 'bold' }}>
                                            {h.year}
                                            {isChamp && <span style={{ marginLeft: '8px' }}>🏆</span>}
                                        </td>
                                        <td style={{ padding: '12px 20px' }}>
                                            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{h.wins}</span>
                                            <span style={{ margin: '0 5px', color: 'var(--text-muted)' }}>-</span>
                                            <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{h.losses}</span>
                                        </td>
                                        <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>{winPct}%</td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right', color: h.playoffResult ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: h.playoffResult ? 700 : 400 }}>
                                            {h.playoffResult || 'Missed Playoffs'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            </div>
        </div>
    );
};
