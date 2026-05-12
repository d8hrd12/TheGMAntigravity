import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateEuroSchedule } from '../../utils/scheduleGenerator';

/**
 * EuroMatchCalendar — shown only in EURO league mode.
 *
 * Displays a scrollable list of all 38 match days for the user's team.
 * Each row shows:
 *   - Match Day number
 *   - H / A indicator
 *   - Opponent abbreviation / logo colour
 *   - W / L badge + final score (once the game has been played)
 *   - "UPCOMING" badge for future rounds
 */
export const EuroMatchCalendar: React.FC = () => {
    const {
        euroSchedule,
        games,
        teams,
        userTeamId,
        seasonGamesPlayed,
        leagueType,
        setGameState,
    } = useGame();

    const [viewOffset, setViewOffset] = useState(0);

    const userTeam = useMemo(() => teams.find(t => t.id === userTeamId), [teams, userTeamId]);

    // Detect Euro mode even if leagueType is missing from old saves
    const isEuroMode = leagueType === 'EURO'
        || userTeam?.conference === 'EuroLeague'
        || userTeam?.conference === 'EuroCup';

    // Self-heal: if the schedule is missing (old save loaded without migration), generate it now
    useEffect(() => {
        if (!isEuroMode) return;
        if (euroSchedule && euroSchedule.length > 0) return;
        if (teams.length === 0) return;

        const elTeams = teams.filter(t => t.conference === 'EuroLeague');
        const ecTeams = teams.filter(t => t.conference === 'EuroCup');
        if (elTeams.length === 0 && ecTeams.length === 0) return;

        const elRounds = generateEuroSchedule(elTeams);
        const ecRounds = generateEuroSchedule(ecTeams);
        const totalRounds = Math.max(elRounds.length, ecRounds.length);
        const rebuilt: { homeId: string; awayId: string }[][] = [];
        for (let i = 0; i < totalRounds; i++) {
            rebuilt.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
        }

        const nextRound = seasonGamesPlayed || 0;
        const currentMatchups = nextRound < rebuilt.length ? rebuilt[nextRound] : [];

        console.log(`[EuroCalendar] Self-healing schedule: ${rebuilt.length} rounds generated.`);
        setGameState((prev: any) => ({
            ...prev,
            euroSchedule: rebuilt,
            dailyMatchups: currentMatchups.length > 0 ? currentMatchups : prev.dailyMatchups,
        }));
    }, [isEuroMode, euroSchedule, teams, seasonGamesPlayed]);

    // Sort all user-team games in order (id is typically UUID but game list is appended in order)
    const userTeamGames = useMemo(() =>
        games.filter(g => g.homeTeamId === userTeamId || g.awayTeamId === userTeamId),
        [games, userTeamId]
    );

    // Build list of match-days where the user's team plays
    const matchDays = useMemo(() => {
        if (!euroSchedule || euroSchedule.length === 0 || !userTeamId) return [];

        return euroSchedule.map((round, roundIdx) => {
            const matchup = round.find(
                m => m.homeId === userTeamId || m.awayId === userTeamId
            );
            if (!matchup) return null;

            const isHome = matchup.homeId === userTeamId;
            const opponentId = isHome ? matchup.awayId : matchup.homeId;
            const opponent = teams.find(t => t.id === opponentId);

            const isPlayed = roundIdx < seasonGamesPlayed;
            const isPending = roundIdx === seasonGamesPlayed;

            // Match day → game result: the user played game #roundIdx in the season
            let result: { won: boolean; userScore: number; oppScore: number } | null = null;
            if (isPlayed && userTeamGames[roundIdx]) {
                const g = userTeamGames[roundIdx];
                const uScore = g.homeTeamId === userTeamId ? (g.homeScore ?? 0) : (g.awayScore ?? 0);
                const oScore = g.homeTeamId === userTeamId ? (g.awayScore ?? 0) : (g.homeScore ?? 0);
                result = { won: g.winnerId === userTeamId, userScore: uScore, oppScore: oScore };
            }

            return { roundIdx, matchDay: roundIdx + 1, isHome, opponentId, opponent, isPlayed, isPending, result };
        }).filter(Boolean);
    }, [euroSchedule, userTeamGames, teams, userTeamId, seasonGamesPlayed]);

    // Visible window: show 8 match-days at a time centered around current round
    const WINDOW = 8;
    const totalMatchDays = isEuroMode ? 38 : matchDays.length;
    const maxOffset = Math.max(0, totalMatchDays - WINDOW);
    const clampedOffset = Math.max(0, Math.min(viewOffset, maxOffset));

    const visible = matchDays.slice(clampedOffset, clampedOffset + WINDOW);

    // Stats summary
    const played = matchDays.filter(m => m.isPlayed && m.result);
    const wins = played.filter(m => m.result?.won).length;
    const losses = played.length - wins;

    if (!isEuroMode || !userTeam) return null;

    const leagueLabel = userTeam.conference === 'EuroLeague' ? 'EuroLeague' : 'EuroCup';

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#e8c456" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#e8c456', letterSpacing: '0.08em' }}>
                        {leagueLabel.toUpperCase()} SCHEDULE
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        MD {seasonGamesPlayed}/{totalMatchDays} &nbsp;
                        <span style={{ color: '#2ecc71' }}>{wins}W</span>
                        {' '}-{' '}
                        <span style={{ color: '#e74c3c' }}>{losses}L</span>
                    </span>
                    <button
                        onClick={() => setViewOffset(v => Math.max(0, v - 4))}
                        disabled={clampedOffset === 0}
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: clampedOffset === 0 ? 'not-allowed' : 'pointer',
                            opacity: clampedOffset === 0 ? 0.3 : 1,
                            padding: '3px 5px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ChevronLeft size={12} />
                    </button>
                    <button
                        onClick={() => setViewOffset(v => Math.min(maxOffset, v + 4))}
                        disabled={clampedOffset >= maxOffset}
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: clampedOffset >= maxOffset ? 'not-allowed' : 'pointer',
                            opacity: clampedOffset >= maxOffset ? 0.3 : 1,
                            padding: '3px 5px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* Match Day List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {visible.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        Schedule not yet generated. Start a new season to see your fixtures.
                    </div>
                ) : (
                    visible.map((md) => {
                        const isPending = md.matchDay === seasonGamesPlayed + 1;
                        const isPlayed = md.isPlayed && md.result !== null;
                        const opp = md.opponent;

                        return (
                            <div
                                key={md.matchDay}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '9px 14px',
                                    borderBottom: '1px solid var(--border-color)',
                                    background: isPending
                                        ? 'linear-gradient(90deg, rgba(232,196,86,0.08) 0%, transparent 100%)'
                                        : 'transparent',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {/* Match Day Number */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: isPending
                                        ? 'rgba(232,196,86,0.15)'
                                        : isPlayed
                                        ? 'rgba(255,255,255,0.04)'
                                        : 'rgba(255,255,255,0.02)',
                                    border: isPending ? '1px solid rgba(232,196,86,0.4)' : '1px solid var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 900,
                                        color: isPending ? '#e8c456' : 'var(--text-muted)',
                                    }}>
                                        MD{md.matchDay}
                                    </span>
                                </div>

                                {/* H/A Badge */}
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    background: md.isHome ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.1)',
                                    border: `1px solid ${md.isHome ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.25)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{
                                        fontSize: '0.5rem',
                                        fontWeight: 900,
                                        color: md.isHome ? '#2ecc71' : '#e74c3c',
                                    }}>
                                        {md.isHome ? 'H' : 'A'}
                                    </span>
                                </div>

                                {/* Opponent */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        color: isPlayed ? 'var(--text-muted)' : 'var(--text-main)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {md.isHome ? 'vs' : '@'}{' '}
                                        <span style={{ color: isPending ? '#e8c456' : undefined }}>
                                            {opp?.abbreviation ?? opp?.name ?? 'TBD'}
                                        </span>
                                    </div>
                                    {opp && (
                                        <div style={{
                                            fontSize: '0.55rem',
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {opp.city}
                                        </div>
                                    )}
                                </div>

                                {/* Result / Status */}
                                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                    {isPlayed && md && md.result ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                            <div style={{
                                                padding: '2px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.65rem',
                                                fontWeight: 900,
                                                background: md.result.won
                                                    ? 'rgba(46,204,113,0.15)'
                                                    : 'rgba(231,76,60,0.12)',
                                                color: md.result.won ? '#2ecc71' : '#e74c3c',
                                                border: `1px solid ${md.result.won ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.25)'}`,
                                            }}>
                                                {md.result.won ? 'W' : 'L'}
                                            </div>
                                            <div style={{
                                                fontSize: '0.6rem',
                                                fontWeight: 700,
                                                color: 'var(--text-muted)',
                                            }}>
                                                {md.result.userScore} – {md.result.oppScore}
                                            </div>
                                        </div>
                                    ) : isPending ? (
                                        <div style={{
                                            padding: '2px 8px',
                                            borderRadius: '5px',
                                            fontSize: '0.55rem',
                                            fontWeight: 900,
                                            background: 'rgba(232,196,86,0.12)',
                                            color: '#e8c456',
                                            border: '1px solid rgba(232,196,86,0.3)',
                                        }}>
                                            NEXT
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '2px 8px',
                                            borderRadius: '5px',
                                            fontSize: '0.55rem',
                                            fontWeight: 700,
                                            background: 'rgba(255,255,255,0.03)',
                                            color: 'var(--text-muted)',
                                        }}>
                                            UPCOMING
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Progress bar */}
            <div style={{ padding: '8px 14px 10px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEASON PROGRESS</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {totalMatchDays > 0 ? Math.round((seasonGamesPlayed / totalMatchDays) * 100) : 0}%
                    </span>
                </div>
                <div style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${totalMatchDays > 0 ? (seasonGamesPlayed / totalMatchDays) * 100 : 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #e8c456, #f39c12)',
                        borderRadius: '2px',
                        transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>
        </div>
    );
};
