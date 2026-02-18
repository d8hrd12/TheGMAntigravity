import React, { useState, useMemo } from 'react';
import type { Team } from '../../models/Team';
import { PageHeader } from '../ui/PageHeader';
import { useGame } from '../../store/GameContext';
import type { Player } from '../../models/Player';
import type { RetiredPlayer } from '../../store/GameContext';

// ─── Types ───────────────────────────────────────────────────────────────────
type LeaderboardStat =
    | 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks'
    | 'gamesPlayed' | 'fgMade' | 'threeMade' | 'ftMade' | 'turnovers';

const STAT_LABELS: Record<LeaderboardStat, string> = {
    points: 'Points',
    rebounds: 'Rebounds',
    assists: 'Assists',
    steals: 'Steals',
    blocks: 'Blocks',
    gamesPlayed: 'Games Played',
    fgMade: 'FG Made',
    threeMade: '3PT Made',
    ftMade: 'FT Made',
    turnovers: 'Turnovers',
};
const STAT_KEYS = Object.keys(STAT_LABELS) as LeaderboardStat[];

interface TeamHistoryViewProps {
    team: Team;
    onBack: () => void;
    onSelectPlayer?: (id: string) => void;
}

export const TeamHistoryView: React.FC<TeamHistoryViewProps> = ({ team, onBack, onSelectPlayer }) => {
    const { players, retiredPlayersHistory, awardsHistory } = useGame();
    const [activeTab, setActiveTab] = useState<'seasons' | 'legends'>('seasons');
    const [leaderStat, setLeaderStat] = useState<LeaderboardStat>('points');

    const history = [...(team.history || [])].sort((a, b) => b.year - a.year);

    // Count rings for this team
    const rings = awardsHistory.filter(h => h.champion?.teamId === team.id).length;

    // All players who ever played for this team (active + retired)
    const allPlayers = useMemo<(Player | RetiredPlayer)[]>(() => {
        const retired = retiredPlayersHistory.flatMap(h => h.players);
        const retiredIds = new Set(retired.map(p => p.id));
        const active = players.filter(p => !retiredIds.has(p.id));
        return [...active, ...retired];
    }, [players, retiredPlayersHistory]);

    // Build team-specific leaderboard: only careerStats rows for this team
    const leaderboard = useMemo(() => {
        return allPlayers
            .map(p => {
                // Archived rows for this team
                const teamRows = p.careerStats.filter(s => s.teamId === team.id && !s.isPlayoffs);
                let value = teamRows.reduce((acc, s) => acc + (s[leaderStat] ?? 0), 0);
                let gp = teamRows.reduce((acc, s) => acc + s.gamesPlayed, 0);
                // Add current in-progress season if player is currently on this team
                if (p.teamId === team.id && p.seasonStats && p.seasonStats.gamesPlayed > 0) {
                    value += (p.seasonStats[leaderStat] ?? 0);
                    gp += p.seasonStats.gamesPlayed;
                }
                // Count rings won while on this team
                const playerRings = awardsHistory.filter(h =>
                    h.champion?.teamId === team.id &&
                    p.careerStats.some(s => s.season === h.year && s.teamId === team.id)
                ).length;
                return {
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    value,
                    gp,
                    rings: playerRings,
                    isRetired: 'exitYear' in p,
                    isHof: p.isHallOfFame === true,
                };
            })
            .filter(e => e.gp > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 25);
    }, [allPlayers, leaderStat, team.id, awardsHistory]);

    const tabStyle = (tab: string) => ({
        flex: 1, padding: '10px 6px',
        background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
        border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
        fontWeight: 700 as const, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
    });

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
            <PageHeader title={`${team.city} ${team.name} History`} onBack={onBack} />

            {/* Team Summary Banner */}
            <div style={{
                display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
            }}>
                <div className="glass-panel" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{rings}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>🏆 Championships</div>
                </div>
                <div className="glass-panel" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{history.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Seasons</div>
                </div>
                <div className="glass-panel" style={{ padding: '14px 20px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2ecc71' }}>
                        {history.reduce((a, h) => a + h.wins, 0)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>All-Time Wins</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('seasons')} style={tabStyle('seasons')}>📅 Season Records</button>
                <button onClick={() => setActiveTab('legends')} style={tabStyle('legends')}>🌟 Team Legends</button>
            </div>

            {/* ── SEASONS TAB ── */}
            {activeTab === 'seasons' && (
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
                                    const isChamp = awardsHistory.some(aw => aw.year === h.year && aw.champion?.teamId === team.id);
                                    return (
                                        <tr key={h.year} style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: isChamp ? 'rgba(241,196,15,0.06)' : index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                        }}>
                                            <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>
                                                {h.year} - {h.year + 1}
                                                {isChamp && <span style={{ marginLeft: '8px', fontSize: '0.75rem' }}>🏆</span>}
                                            </td>
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
            )}

            {/* ── LEGENDS TAB ── */}
            {activeTab === 'legends' && (
                <div>
                    {/* Stat Selector */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px',
                        background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        {STAT_KEYS.map(s => (
                            <button
                                key={s}
                                onClick={() => setLeaderStat(s)}
                                style={{
                                    padding: '6px 14px', borderRadius: '20px', border: 'none',
                                    background: leaderStat === s ? 'var(--primary)' : 'rgba(255,255,255,0.07)',
                                    color: leaderStat === s ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >
                                {STAT_LABELS[s]}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                            {team.city} {team.name} — All-Time {STAT_LABELS[leaderStat]} Leaders
                        </h3>
                    </div>

                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        {leaderboard.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No career stats recorded for this team yet.
                            </div>
                        ) : (
                            leaderboard.map((entry, idx) => {
                                const isTop3 = idx < 3;
                                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                                return (
                                    <div
                                        key={entry.id}
                                        onClick={() => onSelectPlayer?.(entry.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '12px 16px',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: isTop3 ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            cursor: onSelectPlayer ? 'pointer' : 'default',
                                        }}
                                    >
                                        {/* Rank */}
                                        <div style={{
                                            width: '28px', textAlign: 'center',
                                            fontWeight: 800, fontSize: isTop3 ? '1.1rem' : '0.9rem',
                                            color: isTop3 ? 'var(--primary)' : 'var(--text-secondary)', flexShrink: 0,
                                        }}>
                                            {medal || `#${idx + 1}`}
                                        </div>

                                        {/* Name + badges */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{entry.name}</span>
                                                {entry.isHof && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                                                        borderRadius: '10px', background: 'rgba(241,196,15,0.2)',
                                                        color: '#f1c40f', border: '1px solid rgba(241,196,15,0.3)'
                                                    }}>HOF</span>
                                                )}
                                                {entry.rings > 0 && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                                                        borderRadius: '10px', background: 'rgba(241,196,15,0.15)',
                                                        color: '#f1c40f'
                                                    }}>{'🏆'.repeat(entry.rings)}</span>
                                                )}
                                                {entry.isRetired && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                                                        borderRadius: '10px', background: 'rgba(255,255,255,0.08)',
                                                        color: 'var(--text-secondary)'
                                                    }}>Retired</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                {entry.gp} GP with {team.abbreviation}
                                                {leaderStat !== 'gamesPlayed' && (
                                                    <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                                                        ({(entry.value / Math.max(1, entry.gp)).toFixed(1)} per game)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Value */}
                                        <div style={{
                                            fontWeight: 800, fontSize: '1.15rem',
                                            color: isTop3 ? 'var(--primary)' : 'var(--text)', flexShrink: 0,
                                        }}>
                                            {entry.value.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
