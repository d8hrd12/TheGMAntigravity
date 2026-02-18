import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { BackButton } from '../ui/BackButton';
import { calculateOverall } from '../../utils/playerUtils';
import type { Player } from '../../models/Player';
import type { RetiredPlayer } from '../../store/GameContext';

// ─── Types ───────────────────────────────────────────────────────────────────
type LeaderboardStat =
    | 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks'
    | 'gamesPlayed' | 'fgMade' | 'threeMade' | 'ftMade' | 'turnovers';

interface LeaderEntry {
    id: string;
    name: string;
    value: number;
    gp: number;
    isRetired: boolean;
    isHof: boolean;
}

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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildLeaderboard(
    allPlayers: (Player | RetiredPlayer)[],
    stat: LeaderboardStat
): LeaderEntry[] {
    return allPlayers
        .map(p => {
            // Archived regular-season rows
            const regularStats = p.careerStats.filter(s => !s.isPlayoffs);
            let value = regularStats.reduce((acc, s) => acc + (s[stat] ?? 0), 0);
            let gp = regularStats.reduce((acc, s) => acc + s.gamesPlayed, 0);
            // Add current in-progress season stats (not yet archived)
            if (p.seasonStats && p.seasonStats.gamesPlayed > 0) {
                value += (p.seasonStats[stat] ?? 0);
                gp += p.seasonStats.gamesPlayed;
            }
            return {
                id: p.id,
                name: `${p.firstName} ${p.lastName}`,
                value,
                gp,
                isRetired: 'exitYear' in p,
                isHof: p.isHallOfFame === true,
            };
        })
        .filter(e => e.gp > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 25);
}

// ─── Component ───────────────────────────────────────────────────────────────
export const LeagueHistoryView: React.FC<{ onBack: () => void; onSelectPlayer?: (id: string) => void }> = ({ onBack, onSelectPlayer }) => {
    const { awardsHistory, retiredPlayersHistory, teams, players } = useGame();
    const [activeTab, setActiveTab] = useState<'seasons' | 'retired' | 'legends'>('seasons');
    const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
    const [leaderStat, setLeaderStat] = useState<LeaderboardStat>('points');

    const sortedHistory = [...awardsHistory].sort((a, b) => b.year - a.year);

    const allRetiredPlayers = useMemo(() =>
        retiredPlayersHistory.flatMap(h => h.players).sort((a, b) => b.exitYear - a.exitYear),
        [retiredPlayersHistory]
    );

    // All players ever (active + retired) for leaderboard
    const allPlayers = useMemo<(Player | RetiredPlayer)[]>(() => {
        const retiredIds = new Set(allRetiredPlayers.map(p => p.id));
        const activePlayers = players.filter(p => !retiredIds.has(p.id));
        return [...activePlayers, ...allRetiredPlayers];
    }, [players, allRetiredPlayers]);

    const leaderboard = useMemo(() => buildLeaderboard(allPlayers, leaderStat), [allPlayers, leaderStat]);

    const AwardRow = ({ title, winner }: { title: string; winner: any }) => (
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem'
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

    const tabStyle = (tab: string) => ({
        flex: 1, padding: '10px 6px',
        background: activeTab === tab
            ? 'var(--primary)'
            : 'rgba(255,255,255,0.05)',
        border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
        fontWeight: 700 as const,
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>League History</h1>
            </div>

            {/* ── TABS ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('seasons')} style={tabStyle('seasons')}>🏆 Seasons</button>
                <button onClick={() => setActiveTab('retired')} style={tabStyle('retired')}>📋 Retired</button>
                <button onClick={() => setActiveTab('legends')} style={tabStyle('legends')}>🌟 Legends</button>
            </div>

            {/* ── SEASONS TAB ── */}
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
                                        padding: '16px', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', cursor: 'pointer',
                                        background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{history.year}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {championTeam?.logo && <img src={championTeam.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
                                            <span style={{ fontWeight: 600 }}>{history.champion?.teamName || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{isExpanded ? 'Hide' : 'View Awards'}</span>
                                </div>
                                {isExpanded && (
                                    <div style={{ padding: '0 16px 16px 16px', background: 'rgba(0,0,0,0.2)' }}>
                                        <AwardRow title="NBA Champion" winner={{ playerName: history.champion?.teamName, teamName: '', statsSummary: '' }} />
                                        <AwardRow title="Finals MVP" winner={history.finalsMvp} />
                                        <div style={{ margin: '10px 0', borderTop: '1px solid var(--border)' }} />
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

            {/* ── RETIRED TAB ── */}
            {activeTab === 'retired' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {allRetiredPlayers.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No retired players yet.</div>
                    ) : (
                        allRetiredPlayers.map(player => (
                            <div key={player.id} className="glass-panel" onClick={() => onSelectPlayer?.(player.id)} style={{ padding: '16px', cursor: onSelectPlayer ? 'pointer' : 'default' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{player.firstName} {player.lastName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {player.position} • Retired {player.exitYear} ({player.ageAtRetirement || player.age} y/o)
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{player.isHallOfFame ? '🏆 Hall of Fame' : ''}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Peak OVR: {calculateOverall(player)}</div>
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

            {/* ── LEGENDS / LEADERBOARD TAB ── */}
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
                                    background: leaderStat === s
                                        ? 'var(--primary)'
                                        : 'rgba(255,255,255,0.07)',
                                    color: leaderStat === s ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {STAT_LABELS[s]}
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Title */}
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>All-Time {STAT_LABELS[leaderStat]} Leaders</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Career Totals • Regular Season</span>
                    </div>

                    {/* Leaderboard List */}
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        {leaderboard.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No career stats recorded yet.
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
                                            color: isTop3 ? 'var(--primary)' : 'var(--text-secondary)',
                                            flexShrink: 0,
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
                                                {entry.isRetired && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                                                        borderRadius: '10px', background: 'rgba(255,255,255,0.08)',
                                                        color: 'var(--text-secondary)'
                                                    }}>Retired</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                {entry.gp} GP
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
                                            color: isTop3 ? 'var(--primary)' : 'var(--text)',
                                            flexShrink: 0,
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
