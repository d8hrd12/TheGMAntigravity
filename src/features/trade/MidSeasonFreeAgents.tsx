import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall, formatFullStatLine } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
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

import { ConfirmationModal } from '../ui/ConfirmationModal';

export const MidSeasonFreeAgents: React.FC<MidSeasonFreeAgentsProps> = ({ players, userTeam, currentYear, onSelectPlayer }) => {
    const { signPlayerWithContract, userHireCoach, salaryCap, coaches } = useGame();
    const [activeTab, setActiveTab] = React.useState<'players' | 'coaches'>('players');
    const [filterPos, setFilterPos] = React.useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [sortBy, setSortBy] = React.useState<'OVR' | 'PRICE' | 'AGE'>('OVR');
    const [showAffordableOnly, setShowAffordableOnly] = React.useState(false);
    const [coachSortBy, setCoachSortBy] = React.useState<'OVR' | 'OFF' | 'DEF' | 'DEV'>('OVR');
    const [expandedCoachId, setExpandedCoachId] = React.useState<string | null>(null);

    const userTeamBaseline = React.useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeam.id);
        return calculateTeamBaseline(teamPlayers);
    }, [players, userTeam.id]);

    // Modal States
    const [modalConfig, setModalConfig] = React.useState<{
        show: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
        isDestructive?: boolean;
    }>({ show: false, title: '', message: '', confirmText: '', onConfirm: () => { } });

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

    const getLastSeasonStats = (p: Player) => formatFullStatLine(p);

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
        if (!canSignGeneric) {
            setModalConfig({
                show: true,
                title: 'Roster Full',
                message: 'Your roster is full (13 players). You must waive a player before signing a new one.',
                confirmText: 'Understood',
                onConfirm: () => setModalConfig(prev => ({ ...prev, show: false }))
            });
            return;
        }

        const cost = calculateCost(player);
        if (cost > userTeam.salaryCapSpace) {
            setModalConfig({
                show: true,
                title: 'Not Enough Cap Space',
                message: `The ${player.lastName} requires ${formatMoney(cost)}, but you only have ${formatMoney(userTeam.salaryCapSpace)} available.`,
                confirmText: 'Understood',
                onConfirm: () => setModalConfig(prev => ({ ...prev, show: false }))
            });
            return;
        }

        setModalConfig({
            show: true,
            title: 'Sign Player',
            message: `Are you sure you want to sign ${player.firstName} ${player.lastName} to a 1-year contract worth ${formatMoney(cost)}?`,
            confirmText: 'Sign Player',
            onConfirm: () => {
                signPlayerWithContract(player.id, { amount: cost, years: 1, role: 'Bench' });
                setModalConfig(prev => ({ ...prev, show: false }));
            }
        });
    };

    const userCoach = (coaches || []).find(c => c.id === userTeam.coachId && c.teamId === userTeam.id);

    const handleSignCoach = (coach: Coach) => {
        if (userCoach) {
            setModalConfig({
                show: true,
                title: 'Coach Position Occupied',
                message: 'You already have a head coach. You must fire your current coach before hiring a new one.',
                confirmText: 'Understood',
                onConfirm: () => setModalConfig(prev => ({ ...prev, show: false }))
            });
            return;
        }

        setModalConfig({
            show: true,
            title: 'Hire Coach',
            message: `Are you sure you want to hire ${coach.firstName} ${coach.lastName} as your head coach for ${formatMoney(coach.contract.salary)} per year?`,
            confirmText: 'Hire Coach',
            onConfirm: () => {
                userHireCoach(coach.id);
                setModalConfig(prev => ({ ...prev, show: false }));
            }
        });
    };

    return (
        <div style={{ padding: '0 20px', background: '#ffffff', minHeight: '100vh' }}>
            {/* Players / Coaches Toggle */}
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '24px', 
                background: '#f2f2f7', 
                borderRadius: '14px', 
                padding: '4px', 
                width: 'fit-content',
                margin: '16px auto'
            }}>
                <button
                    onClick={() => setActiveTab('players')}
                    style={{
                        padding: '8px 24px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        fontWeight: 700, 
                        fontSize: '0.85rem',
                        background: activeTab === 'players' ? '#ffffff' : 'transparent',
                        color: activeTab === 'players' ? '#111111' : '#8e8e93',
                        cursor: 'pointer',
                        boxShadow: activeTab === 'players' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >🏀 Players</button>
                <button
                    onClick={() => setActiveTab('coaches')}
                    style={{
                        padding: '8px 24px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        fontWeight: 700, 
                        fontSize: '0.85rem',
                        background: activeTab === 'coaches' ? '#ffffff' : 'transparent',
                        color: activeTab === 'coaches' ? '#111111' : '#8e8e93',
                        cursor: 'pointer',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        boxShadow: activeTab === 'coaches' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    🎽 Coaches
                    <span style={{
                        background: activeTab === 'coaches' ? '#f2f2f7' : '#e5e5ea',
                        color: '#111111',
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        padding: '1px 6px', 
                        borderRadius: '20px'
                    }}>{freeAgentCoaches.length}</span>
                </button>
            </div>

            {/* ── PLAYERS TAB ── */}
            {activeTab === 'players' && (
                <>
                    <div style={{ marginBottom: '24px' }}>
                        {/* Team Needs */}
                        <div style={{
                            background: '#ffffff', 
                            border: '1px solid #eeeeee', 
                            borderRadius: '20px',
                            padding: '16px', 
                            marginBottom: '20px', 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between', 
                            flexWrap: 'wrap', 
                            gap: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ fontWeight: 800, color: '#8e8e93', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roster Depth:</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => {
                                    const count = players.filter(p => p.teamId === userTeam.id && p.position === pos).length;
                                    const needsFill = count < 2;
                                    return (
                                        <div key={pos} style={{
                                            background: needsFill ? 'rgba(255, 59, 48, 0.05)' : '#f2f2f7', 
                                            padding: '6px 12px', 
                                            borderRadius: '10px',
                                            border: needsFill ? '1px solid rgba(255, 59, 48, 0.1)' : '1px solid #eeeeee',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '6px'
                                        }}>
                                            <span style={{ fontSize: '0.75rem', color: '#111111', fontWeight: 800 }}>{pos}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: needsFill ? '#ff3b30' : '#111111' }}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={() => setShowAffordableOnly(!showAffordableOnly)} style={{
                                    padding: '8px 16px', 
                                    borderRadius: '12px',
                                    border: '1px solid #eeeeee',
                                    background: showAffordableOnly ? '#111111' : '#ffffff',
                                    color: showAffordableOnly ? '#ffffff' : '#111111',
                                    cursor: 'pointer', 
                                    fontWeight: 600, 
                                    fontSize: '0.85rem',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                }}>
                                    {showAffordableOnly ? '✨ Affordable Only' : '👤 All Salaries'}
                                </button>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{
                                    padding: '8px 12px', 
                                    borderRadius: '12px', 
                                    border: '1px solid #eeeeee',
                                    background: '#ffffff', 
                                    color: '#111111', 
                                    cursor: 'pointer', 
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                }}>
                                    <option value="OVR">Sort: Overall</option>
                                    <option value="PRICE">Sort: Salary</option>
                                    <option value="AGE">Sort: Age</option>
                                </select>
                            </div>
                        </div>

                        {/* Position Pill Selector */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px', justifyContent: 'center' }}>
                            {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                                <button key={pos} onClick={() => setFilterPos(pos as any)} style={{
                                    padding: '6px 16px', 
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: filterPos === pos ? '#007aff' : '#f2f2f7',
                                    color: filterPos === pos ? '#ffffff' : '#8e8e93',
                                    cursor: 'pointer', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}>{pos}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', paddingBottom: '40px' }}>
                        {sortedFreeAgents.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#8e8e93', background: '#ffffff', borderRadius: '24px', border: '1px solid #eeeeee' }}>
                                No free agents available.
                            </div>
                        ) : (
                            sortedFreeAgents.map(p => {
                                const cost = calculateCost(p);
                                const canAfford = userTeam.salaryCapSpace >= cost;
                                const archetype = getArchetype(p);
                                const stats = getLastSeasonStats(p);
                                const ovr = calculateOverall(p);

                                return (
                                    <div key={p.id} style={{
                                        background: '#ffffff', 
                                        border: '1px solid #eeeeee',
                                        borderRadius: '24px', 
                                        padding: '24px',
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div>
                                                <div onClick={() => onSelectPlayer(p.id)}
                                                    style={{ fontWeight: 800, fontSize: '1.2rem', color: '#111111', cursor: 'pointer', letterSpacing: '-0.02em' }}>
                                                    {p.firstName} <span style={{ color: '#8e8e93', fontWeight: 500 }}>{p.lastName.toUpperCase()}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#007aff', textTransform: 'uppercase' }}>{p.position}</span>
                                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d1d1d6' }}></span>
                                                    <span style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: 600 }}>{archetype}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <StarRating stars={calculateStars(ovr, userTeamBaseline)} size={12} />
                                                <div style={{ fontSize: '0.6rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Skill</div>
                                            </div>
                                        </div>

                                        <div style={{ background: '#f9f9f9', borderRadius: '16px', padding: '12px', marginBottom: '20px' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Last Season Avg</div>
                                            <div style={{ fontSize: '0.85rem', color: '#111111', fontWeight: 600 }}>{stats}</div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase' }}>Asking Salary</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: canAfford ? '#111111' : '#ff3b30' }}>{formatMoney(cost)}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase' }}>Age</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111' }}>{p.age}</div>
                                            </div>
                                        </div>

                                        <button onClick={() => handleSign(p)} disabled={!canAfford || !canSignGeneric} style={{
                                            width: '100%', 
                                            padding: '14px',
                                            background: (canAfford && canSignGeneric) ? '#111111' : '#f2f2f7',
                                            color: (canAfford && canSignGeneric) ? '#ffffff' : '#8e8e93',
                                            border: 'none', 
                                            borderRadius: '14px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            cursor: (canAfford && canSignGeneric) ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s'
                                        }}>
                                            {canSignGeneric ? (canAfford ? 'Sign Player' : 'Insufficient Cap') : 'Roster Full'}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
                    {/* Your current coach */}
                    {userCoach && (
                        <div style={{
                            background: '#ffffff', 
                            border: '1px solid #eeeeee',
                            borderRadius: '24px', 
                            padding: '24px',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Head Coach</div>
                                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111111', letterSpacing: '-0.02em' }}>{userCoach.firstName} {userCoach.lastName}</div>
                                <div style={{ fontSize: '0.85rem', color: '#8e8e93', marginTop: '4px', fontWeight: 600 }}>
                                    {STYLE_ICONS[userCoach.style] || '🏀'} {userCoach.style} • {userCoach.contract.yearsRemaining}yr left
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                {[{ l: 'OFF', v: userCoach.rating.offense, c: '#007aff' }, { l: 'DEF', v: userCoach.rating.defense, c: '#ff3b30' }, { l: 'DEV', v: userCoach.rating.talentDevelopment, c: '#ffcc00' }].map(r => (
                                    <div key={r.l} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: r.c }}>{r.v}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#8e8e93', fontWeight: 800, textTransform: 'uppercase' }}>{r.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort buttons */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {(['OVR', 'OFF', 'DEF', 'DEV'] as const).map(s => (
                            <button key={s} onClick={() => setCoachSortBy(s)} style={{
                                padding: '8px 16px', 
                                borderRadius: '100px', 
                                border: 'none', 
                                fontWeight: 700, 
                                fontSize: '0.8rem',
                                background: coachSortBy === s ? '#8b5cf6' : '#f2f2f7',
                                color: coachSortBy === s ? '#ffffff' : '#8e8e93',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>{s}</button>
                        ))}
                    </div>

                    {/* Coach list */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {freeAgentCoaches.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#8e8e93', background: '#ffffff', borderRadius: '24px', border: '1px solid #eeeeee' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎽</div>
                                <div style={{ fontWeight: 600 }}>No free agent coaches available</div>
                            </div>
                        ) : freeAgentCoaches.map(coach => {
                            const ovr = Math.round((coach.rating.offense + coach.rating.defense + coach.rating.talentDevelopment) / 3);
                            const isExpanded = expandedCoachId === coach.id;

                            return (
                                <div key={coach.id}
                                    onClick={() => setExpandedCoachId(isExpanded ? null : coach.id)}
                                    style={{
                                        background: '#ffffff', 
                                        border: '1px solid #eeeeee',
                                        borderRadius: '24px', 
                                        overflow: 'hidden', 
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#111111', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                                {coach.firstName} {coach.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: '4px', fontWeight: 600 }}>
                                                {STYLE_ICONS[coach.style] || '🏀'} {coach.style}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                            {[
                                                { label: 'OFF', value: coach.rating.offense, color: '#007aff' },
                                                { label: 'DEF', value: coach.rating.defense, color: '#ff3b30' },
                                            ].map(r => (
                                                <div key={r.label} style={{
                                                    background: '#f2f2f7', 
                                                    borderRadius: '10px', 
                                                    padding: '6px 10px',
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    minWidth: '42px'
                                                }}>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: r.color }}>{r.value}</span>
                                                    <span style={{ fontSize: '0.55rem', color: '#8e8e93', fontWeight: 800, textTransform: 'uppercase' }}>{r.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <StarRating stars={calculateStars(ovr, 75)} size={12} />
                                            <div style={{ fontSize: '0.75rem', color: '#111111', fontWeight: 800, marginTop: '2px' }}>{formatMoney(coach.contract.salary)}</div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eeeeee' }}>
                                            <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {[
                                                    { label: 'Offense', value: coach.rating.offense, color: '#007aff' },
                                                    { label: 'Defense', value: coach.rating.defense, color: '#ff3b30' },
                                                    { label: 'Talent Dev', value: coach.rating.talentDevelopment, color: '#ffcc00' },
                                                ].map(r => (
                                                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '80px', fontSize: '0.7rem', color: '#8e8e93', fontWeight: 800, textTransform: 'uppercase' }}>{r.label}</div>
                                                        <div style={{ flex: 1, height: '6px', background: '#f2f2f7', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${r.value}%`, height: '100%', background: r.color, borderRadius: '3px' }} />
                                                        </div>
                                                        <div style={{ width: '28px', fontSize: '0.85rem', fontWeight: 800, color: '#111111', textAlign: 'right' }}>{r.value}</div>
                                                    </div>
                                                ))}
                                                <div style={{
                                                    marginTop: '8px', 
                                                    background: '#f9f9f9', 
                                                    borderRadius: '16px', 
                                                    padding: '16px',
                                                    fontSize: '0.85rem', 
                                                    color: '#3a3a3c', 
                                                    lineHeight: 1.5,
                                                    fontWeight: 500
                                                }}>
                                                    <span style={{ color: '#8b5cf6', fontWeight: 800 }}>{coach.style}: </span>
                                                    {STYLE_DESCRIPTIONS[coach.style]}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSignCoach(coach); }}
                                                    disabled={!!userCoach}
                                                    style={{
                                                        marginTop: '12px', 
                                                        width: '100%', 
                                                        padding: '14px',
                                                        background: !userCoach ? '#8b5cf6' : '#f2f2f7',
                                                        color: !userCoach ? '#ffffff' : '#8e8e93',
                                                        border: 'none', 
                                                        borderRadius: '14px', 
                                                        fontSize: '0.9rem', 
                                                        fontWeight: 800,
                                                        textTransform: 'uppercase',
                                                        cursor: !userCoach ? 'pointer' : 'not-allowed',
                                                        transition: 'all 0.2s'
                                                    }}>
                                                    {!userCoach ? 'Hire Coach' : 'Coach Occupied'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {modalConfig.show && (
                <ConfirmationModal
                    title={modalConfig.title}
                    message={modalConfig.message}
                    confirmText={modalConfig.confirmText}
                    cancelText="Cancel"
                    onConfirm={modalConfig.onConfirm}
                    onCancel={() => setModalConfig(prev => ({ ...prev, show: false }))}
                    isDestructive={modalConfig.isDestructive}
                />
            )}
        </div>
    );
};
