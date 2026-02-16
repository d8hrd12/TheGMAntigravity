import React, { useState } from 'react';
import type { MatchResult, PlayerStats } from './SimulationTypes';
import type { Team } from '../../models/Team';
import { formatDate } from '../../utils/dateUtils';
import { BackButton } from '../ui/BackButton';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';

interface BoxScoreViewProps {
    match: MatchResult;
    homeTeam: Team | undefined;
    awayTeam: Team | undefined;
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
}

const StatRow = ({ player, onSelectPlayer, isBest }: { player: PlayerStats, onSelectPlayer: (id: string) => void, isBest: boolean }) => (
    <tr
        key={player.playerId}
        style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'background 0.2s',
            background: isBest ? 'rgba(255,215,0,0.05)' : 'transparent'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = isBest ? 'rgba(255,215,0,0.05)' : 'transparent'}
    >
        <td
            onClick={() => onSelectPlayer(player.playerId)}
            style={{ textAlign: 'left', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{player.name}</div>
        </td>
        <td style={{ padding: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>{player.minutes.toFixed(1)}</td>
        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text)', textAlign: 'center', fontSize: '1.05rem' }}>{player.points}</td>
        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{player.rebounds}</td>
        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{player.assists}</td>
        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{player.turnovers}</td>
        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{player.steals}</td>
        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{player.blocks}</td>
        <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{player.ftMade}-{player.ftAttempted}</td>
        <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{player.fgMade}-{player.fgAttempted}</td>
        <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{player.threeMade}-{player.threeAttempted}</td>
        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: player.plusMinus > 0 ? '#2ecc71' : player.plusMinus < 0 ? '#e74c3c' : '#888' }}>
            {player.plusMinus > 0 ? '+' : ''}{player.plusMinus}
        </td>
    </tr>
);

const TeamStatsTable = ({ stats, team, onSelectPlayer }: { stats: PlayerStats[], team: Team | undefined, onSelectPlayer: (id: string) => void }) => {
    const [sortKey, setSortKey] = useState<keyof PlayerStats>('points');
    const [sortDesc, setSortDesc] = useState(true);

    const handleSort = (key: keyof PlayerStats) => {
        if (sortKey === key) {
            setSortDesc(!sortDesc);
        } else {
            setSortKey(key);
            setSortDesc(true);
        }
    };

    const sortedStats = [...stats].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        // Assume numbers
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortDesc ? numB - numA : numA - numB;
    });

    const topScorerId = [...stats].sort((a, b) => b.points - a.points)[0]?.playerId;

    const Header = ({ label, sk, width }: { label: string, sk?: keyof PlayerStats, width?: string }) => (
        <th
            onClick={() => sk && handleSort(sk)}
            style={{
                textAlign: label === 'Player' ? 'left' : 'center',
                padding: '12px',
                width: width,
                cursor: sk ? 'pointer' : 'default',
                userSelect: 'none',
                color: sortKey === sk ? 'var(--primary)' : 'inherit',
                transition: 'color 0.2s'
            }}
        >
            {label} {sortKey === sk && (sortDesc ? '↓' : '↑')}
        </th>
    );

    return (
        <div className="glass-panel" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            {/* Watermark Logo */}
            {team?.logo && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '400px',
                    backgroundImage: `url(${team.logo})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}

            <div style={{
                padding: '16px',
                background: `linear-gradient(90deg, ${team?.colors?.primary || 'var(--primary)'}40, transparent)`,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {team?.city} {team?.name}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>BOX SCORE</div>
            </div>

            <div style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            <Header label="Player" width="auto" />
                            <Header label="MIN" sk="minutes" width="40px" />
                            <Header label="PTS" sk="points" width="40px" />
                            <Header label="REB" sk="rebounds" width="40px" />
                            <Header label="AST" sk="assists" width="40px" />
                            <Header label="TO" sk="turnovers" width="40px" />
                            <Header label="STL" sk="steals" width="40px" />
                            <Header label="BLK" sk="blocks" width="40px" />
                            <Header label="FT" width="70px" />
                            <Header label="FG" width="70px" />
                            <Header label="3PT" width="70px" />
                            <Header label="+/-" sk="plusMinus" width="40px" />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStats.map(p => (
                            <StatRow key={p.playerId} player={p} onSelectPlayer={onSelectPlayer} isBest={p.playerId === topScorerId} />
                        ))}
                        {/* Totals Row */}
                        <tr style={{ borderTop: '2px solid rgba(255,255,255,0.2)', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 16px', color: 'var(--text)' }}>TOTALS</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{Math.round(stats.reduce((acc, p) => acc + (p.minutes || 0), 0))}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.points || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.rebounds || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.assists || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.turnovers || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.steals || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{stats.reduce((acc, p) => acc + (p.blocks || 0), 0)}</td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace' }}>
                                {stats.reduce((acc, p) => acc + (p.ftMade || 0), 0)}-{stats.reduce((acc, p) => acc + (p.ftAttempted || 0), 0)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace' }}>
                                {stats.reduce((acc, p) => acc + (p.fgMade || 0), 0)}-{stats.reduce((acc, p) => acc + (p.fgAttempted || 0), 0)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace' }}>
                                {stats.reduce((acc, p) => acc + (p.threeMade || 0), 0)}-{stats.reduce((acc, p) => acc + (p.threeAttempted || 0), 0)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const BoxScoreView: React.FC<BoxScoreViewProps> = ({ match, homeTeam, awayTeam, onBack, onSelectPlayer }) => {
    const homeStats = Object.values(match.boxScore.homeStats);
    const awayStats = Object.values(match.boxScore.awayStats);

    // Determine winner for styling
    const homeWon = match.winnerId === homeTeam?.id;

    // Team Colors with fallback
    const homeColor = homeTeam?.colors?.primary || '#3498db';
    const awayColor = awayTeam?.colors?.primary || '#e74c3c';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            paddingBottom: '40px'
        }}>
            <div style={{ padding: '20px' }}>
                <PageHeader
                    title="Box Score"
                    onBack={onBack}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                    <Calendar size={14} />
                    {match.date instanceof Date ? formatDate(match.date) : formatDate(new Date(match.date))}
                </div>
            </div>

            {/* Hero Scoreboard */}
            <div style={{
                margin: '0 20px 30px 20px',
                borderRadius: '24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '200px'
            }}>
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: `linear-gradient(135deg, ${awayColor}15, transparent)` }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: `linear-gradient(-135deg, ${homeColor}15, transparent)` }} />

                <div style={{ position: 'relative', padding: '30px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>

                    {/* Away Team */}
                    <div style={{ textAlign: 'center', flex: 1, zIndex: 2, minWidth: 0 }}>
                        {awayTeam?.logo && <img src={awayTeam.logo} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', marginBottom: '8px' }} />}
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {awayTeam?.city}
                        </div>
                        <div style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', fontWeight: 900, lineHeight: 1, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {awayTeam?.name}
                        </div>
                        <div style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 800, color: awayColor, lineHeight: 1, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            {match.awayScore}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 2, padding: '0 5px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 200, opacity: 0.3 }}>VS</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>FINAL</div>
                    </div>

                    {/* Home Team */}
                    <div style={{ textAlign: 'center', flex: 1, zIndex: 2, minWidth: 0 }}>
                        {homeTeam?.logo && <img src={homeTeam.logo} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', marginBottom: '8px' }} />}
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {homeTeam?.city}
                        </div>
                        <div style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', fontWeight: 900, lineHeight: 1, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {homeTeam?.name}
                        </div>
                        <div style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 800, color: homeColor, lineHeight: 1, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            {match.homeScore}
                        </div>
                    </div>

                </div>
            </div>

            {/* Stats Grids */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'grid', gap: '30px' }}>
                <TeamStatsTable stats={awayStats} team={awayTeam} onSelectPlayer={onSelectPlayer} />
                <TeamStatsTable stats={homeStats} team={homeTeam} onSelectPlayer={onSelectPlayer} />
            </div>
        </div>
    );
};
