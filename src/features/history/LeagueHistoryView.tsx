import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { BackButton } from '../ui/BackButton';
import { calculateOverall } from '../../utils/playerUtils';

export const LeagueHistoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { awardsHistory, retiredPlayersHistory, teams } = useGame();
    const [activeTab, setActiveTab] = useState<'seasons' | 'retired'>('seasons');
    const [expandedSeason, setExpandedSeason] = useState<number | null>(null);

    // Sort history by year descending
    const sortedHistory = [...awardsHistory].sort((a, b) => b.year - a.year);

    // Flatten retired players
    const allRetiredPlayers = useMemo(() => {
        return retiredPlayersHistory.flatMap(h => h.players).sort((a, b) => b.exitYear - a.exitYear);
    }, [retiredPlayersHistory]);

    const AwardRow = ({ title, winner }: { title: string, winner: any }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.9rem'
        }}>
            <span style={{ color: 'var(--text-secondary)' }}>{title}</span>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{winner?.playerName || 'N/A'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {winner?.teamName} • {winner?.statsSummary}
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>League History</h1>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('seasons')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: activeTab === 'seasons' ? 'var(--primary)' : 'var(--surface)',
                        border: 'none',
                        borderRadius: '8px',
                        color: activeTab === 'seasons' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Season History
                </button>
                <button
                    onClick={() => setActiveTab('retired')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: activeTab === 'retired' ? 'var(--primary)' : 'var(--surface)',
                        border: 'none',
                        borderRadius: '8px',
                        color: activeTab === 'retired' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Retired Players
                </button>
            </div>

            {activeTab === 'seasons' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedHistory.map(history => {
                        const isExpanded = expandedSeason === history.year;
                        const championTeam = teams.find(t => t.id === history.champion?.teamId);

                        return (
                            <div key={history.year} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <div
                                    onClick={() => setExpandedSeason(isExpanded ? null : history.year)}
                                    style={{
                                        padding: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{history.year}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {championTeam?.logo && (
                                                <img src={championTeam.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                            )}
                                            <span style={{ fontWeight: 600 }}>{history.champion?.teamName || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {isExpanded ? 'Hide' : 'View Awards'}
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '0 16px 16px 16px', background: 'rgba(0,0,0,0.2)' }}>
                                        <AwardRow title="NBA Champion" winner={{ playerName: history.champion?.teamName, teamName: '', statsSummary: '' }} />
                                        <AwardRow title="Finals MVP" winner={history.finalsMvp} />
                                        <div style={{ margin: '10px 0', borderTop: '1px solid var(--border)' }}></div>
                                        <AwardRow title="Season MVP" winner={history.mvp} />
                                        <AwardRow title="Rookie of the Year" winner={history.roty} />
                                        <AwardRow title="Defensive Player of the Year" winner={history.dpoy} />
                                        <AwardRow title="Most Improved Player" winner={history.mip} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {sortedHistory.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No league history available yet. Complete a season to see results.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'retired' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {allRetiredPlayers.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No retired players yet.
                        </div>
                    ) : (
                        allRetiredPlayers.map(player => (
                            <div key={player.id} className="glass-panel" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{player.firstName} {player.lastName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {player.position} • Retired {player.exitYear} ({player.ageAtRetirement || player.age} y/o)
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                            {player.isHallOfFame ? '🏆 Hall of Fame' : ''}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Peak OVR: {calculateOverall(player)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '10px', fontSize: '0.8rem', display: 'flex', gap: '15px' }}>
                                    <div><b>GP:</b> {player.careerStats.reduce((acc, s) => acc + s.gamesPlayed, 0)}</div>
                                    <div><b>PTS:</b> {(player.careerStats.reduce((acc, s) => acc + s.points, 0) / Math.max(1, player.careerStats.reduce((acc, s) => acc + s.gamesPlayed, 0))).toFixed(1)}</div>
                                    <div><b>AST:</b> {(player.careerStats.reduce((acc, s) => acc + s.assists, 0) / Math.max(1, player.careerStats.reduce((acc, s) => acc + s.gamesPlayed, 0))).toFixed(1)}</div>
                                    <div><b>REB:</b> {(player.careerStats.reduce((acc, s) => acc + s.rebounds, 0) / Math.max(1, player.careerStats.reduce((acc, s) => acc + s.gamesPlayed, 0))).toFixed(1)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
