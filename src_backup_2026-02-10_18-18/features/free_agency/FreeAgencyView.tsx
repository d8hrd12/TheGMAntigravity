import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateContractAmount } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';

import { useGame } from '../../store/GameContext';

interface FreeAgencyViewProps {
    players: Player[];
    team: Team;
    onSign: (playerId: string) => void;
    onFinish: () => void;
    onSelectPlayer: (playerId: string) => void;
}

export const FreeAgencyView: React.FC<FreeAgencyViewProps> = ({ players, team, onSign, onFinish, onSelectPlayer }) => {
    const { salaryCap } = useGame();
    const [filterPos, setFilterPos] = React.useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [sortBy, setSortBy] = React.useState<'OVR' | 'PRICE' | 'AGE' | 'PPG' | 'RPG' | 'APG'>('OVR');
    const [showAffordableOnly, setShowAffordableOnly] = React.useState(false);

    // Helper to estimate contract cost for display (Moved up for filter usage)
    const calculateCost = (player: Player) => {
        return calculateContractAmount(player, salaryCap).amount;
    };

    // Filter
    const freeAgents = players.filter(p => !p.teamId);
    let filteredAgents = filterPos === 'All' ? freeAgents : freeAgents.filter(p => p.position === filterPos);

    if (showAffordableOnly) {
        filteredAgents = filteredAgents.filter(p => calculateCost(p) <= team.salaryCapSpace);
    }

    // Sort
    const sortedFreeAgents = [...filteredAgents].sort((a, b) => {
        const ovrA = calculateOverall(a);
        const ovrB = calculateOverall(b);
        const priceA = calculateCost(a);
        const priceB = calculateCost(b);

        if (sortBy === 'PRICE') return priceB - priceA;
        if (sortBy === 'AGE') return a.age - b.age; // Youngest first

        // Stat Sorting
        const getStatVal = (p: Player, type: 'PPG' | 'RPG' | 'APG') => {
            const s = p.seasonStats.gamesPlayed > 0 ? p.seasonStats : (p.careerStats.length > 0 ? p.careerStats[p.careerStats.length - 1] : null);
            if (!s || s.gamesPlayed === 0) return 0;
            if (type === 'PPG') return s.points / s.gamesPlayed;
            if (type === 'RPG') return s.rebounds / s.gamesPlayed;
            if (type === 'APG') return s.assists / s.gamesPlayed;
            return 0;
        };

        if (sortBy === 'PPG') return getStatVal(b, 'PPG') - getStatVal(a, 'PPG');
        if (sortBy === 'RPG') return getStatVal(b, 'RPG') - getStatVal(a, 'RPG');
        if (sortBy === 'APG') return getStatVal(b, 'APG') - getStatVal(a, 'APG');

        return ovrB - ovrA; // Default OVR
    });

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    // Helper: Determine Archetype
    const getArchetype = (p: Player) => {
        if (p.archetype) return p.archetype;

        const attr = p.attributes;
        const shooting = attr.threePointShot + attr.midRange;
        const finishing = attr.finishing;
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

    // Helper: Get Last Season Stats
    const getLastSeasonStats = (p: Player) => {
        const s = p.seasonStats.gamesPlayed > 0 ? p.seasonStats : (p.careerStats.length > 0 ? p.careerStats[p.careerStats.length - 1] : null);

        if (!s || s.gamesPlayed === 0) return "Rookie";

        const ppg = (s.points / s.gamesPlayed).toFixed(1);
        const rpg = (s.rebounds / s.gamesPlayed).toFixed(1);
        const apg = (s.assists / s.gamesPlayed).toFixed(1);

        return `${ppg} PPG • ${rpg} RPG • ${apg} APG`;
    };


    // Restore scroll position
    React.useEffect(() => {
        const savedScroll = sessionStorage.getItem('fa_scroll_pos');
        if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
        }
    }, [filterPos, sortBy, showAffordableOnly]); // Added showAffordableOnly dependency to restore scroll? No, should probably reset scroll on filter change?
    // User probably wants to stay at top if they filter.
    // Let's remove showAffordableOnly from dependency (or intentionally avoid scrollTo if filtering).
    // The previous implementation only ran on mount.
    // If we want mount-only:
    // }, []);

    // BUT I added [filterPos, sortBy] in previous logic (in the Diff)? No, I commented that out and put [] below it.
    // Let's stick to mount only.

    const handleAction = (action: () => void) => {
        sessionStorage.setItem('fa_scroll_pos', window.scrollY.toString());
        action();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text)' }}>

            {/* Header Area */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>Free Agency</h1>
                        <p style={{ margin: '5px 0 0', opacity: 0.8 }}>Fill your roster.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: team.salaryCapSpace > 0 ? '#2ecc71' : '#e74c3c' }}>
                            Cap Space: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(team.salaryCapSpace)}
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#f39c12', marginTop: '4px' }}>
                            Cash: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(team.cash)}
                        </div>
                    </div>
                </div>

                {/* Big Finish Button */}
                <button
                    onClick={() => {
                        if (team.rosterIds.length < 9) {
                            alert(`You need at least 9 players to start the season! Please sign ${9 - team.rosterIds.length} more.`);
                            return;
                        }
                        sessionStorage.removeItem('fa_scroll_pos');
                        onFinish();
                    }}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '1.1rem',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                    Finish Free Agency &rarr;
                </button>

                {/* Team Needs */}
                <div style={{
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', marginRight: '10px' }}>Needs:</div>
                    {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => {
                        const count = players.filter(p => team.rosterIds.includes(p.id) && p.position === pos).length;
                        const needsFill = count < 2;
                        return (
                            <div key={pos} style={{
                                background: 'var(--surface)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: needsFill ? '1px solid var(--danger)' : '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '50px'
                            }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{pos}</span>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: needsFill ? 'var(--danger)' : 'var(--text)' }}>
                                    {count}/2
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Filter & Sort Controls */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Affordable Filter Button */}
                        <button
                            onClick={() => setShowAffordableOnly(!showAffordableOnly)}
                            style={{
                                padding: '10px 15px',
                                borderRadius: '8px',
                                border: showAffordableOnly ? '1px solid var(--success)' : '1px solid var(--border)',
                                background: showAffordableOnly ? 'rgba(46, 204, 113, 0.2)' : 'var(--surface)',
                                color: showAffordableOnly ? 'var(--success)' : 'var(--text)',
                                cursor: 'pointer',
                                fontWeight: showAffordableOnly ? 'bold' : 'normal',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{showAffordableOnly ? '☑' : '☐'}</span>
                            Affordable Only
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                maxWidth: '200px'
                            }}
                        >
                            <option value="OVR">Sort: Rating</option>
                            <option value="PRICE">Sort: Price</option>
                            <option value="AGE">Sort: Age</option>
                            <option value="PPG">Sort: PPG</option>
                            <option value="RPG">Sort: RPG</option>
                            <option value="APG">Sort: APG</option>
                        </select>
                    </div>

                    {/* Position Filters */}
                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px', flex: '2 1 auto' }}>
                        {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                            <button
                                key={pos}
                                onClick={() => setFilterPos(pos as any)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: filterPos === pos ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: filterPos === pos ? 'var(--primary)' : 'var(--surface)',
                                    color: filterPos === pos ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Player List (Card Layout) */}
            <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '10px' }}>
                {sortedFreeAgents.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No free agents available.</div>
                ) : (
                    sortedFreeAgents.map(player => {
                        const cost = calculateCost(player);
                        const canAfford = team.salaryCapSpace >= cost;
                        const archetype = getArchetype(player);
                        const stats = getLastSeasonStats(player);

                        return (
                            <div key={player.id} style={{
                                background: 'var(--surface-glass)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                marginBottom: '10px',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {/* Top Row: Name and OVR */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div
                                            onClick={() => handleAction(() => onSelectPlayer(player.id))}
                                            style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                                            {player.firstName} {player.lastName}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{player.position}</span>
                                            <span style={{ fontSize: '0.8rem', background: 'var(--surface)', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                                {archetype}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>OVR</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>
                                            {calculateOverall(player)}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Last Season: <span style={{ color: 'var(--text)' }}>{stats}</span>
                                </div>

                                {/* Middle Row: Price */}
                                <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '500' }}>
                                    Asking: <span style={{ fontFamily: 'monospace' }}>{formatMoney(cost)}/yr</span> (Age: {player.age})
                                </div>

                                {/* Bottom Row: Action Button */}
                                <button
                                    onClick={() => handleAction(() => onSign(player.id))}
                                    disabled={!canAfford}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: canAfford ? 'var(--success)' : 'var(--surface)',
                                        color: canAfford ? 'white' : 'var(--text-secondary)',
                                        border: canAfford ? 'none' : '1px solid var(--border)',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: canAfford ? 'pointer' : 'not-allowed',
                                        opacity: canAfford ? 1 : 0.6,
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {canAfford ? 'SIGN PLAYER' : 'CAP SPACE EXCEEDED'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
