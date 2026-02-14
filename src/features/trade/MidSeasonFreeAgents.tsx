import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount } from '../../utils/contractUtils';

interface MidSeasonFreeAgentsProps {
    players: Player[];
    userTeam: Team;
    currentYear: number;
    onSign?: (playerId: string) => void; // Optional now
    onBack?: () => void;
    onSelectPlayer: (playerId: string) => void;
}

export const MidSeasonFreeAgents: React.FC<MidSeasonFreeAgentsProps> = ({ players, userTeam, currentYear, onSelectPlayer }) => {
    const { signPlayerWithContract, salaryCap } = useGame();
    const [filterPos, setFilterPos] = React.useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [sortBy, setSortBy] = React.useState<'OVR' | 'PRICE' | 'AGE'>('OVR');
    const [showAffordableOnly, setShowAffordableOnly] = React.useState(false);

    // Helpers
    const calculateCost = (player: Player) => {
        return calculateContractAmount(player, salaryCap).amount;
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

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
        if (!s || s.gamesPlayed === 0) return "Rookie";
        const ppg = (s.points / s.gamesPlayed).toFixed(1);
        const rpg = (s.rebounds / s.gamesPlayed).toFixed(1);
        const apg = (s.assists / s.gamesPlayed).toFixed(1);
        return `${ppg} PPG • ${rpg} RPG • ${apg} APG`;
    };

    // Filter Logic
    const freeAgents = players.filter(p => !p.teamId || p.teamId === '');
    let filteredAgents = filterPos === 'All' ? freeAgents : freeAgents.filter(p => p.position === filterPos);

    if (showAffordableOnly) {
        filteredAgents = filteredAgents.filter(p => calculateCost(p) <= userTeam.salaryCapSpace);
    }

    // Sort Logic
    const sortedFreeAgents = [...filteredAgents].sort((a, b) => {
        const ovrA = (a.attributes.finishing + a.attributes.threePointShot + a.attributes.perimeterDefense);
        const ovrB = (b.attributes.finishing + b.attributes.threePointShot + b.attributes.perimeterDefense);
        const priceA = calculateCost(a);
        const priceB = calculateCost(b);

        if (sortBy === 'PRICE') return priceB - priceA;
        if (sortBy === 'AGE') return a.age - b.age;
        return ovrB - ovrA; // Default OVR
    });

    const rosterSize = players.filter(p => p.teamId === userTeam.id).length;
    const canSignGeneric = rosterSize < 13;

    const handleSign = (player: Player) => {
        if (!canSignGeneric) {
            alert('Roster full! Release players first.');
            return;
        }
        const cost = calculateCost(player);
        if (cost > userTeam.salaryCapSpace) {
            alert('Not enough Cap Space!');
            return;
        }

        if (confirm(`Sign ${player.lastName} for ${formatMoney(cost)} (1 Year)?`)) {
            signPlayerWithContract(player.id, { amount: cost, years: 1, role: 'Bench' });
            // Visual feedback handled by UI updates
        }
    };

    return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            <div style={{ marginBottom: '15px' }}>
                {/* Team Needs */}
                <div style={{
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', marginRight: '10px', fontSize: '0.9rem' }}>Needs:</div>
                    {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => {
                        const count = players.filter(p => p.teamId === userTeam.id && p.position === pos).length;
                        const needsFill = count < 2;
                        return (
                            <div key={pos} style={{
                                background: 'var(--surface)',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                border: needsFill ? '1px solid var(--danger)' : '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '40px'
                            }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{pos}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: needsFill ? 'var(--danger)' : 'var(--text)' }}>
                                    {count}/2
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowAffordableOnly(!showAffordableOnly)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: showAffordableOnly ? '1px solid var(--success)' : '1px solid var(--border)',
                                background: showAffordableOnly ? 'rgba(46, 204, 113, 0.2)' : 'var(--surface)',
                                color: showAffordableOnly ? 'var(--success)' : 'var(--text)',
                                cursor: 'pointer',
                                fontWeight: showAffordableOnly ? 'bold' : 'normal',
                                fontSize: '0.85rem'
                            }}
                        >
                            {showAffordableOnly ? '☑ Cap Fit' : '☐ Cap Fit'}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            <option value="OVR">Sort: Rating</option>
                            <option value="PRICE">Sort: Price</option>
                            <option value="AGE">Sort: Age</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '10px 0 5px', flex: '2 1 auto' }}>
                    {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                        <button
                            key={pos}
                            onClick={() => setFilterPos(pos as any)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: filterPos === pos ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: filterPos === pos ? 'var(--primary)' : 'var(--surface)',
                                color: filterPos === pos ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '10px' }}>
                {sortedFreeAgents.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No free agents available.
                    </div>
                ) : (
                    sortedFreeAgents.map(p => {
                        const cost = calculateCost(p);
                        const canAfford = userTeam.salaryCapSpace >= cost;
                        const archetype = getArchetype(p);
                        const stats = getLastSeasonStats(p);

                        return (
                            <div key={p.id} style={{
                                background: 'var(--surface-glass)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                marginBottom: '10px',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div
                                            onClick={() => onSelectPlayer(p.id)}
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
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text)' }}>
                                            {calculateOverall(p)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Last Season: <span style={{ color: 'var(--text)' }}>{stats}</span>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: '500' }}>
                                    Asking: <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontWeight: 700 }}>{formatMoney(cost)}</span> (Age: {p.age})
                                </div>

                                <button
                                    onClick={() => handleSign(p)}
                                    disabled={!canAfford || !canSignGeneric}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: (canAfford && canSignGeneric) ? 'var(--success)' : '#444',
                                        color: (canAfford && canSignGeneric) ? 'white' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        cursor: (canAfford && canSignGeneric) ? 'pointer' : 'not-allowed',
                                        opacity: (canAfford && canSignGeneric) ? 1 : 0.6
                                    }}
                                >
                                    {canSignGeneric ? (canAfford ? 'SIGN PLAYER' : 'CAP SPACE EXCEEDED') : 'ROSTER FULL'}
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};
