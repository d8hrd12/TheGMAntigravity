import React from 'react';
import { BackButton } from '../ui/BackButton';
import { DollarSign, Edit } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import type { Player, PlayerAttributes } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { Contract } from '../../models/Contract';
import { PlayerRadarChart } from '../../components/charts/PlayerRadarChart';
import { PlayerTrendGraph } from '../../components/charts/PlayerTrendGraph';

import { calculateOverall, calculateTendencies } from '../../utils/playerUtils';
import { getFuzzyAttribute, getFuzzyPotential } from '../../utils/scoutingUtils';

interface PlayerDetailViewProps {
    player: Player;
    team?: Team;
    teams: Team[];
    contract?: Contract;
    onBack: () => void;
    onTradeFor?: (playerId: string) => void;
    onShop: () => void;
    onTeamClick?: (teamId: string) => void;
    isUserTeam: boolean;
}

export const PlayerDetailView: React.FC<PlayerDetailViewProps> = ({ player, team, teams, contract, onBack, onTradeFor, isUserTeam, onShop, onTeamClick }) => {
    const { settings, awardsHistory, players, seasonPhase, scoutingReports, userTeamId } = useGame();
    // Default to true if settings aren't loaded yet/legacy
    const showLoveForTheGame = settings?.showLoveForTheGame ?? true;

    // Check if Prospect (Fog of War)
    const isProspect = (seasonPhase === 'scouting' || seasonPhase === 'draft') && !player.teamId;
    const scoutingReport = isProspect ? (scoutingReports[userTeamId]?.[player.id] || { points: 0, isPotentialRevealed: false }) : null;
    const scoutingPoints = scoutingReport?.points || 0;
    const isRevealed = scoutingReport?.isPotentialRevealed || false;

    // Memoize teammates for tendency context
    const teammates = React.useMemo(() =>
        player.teamId ? players.filter(p => p.teamId === player.teamId) : [],
        [players, player.teamId]
    );

    const getRatingColor = (value: number | string) => {
        if (typeof value === 'string') return value === '??' ? '#ccc' : '#f1c40f'; // simplistic for fuzzy
        if (value >= 90) return '#2ecc71'; // Elite - Green
        if (value >= 80) return '#3498db'; // Good - Blue
        if (value >= 70) return '#f1c40f'; // Average - Yellow
        return '#e74c3c'; // Poor - Red
    };

    const AttributeRow = ({ label, value, prevValue }: { label: string, value: number, prevValue?: number }) => {

        let displayValue: string | number = value;
        if (isProspect) {
            displayValue = getFuzzyAttribute(value, scoutingPoints);
        }

        const diff = prevValue !== undefined ? value - prevValue : 0;
        let indicator = null;
        if (!isProspect && diff > 0) { // Don't show progress for fuzzy prospects
            indicator = <span style={{ color: '#2ecc71', fontSize: '0.8rem', marginLeft: '6px' }}>▲ {diff}</span>;
        } else if (!isProspect && diff < 0) {
            indicator = <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginLeft: '6px' }}>▼ {Math.abs(diff)}</span>;
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                <span style={{ color: '#ccc' }}>{label}</span>
                <div>
                    <span style={{ fontWeight: 'bold', color: getRatingColor(typeof displayValue === 'number' ? displayValue : 50) }}>{displayValue}</span>
                    {indicator}
                </div>
            </div>
        );
    };

    // ... (rest of component, skipping to stats part) ...

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const [viewMode, setViewMode] = React.useState<'Average' | 'Total'>('Average');
    const [careerMode, setCareerMode] = React.useState<'Regular' | 'Playoff'>('Regular');
    const [statsView, setStatsView] = React.useState<'Skills' | 'Development'>('Skills');

    const stats = player.seasonStats;
    const gp = stats.gamesPlayed || 1;

    // Helper to format stats based on mode
    const getDisplayStat = (value: number, isPct: boolean = false) => {
        if (viewMode === 'Total') return value;
        if (isPct) return value; // Percentages are already calculated or passed as is? No, value is raw.
        return (value / gp).toFixed(1);
    };

    // Derived Display values
    const ppg = viewMode === 'Average' ? (stats.points / gp).toFixed(1) : stats.points;
    const rpg = viewMode === 'Average' ? (stats.rebounds / gp).toFixed(1) : stats.rebounds;
    const orpg = viewMode === 'Average' ? (stats.offensiveRebounds / gp).toFixed(1) : stats.offensiveRebounds;
    const drpg = viewMode === 'Average' ? (stats.defensiveRebounds / gp).toFixed(1) : stats.defensiveRebounds;
    const apg = viewMode === 'Average' ? (stats.assists / gp).toFixed(1) : stats.assists;
    const spg = viewMode === 'Average' ? (stats.steals / gp).toFixed(1) : stats.steals;
    const bpg = viewMode === 'Average' ? (stats.blocks / gp).toFixed(1) : stats.blocks;
    const topg = viewMode === 'Average' ? (stats.turnovers / gp).toFixed(1) : stats.turnovers;
    const mpg = viewMode === 'Average' ? (stats.minutes / gp).toFixed(1) : Math.round(stats.minutes);

    // Shooting Display
    const fgPrev = stats.fgAttempted > 0 ? ((stats.fgMade / stats.fgAttempted) * 100).toFixed(1) + '%' : '0.0%';
    const fgDisplay = viewMode === 'Total' ? `${stats.fgMade}/${stats.fgAttempted}` : fgPrev;

    const threePrev = stats.threeAttempted > 0 ? ((stats.threeMade / stats.threeAttempted) * 100).toFixed(1) + '%' : '0.0%';
    const threeDisplay = viewMode === 'Total' ? `${stats.threeMade}/${stats.threeAttempted}` : threePrev;

    const ftPrev = stats.ftAttempted > 0 ? ((stats.ftMade / stats.ftAttempted) * 100).toFixed(1) + '%' : '0.0%';
    const ftDisplay = viewMode === 'Total' ? `${stats.ftMade}/${stats.ftAttempted}` : ftPrev;

    const overall = calculateOverall(player);

    const playerAwards = React.useMemo(() => {
        const awards: string[] = [];
        awardsHistory.forEach(history => {
            // ... awards logic same as before ...
            if (history.mvp.playerId === player.id) awards.push(`${history.year} MVP`);
            if (history.roty.playerId === player.id) awards.push(`${history.year} Rookie of the Year`);
            if (history.dpoy.playerId === player.id) awards.push(`${history.year} DPOY`);
            if (history.mip.playerId === player.id) awards.push(`${history.year} MIP`);
            if (history.finalsMvp?.playerId === player.id) awards.push(`${history.year} Finals MVP`);
            if (history.allStars.west.some(p => p.playerId === player.id) || history.allStars.east.some(p => p.playerId === player.id)) {
                awards.push(`${history.year} All-Star`);
            }
            if (history.champion) {
                const wasOnTeam = player.careerStats.some(s => s.season === history.year && s.teamId === history.champion!.teamId);
                if (wasOnTeam) {
                    awards.push(`${history.year} Champion`);
                }
            }
        });
        return Array.from(new Set(awards));
    }, [awardsHistory, player.id, player.careerStats]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />

                {!isUserTeam && onTradeFor && (
                    <button onClick={() => onTradeFor(player.id)} style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Trade For
                    </button>
                )}
                {isUserTeam && (
                    <button onClick={onShop} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <DollarSign size={16} /> Shop Player
                    </button>
                )}
            </div>

            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {/* Header Section */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            {/* Name */}
                            <h1 style={{ margin: 0, color: 'var(--text)', fontSize: '2rem', lineHeight: 1.2 }}>{player.firstName} {player.lastName}</h1>

                            {/* Description / Archetype / Personality */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {player.archetype && (
                                    <div style={{
                                        marginTop: '8px',
                                        display: 'inline-block',
                                        background: 'var(--surface-active)',
                                        border: '1px solid var(--border)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {player.archetype}
                                    </div>
                                )}
                                {player.personality && (
                                    <div style={{
                                        marginTop: '8px',
                                        display: 'inline-block',
                                        background: 'var(--surface-active)',
                                        border: `1px solid var(--primary)`,
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        color: 'var(--primary)',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {player.personality}
                                    </div>
                                )}
                            </div>

                            {/* Position & Team & Jersey */}
                            <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: 'var(--text)',
                                    background: 'var(--surface-active)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border)'
                                }}>
                                    #{player.jerseyNumber !== undefined ? player.jerseyNumber : '??'}
                                </span>
                                <span>{player.position}{player.secondaryPosition ? ` / ${player.secondaryPosition}` : ''}</span>
                                <span style={{ opacity: 0.5 }}>|</span>
                                <span
                                    onClick={() => team && onTeamClick && onTeamClick(team.id)}
                                    style={{
                                        cursor: team && onTeamClick ? 'pointer' : 'default',
                                        color: team && onTeamClick ? 'var(--primary)' : 'inherit',
                                        textDecoration: team && onTeamClick ? 'underline' : 'none'
                                    }}
                                >
                                    {team ? `${team.city} ${team.name}` : 'Free Agent'}
                                </span>
                            </div>

                            {/* Age, Height, Weight */}
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                Age: {player.age} | Height: {player.height}cm | Weight: {player.weight}kg
                            </div>

                            {/* Acquired Info */}
                            {player.acquisition && (
                                <div style={{ marginTop: '5px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <span style={{ opacity: 0.7 }}>Acquired:</span> <strong style={{ color: 'var(--text)' }}>{player.acquisition.year}</strong> via <span style={{ textTransform: 'capitalize', color: 'var(--text)' }}>{player.acquisition.type.replace('_', ' ')}</span>
                                    {player.acquisition.details && <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>{player.acquisition.details}</span>}
                                    {player.acquisition.previousTeamId && (
                                        <span style={{ marginLeft: '4px' }}>
                                            from {teams.find(t => t.id === player.acquisition!.previousTeamId)?.abbreviation || 'UNK'}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Contract Box */}
                            {contract && (
                                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface-glass)', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border)', color: 'var(--text)', display: 'inline-block' }}>
                                    <strong style={{ color: 'var(--primary)' }}>Contract:</strong> {formatMoney(contract.amount)} / yr  &bull;  {contract.yearsLeft} Years Left
                                </div>
                            )}
                        </div>

                        {/* Overall Rating Box */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: getRatingColor(overall), lineHeight: 1 }}>
                                {isProspect && !isRevealed ? getFuzzyPotential(player.potential, scoutingPoints) : overall}
                            </div>

                            {/* Morale Icon (Minimal SVG) */}
                            <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px' }}>
                                    {player.morale >= 75 ? (
                                        // Happy / Green
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                            <line x1="9" y1="9" x2="9.01" y2="9" />
                                            <line x1="15" y1="9" x2="15.01" y2="9" />
                                        </svg>
                                    ) : player.morale >= 45 ? (
                                        // Neutral / White
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="8" y1="15" x2="16" y2="15" />
                                            <line x1="9" y1="9" x2="9.01" y2="9" />
                                            <line x1="15" y1="9" x2="15.01" y2="9" />
                                        </svg>
                                    ) : (
                                        // Sad / Red
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                                            <line x1="9" y1="9" x2="9.01" y2="9" />
                                            <line x1="15" y1="9" x2="15.01" y2="9" />
                                        </svg>
                                    )}
                                </div>

                                {player.demandTrade && <span style={{ color: 'var(--danger)', fontSize: '0.6rem', fontWeight: 'bold', marginTop: '2px', textTransform: 'uppercase' }}>Wants Out</span>}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                {isProspect ? 'Proj. Potential' : 'OVR'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Season Stats */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid var(--primary)', paddingBottom: '5px' }}>
                        <h3 style={{ margin: 0, color: 'var(--text)' }}>Season Stats</h3>
                        <div style={{ display: 'flex', background: 'var(--surface-active)', borderRadius: '20px', padding: '2px', border: '1px solid var(--border)' }}>
                            <button
                                onClick={() => setViewMode('Average')}
                                style={{
                                    background: viewMode === 'Average' ? 'var(--primary)' : 'transparent',
                                    color: viewMode === 'Average' ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '18px',
                                    padding: '4px 12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Per Game
                            </button>
                            <button
                                onClick={() => setViewMode('Total')}
                                style={{
                                    background: viewMode === 'Total' ? 'var(--primary)' : 'transparent',
                                    color: viewMode === 'Total' ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '18px',
                                    padding: '4px 12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Totals
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px 10px', textAlign: 'center', background: 'var(--surface-active)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{ppg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'PTS' : 'TPTS'}</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{apg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'AST' : 'TAST'}</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{rpg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'REB' : 'TREB'}</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{mpg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MIN</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{spg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'STL' : 'TSTL'}</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{bpg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'BLK' : 'TBLK'}</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>{topg}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewMode === 'Average' ? 'TO' : 'TTO'}</div></div>

                        <div><div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text)' }}>{fgDisplay}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FG</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text)' }}>{threeDisplay}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>3PT</div></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text)' }}>{ftDisplay}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FT</div></div>
                    </div>
                </div>

                {/* Chart Section with Toggle */}
                <div style={{ marginBottom: '30px', background: 'var(--surface-glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', background: 'var(--surface-active)', borderRadius: '20px', padding: '2px', border: '1px solid var(--border)' }}>
                            <button
                                onClick={() => setStatsView('Skills')}
                                style={{
                                    background: statsView === 'Skills' ? 'var(--primary)' : 'transparent',
                                    color: statsView === 'Skills' ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '18px',
                                    padding: '4px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Skill Hexagon
                            </button>
                            <button
                                onClick={() => setStatsView('Development')}
                                style={{
                                    background: statsView === 'Development' ? 'var(--primary)' : 'transparent',
                                    color: statsView === 'Development' ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '18px',
                                    padding: '4px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Development Trend
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {statsView === 'Skills' ? (
                            <PlayerRadarChart player={player} />
                        ) : (
                            <PlayerTrendGraph player={player} />
                        )}
                    </div>
                </div>

                {/* ATTRIBUTES: New MSSI Profile */}
                <div style={{ marginBottom: '30px', background: 'var(--surface-active)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Skill Profile</span>
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {/* OFFENSE */}
                        <div style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Offense</h4>
                            <AttributeRow label="Finishing" value={player.attributes.finishing} prevValue={player.previousAttributes?.finishing} />
                            <AttributeRow label="Mid-Range" value={player.attributes.midRange} prevValue={player.previousAttributes?.midRange} />
                            <AttributeRow label="3PT Shot" value={player.attributes.threePointShot} prevValue={player.previousAttributes?.threePointShot} />
                            <AttributeRow label="Free Throw" value={player.attributes.freeThrow} prevValue={player.previousAttributes?.freeThrow} />
                        </div>

                        {/* PLAYMAKING & PHYSICAL */}
                        <div style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Playmaking & Phys</h4>
                            <AttributeRow label="Playmaking" value={player.attributes.playmaking} prevValue={player.previousAttributes?.playmaking} />
                            <AttributeRow label="Ball Hand." value={player.attributes.ballHandling} prevValue={player.previousAttributes?.ballHandling} />
                            <AttributeRow label="IQ" value={player.attributes.basketballIQ} prevValue={player.previousAttributes?.basketballIQ} />
                            <AttributeRow label="Athleticism" value={player.attributes.athleticism} prevValue={player.previousAttributes?.athleticism} />
                        </div>

                        {/* DEFENSE & REBOUNDING */}
                        <div style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Defense & Reb</h4>
                            <AttributeRow label="Int. Def" value={player.attributes.interiorDefense} prevValue={player.previousAttributes?.interiorDefense} />
                            <AttributeRow label="Per. Def" value={player.attributes.perimeterDefense} prevValue={player.previousAttributes?.perimeterDefense} />
                            <AttributeRow label="Stealing" value={player.attributes.stealing} prevValue={player.previousAttributes?.stealing} />
                            <AttributeRow label="Blocking" value={player.attributes.blocking} prevValue={player.previousAttributes?.blocking} />
                            <AttributeRow label="Off. Reb" value={player.attributes.offensiveRebound} prevValue={player.previousAttributes?.offensiveRebound} />
                            <AttributeRow label="Def. Reb" value={player.attributes.defensiveRebound} prevValue={player.previousAttributes?.defensiveRebound} />
                        </div>
                    </div>
                </div>

                {/* TENDENCY TREE (Dynamic Role-Based) */}
                <div style={{ marginBottom: '30px', background: 'var(--surface-active)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                        Tendency Tree <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 'normal' }}>(Dynamic based on {player.minutes} min role)</span>
                    </h3>

                    {(() => {
                        const t = calculateTendencies(player, player.minutes, teammates);

                        // Helper for bar color
                        const getBarColor = (val: number) => {
                            if (val >= 90) return '#e74c3c'; // Aggressive/Elite
                            if (val >= 75) return '#f39c12'; // High
                            if (val >= 60) return '#2ecc71'; // Moderate
                            return '#3498db'; // Low/Passive
                        };

                        const TendencyRow = ({ label, value }: { label: string, value: number }) => {
                            const rounded = Math.round(value);
                            return (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text)' }}>
                                        <span>{label}</span>
                                        <span style={{ fontWeight: 'bold' }}>{rounded}</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${rounded}%`,
                                            height: '100%',
                                            background: getBarColor(rounded),
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        };

                        return (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Primary Aggression</h4>
                                    <TendencyRow label="Shooting" value={t.shooting} />
                                    <TendencyRow label="Passing" value={t.passing} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Shot Preference</h4>
                                    <TendencyRow label="Inside Attempts" value={t.inside} />
                                    <TendencyRow label="Outside Attempts" value={t.outside} />
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Legacy Attributes (Hidden/Collapsed or Removed - Removing for Lite mode as requested "Clean Slate") */}

                {/* Badges Section */}
                {player.badges && Object.keys(player.badges).length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '5px', marginBottom: '15px', color: 'var(--text)' }}>Player Badges</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {Object.entries(player.badges).map(([name, rank]) => {
                                const rankStr = rank as string;
                                let bgColor = '#444';
                                let textColor = '#fff';
                                if (rankStr.toLowerCase() === 'bronze') bgColor = '#cd7f32';
                                if (rankStr.toLowerCase() === 'silver') bgColor = '#c0c0c0';
                                if (rankStr.toLowerCase() === 'gold') { bgColor = '#ffd700'; textColor = '#000'; }
                                if (rankStr.toLowerCase() === 'hall_of_fame' || rankStr.toLowerCase() === 'platinum') { bgColor = '#e5e4e2'; textColor = '#000'; }

                                return (
                                    <div key={name} style={{
                                        background: bgColor,
                                        color: textColor,
                                        padding: '4px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <span>{name.replace(/_/g, ' ')}</span>
                                        <span style={{ opacity: 0.7, fontSize: '0.6rem' }}>({rankStr})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Career History Section */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid var(--primary)', paddingBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h3 style={{ margin: 0, color: 'var(--text)' }}>Career History</h3>
                            <div style={{ display: 'flex', background: 'var(--surface-active)', borderRadius: '20px', padding: '2px', border: '1px solid var(--border)' }}>
                                <button
                                    onClick={() => setCareerMode('Regular')}
                                    style={{
                                        background: careerMode === 'Regular' ? 'var(--primary)' : 'transparent',
                                        color: careerMode === 'Regular' ? '#fff' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '18px',
                                        padding: '4px 12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Reg. Season
                                </button>
                                <button
                                    onClick={() => setCareerMode('Playoff')}
                                    style={{
                                        background: careerMode === 'Playoff' ? 'var(--primary)' : 'transparent',
                                        color: careerMode === 'Playoff' ? '#fff' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '18px',
                                        padding: '4px 12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Playoffs
                                </button>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Showing {viewMode === 'Average' ? 'Averages' : 'Totals'}
                        </div>
                    </div>

                    {player.careerStats && player.careerStats.length > 0 ? (
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--text)', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--surface-active)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '8px', minWidth: '60px' }}>Season</th>
                                        <th style={{ padding: '8px', minWidth: '50px' }}>Team</th>
                                        <th style={{ padding: '8px' }}>GP</th>
                                        <th style={{ padding: '8px' }}>PTS</th>
                                        <th style={{ padding: '8px' }}>AST</th>
                                        <th style={{ padding: '8px' }}>REB</th>
                                        <th style={{ padding: '8px' }}>MIN</th>
                                        <th style={{ padding: '8px' }}>STL</th>
                                        <th style={{ padding: '8px' }}>BLK</th>
                                        <th style={{ padding: '8px' }}>TO</th>
                                        <th style={{ padding: '8px' }}>FG</th>
                                        <th style={{ padding: '8px' }}>3PT</th>
                                        <th style={{ padding: '8px' }}>FT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {player.careerStats
                                        .filter(s => careerMode === 'Playoff' ? (s.isPlayoffs === true) : (!s.isPlayoffs))
                                        .map((stat, idx) => {
                                            const team = teams.find(t => t.id === stat.teamId);
                                            const gp = stat.gamesPlayed || 1;
                                            const isAvg = viewMode === 'Average';

                                            return (
                                                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{stat.season}</td>
                                                    <td style={{ padding: '8px' }}>{team ? team.abbreviation : 'UNK'}</td>
                                                    <td style={{ padding: '8px' }}>{stat.gamesPlayed}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.points / gp).toFixed(1) : stat.points}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.assists / gp).toFixed(1) : stat.assists}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.rebounds / gp).toFixed(1) : stat.rebounds}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.minutes / gp).toFixed(1) : Math.round(stat.minutes)}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.steals / gp).toFixed(1) : stat.steals}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.blocks / gp).toFixed(1) : stat.blocks}</td>
                                                    <td style={{ padding: '8px' }}>{isAvg ? (stat.turnovers / gp).toFixed(1) : stat.turnovers}</td>
                                                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                                                        {isAvg
                                                            ? (stat.fgAttempted > 0 ? ((stat.fgMade / stat.fgAttempted) * 100).toFixed(1) + '%' : '-')
                                                            : `${stat.fgMade}/${stat.fgAttempted}`
                                                        }
                                                    </td>
                                                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                                                        {isAvg
                                                            ? (stat.threeAttempted > 0 ? ((stat.threeMade / stat.threeAttempted) * 100).toFixed(1) + '%' : '-')
                                                            : `${stat.threeMade}/${stat.threeAttempted}`
                                                        }
                                                    </td>
                                                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                                                        {isAvg
                                                            ? (stat.ftAttempted > 0 ? ((stat.ftMade / stat.ftAttempted) * 100).toFixed(1) + '%' : '-')
                                                            : `${stat.ftMade}/${stat.ftAttempted}`
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No career history available yet.</p>
                    )}
                </div>

                {/* Awards Section */}
                <div>
                    <h3 style={{ borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '5px', marginBottom: '15px', color: 'var(--text)' }}>Awards</h3>
                    {playerAwards.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {playerAwards.map((award, index) => (
                                <div key={index} style={{
                                    background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
                                    color: '#000',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {award}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No awards won yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
