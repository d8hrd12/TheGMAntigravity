import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount } from '../../utils/contractUtils';
import { STYLE_DESCRIPTIONS, type Coach } from '../../models/Coach';

interface MidSeasonFreeAgentsProps {
    players: Player[];
    userTeam: Team;
    currentYear: number;
    onSign?: (playerId: string) => void;
    onBack?: () => void;
    onSelectPlayer: (playerId: string) => void;
}

const STYLE_ICONS: Record<string, string> = {
    'Pace and Space': '🚀',
    'Grit and Grind': '💪',
    'Triangle': '🔺',
    'Dribble Drive': '⚡',
    'Seven Seconds': '⏱️',
    'Princeton': '🎯',
    'Defensive Wall': '🛡️',
};

export const MidSeasonFreeAgents: React.FC<MidSeasonFreeAgentsProps> = ({ players, userTeam, currentYear, onSelectPlayer }) => {
    const { signPlayerWithContract, userHireCoach, salaryCap, coaches } = useGame();
    const [activeTab, setActiveTab] = React.useState<'players' | 'coaches'>('players');
    const [filterPos, setFilterPos] = React.useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [sortBy, setSortBy] = React.useState<'OVR' | 'PRICE' | 'AGE'>('OVR');
    const [showAffordableOnly, setShowAffordableOnly] = React.useState(false);
    const [coachSortBy, setCoachSortBy] = React.useState<'OVR' | 'OFF' | 'DEF' | 'DEV'>('OVR');
    const [expandedCoachId, setExpandedCoachId] = React.useState<string | null>(null);

    const calculateCost = (player: Player) => calculateContractAmount(player, salaryCap).amount;
    const formatMoney = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    const getArchetype = (p: Player) => {
        if (p.archetype) return p.archetype;
        const attr = p.attributes;
        const shooting = attr.threePointShot + attr.midRange;
        const finishing = attr.finishing + p.height / 10;
        const defense = attr.perimeterDefense + attr.interiorDefense + attr.blocking + attr.stealing;
        const playmaking = attr.playmaking + attr.ballHandling;
        const rebounding = attr.offensiveRebound + attr.defensiveRebound;
        if (rebounding > 170 && defense > 250) return 'Rim Protector';
        if (playmaking > 160) return 'Playmaker';
        if (shooting > 170) return 'Sharpshooter';
        if (finishing > 160 && p.position !== 'C') return 'Slasher';
        if (defense > 300) return 'Lockdown Defender';
        if (rebounding > 160) return 'Rebounder';
        return 'Balanced';
    };

    const getLastSeasonStats = (p: Player) => {
        const s = p.seasonStats.gamesPlayed > 0 ? p.seasonStats : (p.careerStats.length > 0 ? p.careerStats[p.careerStats.length - 1] : null);
        if (!s || s.gamesPlayed === 0) return 'Rookie';
        const ppg = (s.points / s.gamesPlayed).toFixed(1);
        const rpg = (s.rebounds / s.gamesPlayed).toFixed(1);
        const apg = (s.assists / s.gamesPlayed).toFixed(1);
        return `${ppg} PPG • ${rpg} RPG • ${apg} APG`;
    };

    // Players
    const freeAgents = players.filter(p => !p.teamId || p.teamId === '');
    let filteredAgents = filterPos === 'All' ? freeAgents : freeAgents.filter(p => p.position === filterPos);
    if (showAffordableOnly) filteredAgents = filteredAgents.filter(p => calculateCost(p) <= userTeam.salaryCapSpace);
    const sortedFreeAgents = [...filteredAgents].sort((a, b) => {
        const ovrA = (a.attributes.finishing + a.attributes.threePointShot + a.attributes.perimeterDefense);
        const ovrB = (b.attributes.finishing + b.attributes.threePointShot + b.attributes.perimeterDefense);
        if (sortBy === 'PRICE') return calculateCost(b) - calculateCost(a);
        if (sortBy === 'AGE') return a.age - b.age;
        return ovrB - ovrA;
    });

    // Coaches
    const freeAgentCoaches = (coaches || [])
        .filter(c => !c.teamId)
        .sort((a, b) => {
            if (coachSortBy === 'OFF') return b.rating.offense - a.rating.offense;
            if (coachSortBy === 'DEF') return b.rating.defense - a.rating.defense;
            if (coachSortBy === 'DEV') return b.rating.talentDevelopment - a.rating.talentDevelopment;
            return (b.rating.offense + b.rating.defense + b.rating.talentDevelopment) / 3 -
                (a.rating.offense + a.rating.defense + a.rating.talentDevelopment) / 3;
        });

    const rosterSize = players.filter(p => p.teamId === userTeam.id).length;
    const canSignGeneric = rosterSize < 13;

    const handleSign = (player: Player) => {
        if (!canSignGeneric) { alert('Roster full! Release players first.'); return; }
        const cost = calculateCost(player);
        if (cost > userTeam.salaryCapSpace) { alert('Not enough Cap Space!'); return; }
        if (confirm(`Sign ${player.lastName} for ${formatMoney(cost)} (1 Year)?`)) {
            signPlayerWithContract(player.id, { amount: cost, years: 1, role: 'Bench' });
        }
    };

    const userCoach = (coaches || []).find(c => c.id === userTeam.coachId && c.teamId === userTeam.id);

    const handleSignCoach = (coach: Coach) => {
        if (userCoach) { alert('You must fire your current coach before hiring a new one.'); return; }
        if (confirm(`Hire ${coach.firstName} ${coach.lastName} for ${formatMoney(coach.contract.salary)}/yr?`)) {
            userHireCoach(coach.id);
        }
    };

    return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Players / Coaches Toggle */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'var(--surface)', borderRadius: '10px', padding: '3px', width: 'fit-content', border: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('players')}
                    style={{
                        padding: '7px 20px', borderRadius: '7px', border: 'none', fontWeight: 700, fontSize: '0.85rem',
                        background: activeTab === 'players' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'players' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}
                >🏀 Players</button>
                <button
                    onClick={() => setActiveTab('coaches')}
                    style={{
                        padding: '7px 20px', borderRadius: '7px', border: 'none', fontWeight: 700, fontSize: '0.85rem',
                        background: activeTab === 'coaches' ? '#8b5cf6' : 'transparent',
                        color: activeTab === 'coaches' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                >
                    🎽 Coaches
                    <span style={{
                        background: activeTab === 'coaches' ? 'rgba(255,255,255,0.25)' : 'var(--surface-glass)',
                        color: activeTab === 'coaches' ? 'white' : 'var(--text-secondary)',
                        fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: '20px'
                    }}>{freeAgentCoaches.length}</span>
                </button>
            </div>

            {/* ── PLAYERS TAB ── */}
            {activeTab === 'players' && (
                <>
                    <div style={{ marginBottom: '15px' }}>
                        {/* Team Needs */}
                        <div style={{
                            background: 'var(--surface-glass)', border: '1px solid var(--border)', borderRadius: '12px',
                            padding: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
                        }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', marginRight: '10px', fontSize: '0.9rem' }}>Needs:</div>
                            {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => {
                                const count = players.filter(p => p.teamId === userTeam.id && p.position === pos).length;
                                const needsFill = count < 2;
                                return (
                                    <div key={pos} style={{
                                        background: 'var(--surface)', padding: '4px 8px', borderRadius: '8px',
                                        border: needsFill ? '1px solid var(--danger)' : '1px solid var(--border)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px'
                                    }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{pos}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: needsFill ? 'var(--danger)' : 'var(--text)' }}>{count}/2</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button onClick={() => setShowAffordableOnly(!showAffordableOnly)} style={{
                                    padding: '8px 12px', borderRadius: '8px',
                                    border: showAffordableOnly ? '1px solid var(--success)' : '1px solid var(--border)',
                                    background: showAffordableOnly ? 'rgba(46,204,113,0.2)' : 'var(--surface)',
                                    color: showAffordableOnly ? 'var(--success)' : 'var(--text)',
                                    cursor: 'pointer', fontWeight: showAffordableOnly ? 'bold' : 'normal', fontSize: '0.85rem'
                                }}>
                                    {showAffordableOnly ? '☑ Cap Fit' : '☐ Cap Fit'}
                                </button>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{
                                    padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
                                    background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.85rem'
                                }}>
                                    <option value="OVR">Sort: Rating</option>
                                    <option value="PRICE">Sort: Price</option>
                                    <option value="AGE">Sort: Age</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '10px 0 5px', flex: '2 1 auto' }}>
                            {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                                <button key={pos} onClick={() => setFilterPos(pos as any)} style={{
                                    padding: '6px 12px', borderRadius: '20px',
                                    border: filterPos === pos ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: filterPos === pos ? 'var(--primary)' : 'var(--surface)',
                                    color: filterPos === pos ? 'white' : 'var(--text)',
                                    cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap'
                                }}>{pos}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '10px' }}>
                        {sortedFreeAgents.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No free agents available.</div>
                        ) : (
                            sortedFreeAgents.map(p => {
                                const cost = calculateCost(p);
                                const canAfford = userTeam.salaryCapSpace >= cost;
                                const archetype = getArchetype(p);
                                const stats = getLastSeasonStats(p);
                                return (
                                    <div key={p.id} style={{
                                        background: 'var(--surface-glass)', border: '1px solid var(--border)',
                                        borderRadius: '12px', marginBottom: '10px', padding: '12px',
                                        display: 'flex', flexDirection: 'column', gap: '8px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div onClick={() => onSelectPlayer(p.id)}
                                                    style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                                                    {p.firstName} {p.lastName}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>{p.position}</span>
                                                    <span style={{ fontSize: '0.75rem', background: 'var(--surface)', padding: '2px 6px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                                        {archetype}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>OVR</div>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text)' }}>{calculateOverall(p)}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Last Season: <span style={{ color: 'var(--text)' }}>{stats}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: '500' }}>
                                            Asking: <span style={{ fontWeight: 700 }}>{formatMoney(cost)}</span> (Age: {p.age})
                                        </div>
                                        <button onClick={() => handleSign(p)} disabled={!canAfford || !canSignGeneric} style={{
                                            width: '100%', padding: '10px',
                                            background: (canAfford && canSignGeneric) ? 'var(--success)' : '#444',
                                            color: (canAfford && canSignGeneric) ? 'white' : 'var(--text-secondary)',
                                            border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold',
                                            cursor: (canAfford && canSignGeneric) ? 'pointer' : 'not-allowed',
                                            opacity: (canAfford && canSignGeneric) ? 1 : 0.6
                                        }}>
                                            {canSignGeneric ? (canAfford ? 'SIGN PLAYER' : 'CAP SPACE EXCEEDED') : 'ROSTER FULL'}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* ── COACHES TAB ── */}
            {activeTab === 'coaches' && (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Your current coach */}
                    {userCoach && (
                        <div style={{
                            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.35)',
                            borderRadius: '12px', padding: '12px 14px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Your Head Coach</div>
                                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{userCoach.firstName} {userCoach.lastName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    {STYLE_ICONS[userCoach.style] || '🏀'} {userCoach.style} • {userCoach.contract.yearsRemaining} yr{userCoach.contract.yearsRemaining !== 1 ? 's' : ''} left
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '14px' }}>
                                {[{ l: 'OFF', v: userCoach.rating.offense, c: '#3b82f6' }, { l: 'DEF', v: userCoach.rating.defense, c: '#ef4444' }, { l: 'DEV', v: userCoach.rating.talentDevelopment, c: '#f59e0b' }].map(r => (
                                    <div key={r.l} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: r.c }}>{r.v}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{r.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort buttons */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {(['OVR', 'OFF', 'DEF', 'DEV'] as const).map(s => (
                            <button key={s} onClick={() => setCoachSortBy(s)} style={{
                                padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.78rem',
                                background: coachSortBy === s ? '#8b5cf6' : 'var(--surface)',
                                color: coachSortBy === s ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}>{s}</button>
                        ))}
                    </div>

                    {/* Coach list */}
                    {freeAgentCoaches.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🎽</div>
                            <div>No free agent coaches available</div>
                        </div>
                    ) : freeAgentCoaches.map(coach => {
                        const ovr = Math.round((coach.rating.offense + coach.rating.defense + coach.rating.talentDevelopment) / 3);
                        const isExpanded = expandedCoachId === coach.id;
                        const ovrColor = ovr >= 80 ? 'var(--danger)' : ovr >= 70 ? 'var(--success)' : '#f1c40f';

                        return (
                            <div key={coach.id}
                                onClick={() => setExpandedCoachId(isExpanded ? null : coach.id)}
                                style={{
                                    background: 'var(--surface-glass)', border: '1px solid var(--border)',
                                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer'
                                }}
                            >
                                <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                    {/* Name + style */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>
                                            {coach.firstName} {coach.lastName}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {STYLE_ICONS[coach.style] || '🏀'} {coach.style}
                                        </div>
                                    </div>

                                    {/* Rating pills */}
                                    <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                                        {[
                                            { label: 'OFF', value: coach.rating.offense, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                                            { label: 'DEF', value: coach.rating.defense, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
                                            { label: 'DEV', value: coach.rating.talentDevelopment, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                                        ].map(r => (
                                            <div key={r.label} style={{
                                                background: r.bg, borderRadius: '7px', padding: '3px 8px',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '38px'
                                            }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: r.color }}>{r.value}</span>
                                                <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{r.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* OVR */}
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: ovrColor }}>{ovr}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>OVR</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{formatMoney(coach.contract.salary)}/yr</div>
                                    </div>

                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</div>
                                </div>

                                {/* Expanded */}
                                {isExpanded && (
                                    <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                                        <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {[
                                                { label: 'OFF', value: coach.rating.offense, color: '#3b82f6' },
                                                { label: 'DEF', value: coach.rating.defense, color: '#ef4444' },
                                                { label: 'DEV', value: coach.rating.talentDevelopment, color: '#f59e0b' },
                                            ].map(r => (
                                                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '32px', fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{r.label}</div>
                                                    <div style={{ flex: 1, height: '5px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${r.value}%`, height: '100%', background: r.color, borderRadius: '3px' }} />
                                                    </div>
                                                    <div style={{ width: '24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', textAlign: 'right' }}>{r.value}</div>
                                                </div>
                                            ))}
                                            <div style={{
                                                marginTop: '4px', background: 'var(--surface)', borderRadius: '8px', padding: '10px',
                                                fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5
                                            }}>
                                                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{STYLE_ICONS[coach.style]} {coach.style}: </span>
                                                {STYLE_DESCRIPTIONS[coach.style]}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSignCoach(coach); }}
                                                disabled={!!userCoach}
                                                style={{
                                                    marginTop: '10px', width: '100%', padding: '10px',
                                                    background: !userCoach ? '#8b5cf6' : '#444',
                                                    color: !userCoach ? 'white' : 'var(--text-secondary)',
                                                    border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold',
                                                    cursor: !userCoach ? 'pointer' : 'not-allowed',
                                                    opacity: !userCoach ? 1 : 0.6
                                                }}>
                                                {!userCoach ? 'SIGN COACH' : 'CURRENT COACH MUST BE FIRED FIRST'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
