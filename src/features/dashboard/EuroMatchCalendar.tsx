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
        setSelectedGame,
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

            const game = isPlayed ? userTeamGames[roundIdx] : null;
            let result: { won: boolean; userScore: number; oppScore: number } | null = null;
            if (game) {
                const uScore = game.homeTeamId === userTeamId ? (game.homeScore ?? 0) : (game.awayScore ?? 0);
                const oScore = game.homeTeamId === userTeamId ? (game.awayScore ?? 0) : (game.homeScore ?? 0);
                result = { won: game.winnerId === userTeamId, userScore: uScore, oppScore: oScore };
            }

            return { roundIdx, matchDay: roundIdx + 1, isHome, opponentId, opponent, isPlayed, isPending, result, game };
        }).filter(Boolean);
    }, [euroSchedule, userTeamGames, teams, userTeamId, seasonGamesPlayed]);

    // Visible window: show 8 match-days at a time centered around current round
    const WINDOW = 8;
    const totalMatchDays = isEuroMode ? 38 : matchDays.length;
    const maxOffset = Math.max(0, totalMatchDays - WINDOW);
    const clampedOffset = Math.max(0, Math.min(viewOffset, maxOffset));

    const visible = matchDays.slice(clampedOffset, clampedOffset + WINDOW);

    // Stats summary
    const played = matchDays.filter(m => m && m.isPlayed && m.result);
    const wins = played.filter(m => m && m.result?.won).length;
    const losses = played.length - wins;

    if (!isEuroMode || !userTeam) return null;

    const leagueLabel = userTeam.conference === 'EuroLeague' ? 'EuroLeague' : 'EuroCup';

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #f2f2f7',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f2f2f7',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        background: 'rgba(var(--primary-rgb), 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <Calendar size={16} color="var(--team-primary)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8e8e93', letterSpacing: '0.05em' }}>
                            {leagueLabel.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1c1c1e', letterSpacing: '-0.01em' }}>
                            Schedule & Results
                        </span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right', marginRight: '8px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#1c1c1e' }}>
                            <span style={{ color: '#2ecc71' }}>{wins}W</span> - <span style={{ color: '#e74c3c' }}>{losses}L</span>
                        </div>
                        <div style={{ fontSize: '0.55rem', color: '#8e8e93', fontWeight: 700 }}>
                            MD {seasonGamesPlayed}/{totalMatchDays}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => setViewOffset(v => Math.max(0, v - 4))}
                            disabled={clampedOffset === 0}
                            style={{
                                background: '#f2f2f7',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#1c1c1e',
                                cursor: clampedOffset === 0 ? 'not-allowed' : 'pointer',
                                opacity: clampedOffset === 0 ? 0.3 : 1,
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setViewOffset(v => Math.min(maxOffset, v + 4))}
                            disabled={clampedOffset >= maxOffset}
                            style={{
                                background: '#f2f2f7',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#1c1c1e',
                                cursor: clampedOffset >= maxOffset ? 'not-allowed' : 'pointer',
                                opacity: clampedOffset >= maxOffset ? 0.3 : 1,
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Match Day List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {visible.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8e8e93', fontSize: '0.8rem' }}>
                        Schedule not yet generated.
                    </div>
                ) : (
                    visible.map((md) => {
                        if (!md) return null;
                        const isPending = md.matchDay === seasonGamesPlayed + 1;
                        const isPlayed = md.isPlayed && md.result !== null;
                        const opp = md.opponent;

                        return (
                            <div
                                key={md.matchDay}
                                onClick={() => {
                                    if (isPlayed && md.game) {
                                        setSelectedGame(md.game);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    borderBottom: '1px solid #f2f2f7',
                                    background: isPending ? 'rgba(var(--primary-rgb), 0.03)' : '#ffffff',
                                    transition: 'all 0.2s ease',
                                    cursor: isPlayed ? 'pointer' : 'default',
                                }}
                                onMouseEnter={(e) => {
                                    if (isPlayed) e.currentTarget.style.background = '#f9f9fb';
                                }}
                                onMouseLeave={(e) => {
                                    if (isPlayed) {
                                        e.currentTarget.style.background = isPending ? 'rgba(var(--primary-rgb), 0.03)' : '#ffffff';
                                    }
                                }}
                            >
                                {/* Match Day Number */}
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: isPending ? 'var(--team-primary)' : '#f2f2f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        color: isPending ? '#ffffff' : '#8e8e93',
                                    }}>
                                        {md.matchDay}
                                    </span>
                                </div>

                                {/* H/A */}
                                <div style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    color: '#8e8e93',
                                    width: '12px',
                                    textAlign: 'center'
                                }}>
                                    {md.isHome ? 'H' : 'A'}
                                </div>

                                {/* Opponent */}
                                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {opp?.logo && (
                                        <div style={{ 
                                            width: '28px', 
                                            height: '28px', 
                                            padding: '4px', 
                                            background: '#f9f9fb', 
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img 
                                                src={opp.logo} 
                                                alt={opp.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            />
                                        </div>
                                    )}
                                    <div style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        color: '#1c1c1e',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        letterSpacing: '-0.01em'
                                    }}>
                                        <span style={{ color: '#8e8e93', fontWeight: 600, marginRight: '4px' }}>
                                            {md.isHome ? 'vs' : '@'}
                                        </span>
                                        {opp?.name ?? 'TBD'}
                                    </div>
                                </div>

                                {/* Result */}
                                <div style={{ flexShrink: 0 }}>
                                    {isPlayed && md && md.result ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#1c1c1e' }}>
                                                    {md.result.userScore}–{md.result.oppScore}
                                                </div>
                                            </div>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: md.result.won ? '#2ecc71' : '#e74c3c',
                                                color: '#ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                            }}>
                                                {md.result.won ? 'W' : 'L'}
                                            </div>
                                        </div>
                                    ) : isPending ? (
                                        <div style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.6rem',
                                            fontWeight: 900,
                                            background: 'rgba(var(--primary-rgb), 0.1)',
                                            color: 'var(--team-primary)',
                                            letterSpacing: '0.05em'
                                        }}>
                                            NEXT UP
                                        </div>
                                    ) : (
                                        <div style={{
                                            fontSize: '0.6rem',
                                            fontWeight: 700,
                                            color: '#c7c7cc',
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
            <div style={{ padding: '16px 20px', background: '#f9f9fb' }}>
                <div style={{
                    height: '32px',
                    background: '#e5e5ea',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div 
                        className="progress-shine progress-active"
                        style={{
                            width: `${totalMatchDays > 0 ? (seasonGamesPlayed / totalMatchDays) * 100 : 0}%`,
                            height: '100%',
                            background: 'var(--team-primary)',
                            borderRadius: '16px',
                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                        }} 
                    />
                    
                    {/* Progress text centered over the bar */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        zIndex: 3,
                        pointerEvents: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ 
                            fontSize: '0.65rem', 
                            color: (seasonGamesPlayed / totalMatchDays) > 0.5 ? '#ffffff' : '#8e8e93', 
                            fontWeight: 900, 
                            letterSpacing: '0.1em',
                            textShadow: (seasonGamesPlayed / totalMatchDays) > 0.5 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                        }}>
                            SEASON PROGRESS
                        </span>
                        <span style={{ 
                            fontSize: '0.8rem', 
                            color: (seasonGamesPlayed / totalMatchDays) > 0.5 ? '#ffffff' : '#1c1c1e', 
                            fontWeight: 900,
                            textShadow: (seasonGamesPlayed / totalMatchDays) > 0.5 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                        }}>
                            {totalMatchDays > 0 ? Math.round((seasonGamesPlayed / totalMatchDays) * 100) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
