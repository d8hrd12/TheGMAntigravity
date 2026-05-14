import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { PageHeader } from '../ui/PageHeader';
import { Search, X, Users, Activity, BarChart3, ChevronRight } from 'lucide-react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

interface PlayerSelectorProps {
    players: Player[];
    teams: Team[];
    onSelect: (player: Player) => void;
    onClose: () => void;
    leagueType: 'NBA' | 'EURO';
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({ players, teams, onSelect, onClose, leagueType }) => {
    const [search, setSearch] = useState('');
    const [selectedLeague, setSelectedLeague] = useState<'EuroLeague' | 'EuroCup'>( 'EuroLeague');

    const filteredPlayers = useMemo(() => {
        const searchLower = search.toLowerCase();
        return players.filter(p => {
            if (leagueType === 'EURO') {
                const team = teams.find(t => t.id === p.teamId);
                if (!team || team.conference !== selectedLeague) return false;
            }
            const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
            const teamName = teams.find(t => t.id === p.teamId)?.name.toLowerCase() || 'free agent';
            return fullName.includes(searchLower) || teamName.includes(searchLower);
        }).sort((a, b) => calculateOverall(b) - calculateOverall(a));
    }, [players, teams, search, selectedLeague, leagueType]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '100%', maxWidth: '500px', height: '80vh',
                background: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 900 }}>Select Player</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {leagueType === 'EURO' && (
                    <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', background: 'rgba(0,0,0,0.2)' }}>
                        {(['EuroLeague', 'EuroCup'] as const).map(l => (
                            <button
                                key={l}
                                onClick={() => setSelectedLeague(l)}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                                    background: selectedLeague === l ? 'var(--team-primary)' : 'var(--bg-card-hover)',
                                    color: selectedLeague === l ? '#fff' : 'var(--text-dim)',
                                    fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
                                }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ padding: '16px 20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="text"
                            placeholder="Search players..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px',
                                border: '1px solid var(--border-color)', background: 'var(--bg-main)',
                                color: 'var(--text-main)', outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 20px' }}>
                    {filteredPlayers.map(p => (
                        <div
                            key={p.id}
                            onClick={() => onSelect(p)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            className="list-row-hover"
                        >
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--team-primary)', fontSize: '0.9rem' }}>
                                {calculateOverall(p)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.firstName} {p.lastName.toUpperCase()}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                                    {teams.find(t => t.id === p.teamId)?.abbreviation || 'FA'} • {p.position} • {p.age}yo
                                </div>
                            </div>
                            <ChevronRight size={16} color="var(--text-dim)" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PlayerCompareView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { players, teams, leagueType, userTeamId } = useGame();
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [selectingSlot, setSelectingSlot] = useState<1 | 2 | null>(null);
    const [viewMode, setViewMode] = useState<'Stats' | 'Attributes'>('Stats');

    const formatStat = (val: number | undefined) => {
        if (val === undefined) return '0.0';
        return val.toFixed(1);
    };

    const formatPct = (made: number | undefined, att: number | undefined) => {
        if (!att || att === 0) return '0%';
        return ((made || 0) / att * 100).toFixed(1) + '%';
    };

    const getBetterColor = (val1: number, val2: number) => {
        if (val1 > val2) return '#2ecc71';
        if (val1 < val2) return 'inherit';
        return 'inherit';
    };

    const CompareRow = ({ label, val1, val2, display1, display2, isBetterHigh = true }: { label: string, val1: number, val2: number, display1: string | number, display2: string | number, isBetterHigh?: boolean }) => {
        const color1 = isBetterHigh ? getBetterColor(val1, val2) : getBetterColor(val2, val1);
        const color2 = isBetterHigh ? getBetterColor(val2, val1) : getBetterColor(val1, val2);

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'right', fontWeight: 800, color: color1, fontSize: '1.1rem' }}>{display1}</div>
                <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                <div style={{ textAlign: 'left', fontWeight: 800, color: color2, fontSize: '1.1rem' }}>{display2}</div>
            </div>
        );
    };

    return (
        <div style={{ padding: '0 20px 40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)' }}>
            <PageHeader
                title="Player Comparison"
                subtitle="Compare skills and season performance side-by-side"
                onBack={onBack}
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {/* Player 1 Slot */}
                <div 
                    onClick={() => setSelectingSlot(1)}
                    style={{ flex: 1, minWidth: '280px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {player1 ? (
                        <>
                            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--team-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, margin: '0 auto 16px' }}>
                                {calculateOverall(player1)}
                            </div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 900 }}>{player1.firstName} {player1.lastName.toUpperCase()}</h3>
                            <p style={{ margin: 0, color: 'var(--text-dim)', fontWeight: 700, fontSize: '0.85rem' }}>{teams.find(t => t.id === player1.teamId)?.name || 'Free Agent'}</p>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', padding: '20px 0' }}>
                            <Users size={40} opacity={0.3} />
                            <span style={{ fontWeight: 800 }}>Select First Player</span>
                        </div>
                    )}
                </div>

                {/* VS Divider */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-dim)', opacity: 0.5 }}>VS</div>

                {/* Player 2 Slot */}
                <div 
                    onClick={() => setSelectingSlot(2)}
                    style={{ flex: 1, minWidth: '280px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {player2 ? (
                        <>
                            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, margin: '0 auto 16px' }}>
                                {calculateOverall(player2)}
                            </div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 900 }}>{player2.firstName} {player2.lastName.toUpperCase()}</h3>
                            <p style={{ margin: 0, color: 'var(--text-dim)', fontWeight: 700, fontSize: '0.85rem' }}>{teams.find(t => t.id === player2.teamId)?.name || 'Free Agent'}</p>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', padding: '20px 0' }}>
                            <Users size={40} opacity={0.3} />
                            <span style={{ fontWeight: 800 }}>Select Second Player</span>
                        </div>
                    )}
                </div>
            </div>

            {player1 && player2 && (
                <div className="animate-fade">
                    {/* View Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                            <button 
                                onClick={() => setViewMode('Stats')}
                                style={{ 
                                    padding: '10px 24px', borderRadius: '10px', border: 'none',
                                    background: viewMode === 'Stats' ? 'var(--text-main)' : 'transparent',
                                    color: viewMode === 'Stats' ? '#fff' : 'var(--text-dim)',
                                    fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <BarChart3 size={18} /> Per Game Stats
                            </button>
                            <button 
                                onClick={() => setViewMode('Attributes')}
                                style={{ 
                                    padding: '10px 24px', borderRadius: '10px', border: 'none',
                                    background: viewMode === 'Attributes' ? 'var(--text-main)' : 'transparent',
                                    color: viewMode === 'Attributes' ? '#fff' : 'var(--text-dim)',
                                    fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <Activity size={18} /> Attributes
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
                        {viewMode === 'Stats' ? (
                            <>
                                {(() => {
                                    const s1 = player1.seasonStats;
                                    const s2 = player2.seasonStats;
                                    const gp1 = s1.gamesPlayed || 1;
                                    const gp2 = s2.gamesPlayed || 1;

                                    return (
                                        <>
                                            <CompareRow label="Points" val1={s1.points / gp1} val2={s2.points / gp2} display1={formatStat(s1.points / gp1)} display2={formatStat(s2.points / gp2)} />
                                            <CompareRow label="Assists" val1={s1.assists / gp1} val2={s2.assists / gp2} display1={formatStat(s1.assists / gp1)} display2={formatStat(s2.assists / gp2)} />
                                            <CompareRow label="Rebounds" val1={s1.rebounds / gp1} val2={s2.rebounds / gp2} display1={formatStat(s1.rebounds / gp1)} display2={formatStat(s2.rebounds / gp2)} />
                                            <CompareRow label="Steals" val1={s1.steals / gp1} val2={s2.steals / gp2} display1={formatStat(s1.steals / gp1)} display2={formatStat(s2.steals / gp2)} />
                                            <CompareRow label="Blocks" val1={s1.blocks / gp1} val2={s2.blocks / gp2} display1={formatStat(s1.blocks / gp1)} display2={formatStat(s2.blocks / gp2)} />
                                            <CompareRow label="Turnovers" val1={s1.turnovers / gp1} val2={s2.turnovers / gp2} display1={formatStat(s1.turnovers / gp1)} display2={formatStat(s2.turnovers / gp2)} isBetterHigh={false} />
                                            <CompareRow label="FG%" val1={s1.fgAttempted > 0 ? s1.fgMade / s1.fgAttempted : 0} val2={s2.fgAttempted > 0 ? s2.fgMade / s2.fgAttempted : 0} display1={formatPct(s1.fgMade, s1.fgAttempted)} display2={formatPct(s2.fgMade, s2.fgAttempted)} />
                                            <CompareRow label="3P%" val1={s1.threeAttempted > 0 ? s1.threeMade / s1.threeAttempted : 0} val2={s2.threeAttempted > 0 ? s2.threeMade / s2.threeAttempted : 0} display1={formatPct(s1.threeMade, s1.threeAttempted)} display2={formatPct(s2.threeMade, s2.threeAttempted)} />
                                            <CompareRow label="FT%" val1={s1.ftAttempted > 0 ? s1.ftMade / s1.ftAttempted : 0} val2={s2.ftAttempted > 0 ? s2.ftMade / s2.ftAttempted : 0} display1={formatPct(s1.ftMade, s1.ftAttempted)} display2={formatPct(s2.ftMade, s2.ftAttempted)} />
                                        </>
                                    );
                                })()}
                            </>
                        ) : (
                            <>
                                <CompareRow label="Finishing" val1={player1.attributes.finishing} val2={player2.attributes.finishing} display1={player1.attributes.finishing} display2={player2.attributes.finishing} />
                                <CompareRow label="Mid-Range" val1={player1.attributes.midRange} val2={player2.attributes.midRange} display1={player1.attributes.midRange} display2={player2.attributes.midRange} />
                                <CompareRow label="3PT Shot" val1={player1.attributes.threePointShot} val2={player2.attributes.threePointShot} display1={player1.attributes.threePointShot} display2={player2.attributes.threePointShot} />
                                <CompareRow label="Playmaking" val1={player1.attributes.playmaking} val2={player2.attributes.playmaking} display1={player1.attributes.playmaking} display2={player2.attributes.playmaking} />
                                <CompareRow label="Ball Handling" val1={player1.attributes.ballHandling} val2={player2.attributes.ballHandling} display1={player1.attributes.ballHandling} display2={player2.attributes.ballHandling} />
                                <CompareRow label="Interior Def" val1={player1.attributes.interiorDefense} val2={player2.attributes.interiorDefense} display1={player1.attributes.interiorDefense} display2={player2.attributes.interiorDefense} />
                                <CompareRow label="Perimeter Def" val1={player1.attributes.perimeterDefense} val2={player2.attributes.perimeterDefense} display1={player1.attributes.perimeterDefense} display2={player2.attributes.perimeterDefense} />
                                <CompareRow label="IQ" val1={player1.attributes.basketballIQ} val2={player2.attributes.basketballIQ} display1={player1.attributes.basketballIQ} display2={player2.attributes.basketballIQ} />
                                <CompareRow label="Athleticism" val1={player1.attributes.athleticism} val2={player2.attributes.athleticism} display1={player1.attributes.athleticism} display2={player2.attributes.athleticism} />
                            </>
                        )}
                    </div>
                </div>
            )}

            {selectingSlot && (
                <PlayerSelector 
                    players={players}
                    teams={teams}
                    leagueType={leagueType}
                    onClose={() => setSelectingSlot(null)}
                    onSelect={(p) => {
                        if (selectingSlot === 1) setPlayer1(p);
                        else setPlayer2(p);
                        setSelectingSlot(null);
                    }}
                />
            )}
        </div>
    );
};
