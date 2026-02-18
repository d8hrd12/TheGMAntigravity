
import React, { useState, useEffect } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { STYLE_DESCRIPTIONS } from '../../models/Coach';
import { calculateContractAmount } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { useGame } from '../../store/GameContext';
import { NegotiationView } from '../negotiation/NegotiationView';
import { DailyRecapModal } from './components/DailyRecapModal';
import { FreeAgencySummaryModal } from './components/FreeAgencySummaryModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{value}</div>
    </div>
);

const RatingBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', fontSize: '0.7rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>{label}</div>
        <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px' }} />
        </div>
        <div style={{ width: '28px', fontSize: '0.85rem', fontWeight: 700, color: 'white', textAlign: 'right', flexShrink: 0 }}>{value}</div>
    </div>
);

const STYLE_ICONS: Record<string, string> = {
    'Pace and Space': '🚀',
    'Grit and Grind': '💪',
    'Triangle': '🔺',
    'Dribble Drive': '⚡',
    'Seven Seconds': '⏱️',
    'Princeton': '🎯',
    'Defensive Wall': '🛡️',
};

interface FreeAgencyViewProps {
    players: Player[];
    team: Team;
    onSign: (playerId: string) => void;
    onFinish: () => void;
    onSelectPlayer: (playerId: string) => void;
}

export const FreeAgencyView: React.FC<FreeAgencyViewProps> = ({ players, team, onSign, onFinish, onSelectPlayer }) => {
    const {
        salaryCap, freeAgencyDay, activeOffers, placeOffer, advanceFreeAgencyDay, userTeamId,
        lastFreeAgencyResult, setGameState, teams, coaches
    } = useGame();

    const [activeTab, setActiveTab] = useState<'players' | 'coaches'>('players');
    const [filterPos, setFilterPos] = useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [sortBy, setSortBy] = useState<'OVR' | 'PRICE' | 'AGE' | 'POT'>('OVR');
    const [searchTerm, setSearchTerm] = useState('');
    const [coachSearch, setCoachSearch] = useState('');
    const [coachSortBy, setCoachSortBy] = useState<'OVR' | 'OFF' | 'DEF' | 'DEV'>('OVR');
    const [expandedCoachId, setExpandedCoachId] = useState<string | null>(null);

    const [selectedPlayerForOffer, setSelectedPlayerForOffer] = useState<Player | null>(null);
    const [selectedPlayerForBids, setSelectedPlayerForBids] = useState<Player | null>(null);
    const [showDailyRecap, setShowDailyRecap] = useState(false);
    const [showFinalSummary, setShowFinalSummary] = useState(false);

    useEffect(() => {
        if (lastFreeAgencyResult && lastFreeAgencyResult.day === freeAgencyDay) {
            setShowDailyRecap(true);
        }
    }, [lastFreeAgencyResult, freeAgencyDay]);

    const handleCloseRecap = () => setShowDailyRecap(false);

    const calculateMinAsk = (player: Player) => calculateContractAmount(player, salaryCap).amount;
    const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    const handleSort = (a: Player, b: Player) => {
        const ovrA = calculateOverall(a);
        const ovrB = calculateOverall(b);
        if (sortBy === 'PRICE') return calculateMinAsk(b) - calculateMinAsk(a);
        if (sortBy === 'AGE') return a.age - b.age;
        if (sortBy === 'POT') return b.potential - a.potential;
        return ovrB - ovrA;
    };

    const filteredAgents = players
        .filter(p => !p.teamId)
        .filter(p => filterPos === 'All' || p.position === filterPos)
        .filter(p => searchTerm ? (p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || p.lastName.toLowerCase().includes(searchTerm.toLowerCase())) : true)
        .sort(handleSort);

    const freeAgentCoaches = (coaches || [])
        .filter(c => !c.teamId)
        .filter(c => coachSearch ? (`${c.firstName} ${c.lastName}`).toLowerCase().includes(coachSearch.toLowerCase()) : true)
        .sort((a, b) => {
            if (coachSortBy === 'OFF') return b.rating.offense - a.rating.offense;
            if (coachSortBy === 'DEF') return b.rating.defense - a.rating.defense;
            if (coachSortBy === 'DEV') return b.rating.talentDevelopment - a.rating.talentDevelopment;
            return (b.rating.offense + b.rating.defense + b.rating.talentDevelopment) / 3 -
                (a.rating.offense + a.rating.defense + a.rating.talentDevelopment) / 3;
        });

    const handleSubmitOffer = (offer: { amount: number; years: number; role: any }) => {
        if (selectedPlayerForOffer) {
            placeOffer(selectedPlayerForOffer.id, offer.amount, offer.years);
            setSelectedPlayerForOffer(null);
        }
    };

    const getExistingOffer = (playerId: string) =>
        activeOffers?.find(o => o.playerId === playerId && o.teamId === userTeamId && o.status === 'pending');

    const handleEndFreeAgency = () => setShowFinalSummary(true);
    const confirmFinish = () => { setShowFinalSummary(false); onFinish(); };

    const myRoster = players.filter(p => team.rosterIds.includes(p.id));
    const counts = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
    myRoster.forEach(p => { if (p.position in counts) counts[p.position as keyof typeof counts]++; });
    const targets = { PG: 2, SG: 2, SF: 2, PF: 2, C: 2 };
    const activeOffersCount = activeOffers?.filter(o => o.teamId === userTeamId && o.status === 'pending').length || 0;
    const userCoach = (coaches || []).find(c => c.id === team.coachId && c.teamId === userTeamId);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}>

            {/* Hero Section */}
            <div style={{
                background: '#121212', borderRadius: '24px', padding: '20px', marginBottom: '30px',
                border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-1px' }}>Free Agency</h1>
                        <p style={{ fontSize: '1rem', color: '#888', margin: '5px 0 0 0' }}>Fill your roster.</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#2ecc71', fontWeight: 700 }}>Cap Space: {formatMoney(team.salaryCapSpace)}</div>
                        <div style={{ fontSize: '0.9rem', color: '#f39c12', fontWeight: 700 }}>Cash: {formatMoney(team.cash)}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    {freeAgencyDay < 7 ? (
                        <button onClick={advanceFreeAgencyDay} style={{
                            width: '100%', padding: '16px', background: 'linear-gradient(90deg, #f39c12, #d35400)',
                            color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 800,
                            cursor: 'pointer', boxShadow: '0 4px 20px rgba(243,156,18,0.3)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                        }}>
                            To The Next Day &gt;
                        </button>
                    ) : (
                        <button onClick={handleEndFreeAgency} style={{
                            width: '100%', padding: '16px', background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
                            color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 800,
                            cursor: 'pointer', boxShadow: '0 4px 20px rgba(46,204,113,0.3)'
                        }}>
                            Finish Free Agency &gt;
                        </button>
                    )}
                </div>

                <div style={{ background: '#2c2c2e', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ccc', width: '100%', marginBottom: '10px' }}>Needs:</div>
                    {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => {
                        const count = counts[pos as keyof typeof counts];
                        const target = targets[pos as keyof typeof targets];
                        const isMet = count >= target;
                        return (
                            <div key={pos} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                background: '#1c1c1e', borderRadius: '10px', padding: '10px',
                                border: isMet ? '1px solid #333' : '1px solid #e74c3c', flex: 1, minWidth: '50px'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginBottom: '2px' }}>{pos}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isMet ? 'white' : '#e74c3c' }}>{count}/{target}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* See Offers */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => {
                        const offers = activeOffers?.filter(o => o.teamId === userTeamId && o.status === 'pending') || [];
                        if (offers.length > 0) {
                            const p = players.find(p => p.id === offers[0].playerId);
                            if (p) setSelectedPlayerForBids(p);
                        }
                    }}
                    style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    See Active Offers ({activeOffersCount})
                </button>
            </div>

            {/* ── PLAYERS / COACHES TOGGLE ── */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#1c1c1e', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('players')}
                    style={{
                        padding: '10px 28px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                        background: activeTab === 'players' ? '#0ea5e9' : 'transparent',
                        color: activeTab === 'players' ? 'white' : '#888',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    🏀 Players
                </button>
                <button
                    onClick={() => setActiveTab('coaches')}
                    style={{
                        padding: '10px 28px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                        background: activeTab === 'coaches' ? '#8b5cf6' : 'transparent',
                        color: activeTab === 'coaches' ? 'white' : '#888',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                >
                    🎽 Coaches
                    <span style={{
                        background: activeTab === 'coaches' ? 'rgba(255,255,255,0.25)' : '#333',
                        color: activeTab === 'coaches' ? 'white' : '#aaa',
                        fontSize: '0.75rem', fontWeight: 700, padding: '1px 7px', borderRadius: '20px'
                    }}>{freeAgentCoaches.length}</span>
                </button>
            </div>

            {/* ── PLAYERS TAB ── */}
            {activeTab === 'players' && (
                <>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input
                                type="text" placeholder="Search players..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: 'none', background: '#2c2c2e', color: 'white', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                                <button key={pos} onClick={() => setFilterPos(pos as any)} style={{
                                    padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 600,
                                    background: filterPos === pos ? '#0ea5e9' : '#2c2c2e',
                                    color: filterPos === pos ? 'white' : '#888', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                                }}>{pos}</button>
                            ))}
                        </div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                            style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#2c2c2e', color: 'white', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                            <option value="OVR">Sort by Overall</option>
                            <option value="PRICE">Sort by Price</option>
                            <option value="AGE">Sort by Age</option>
                            <option value="POT">Sort by Potential</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredAgents.slice(0, 100).map(player => {
                            const existingOffer = getExistingOffer(player.id);
                            const contractReq = calculateContractAmount(player, salaryCap);
                            const askAmount = contractReq.amount;
                            const ovr = calculateOverall(player);
                            const lastS = player.careerStats && player.careerStats.length > 0 ? player.careerStats[player.careerStats.length - 1] : null;
                            const gp = lastS?.gamesPlayed || 1;
                            const ppg = lastS ? (lastS.points / gp).toFixed(1) : '-';
                            const rpg = lastS ? (lastS.rebounds / gp).toFixed(1) : '-';
                            const apg = lastS ? (lastS.assists / gp).toFixed(1) : '-';
                            const spg = lastS ? (lastS.steals / gp).toFixed(1) : '-';
                            const bpg = lastS ? (lastS.blocks / gp).toFixed(1) : '-';
                            const mpg = lastS ? (lastS.minutes / gp).toFixed(1) : '-';
                            const fgPct = lastS && lastS.fgAttempted > 0 ? ((lastS.fgMade / lastS.fgAttempted) * 100).toFixed(0) + '%' : '-';
                            const threePct = lastS && lastS.threeAttempted > 0 ? ((lastS.threeMade / lastS.threeAttempted) * 100).toFixed(0) + '%' : '-';
                            const ftPct = lastS && lastS.ftAttempted > 0 ? ((lastS.ftMade / lastS.ftAttempted) * 100).toFixed(0) + '%' : '-';

                            return (
                                <motion.div key={player.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.01, backgroundColor: '#262629' }}
                                    onClick={() => onSelectPlayer(player.id)}
                                    style={{
                                        background: '#1c1c1e', borderRadius: '16px', cursor: 'pointer',
                                        border: existingOffer ? `1px solid ${team.colors?.primary || '#0ea5e9'}` : '1px solid transparent',
                                        boxShadow: existingOffer ? `0 0 15px ${team.colors?.primary || '#0ea5e9'}33` : 'none',
                                        padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                                                {player.firstName} {player.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, marginTop: '2px' }}>
                                                {player.position} • {player.age}yo
                                            </div>
                                        </div>
                                        <div style={{
                                            background: ovr >= 85 ? 'rgba(231,76,60,0.2)' : ovr >= 75 ? 'rgba(46,204,113,0.2)' : 'rgba(241,196,15,0.2)',
                                            padding: '5px 10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px'
                                        }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>OVR</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: ovr >= 85 ? '#e74c3c' : ovr >= 75 ? '#2ecc71' : '#f1c40f' }}>{ovr}</span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#252528', borderRadius: '12px', padding: '10px 12px',
                                        display: 'flex', alignItems: 'center', gap: '15px', overflowX: 'auto',
                                        scrollbarWidth: 'none', msOverflowStyle: 'none'
                                    }}>
                                        <StatItem label="PPG" value={ppg} />
                                        <StatItem label="RPG" value={rpg} />
                                        <StatItem label="APG" value={apg} />
                                        <StatItem label="SPG" value={spg} />
                                        <StatItem label="BPG" value={bpg} />
                                        <div style={{ width: '1px', height: '20px', background: '#444', flexShrink: 0 }} />
                                        <StatItem label="MPG" value={mpg} />
                                        <div style={{ width: '1px', height: '20px', background: '#444', flexShrink: 0 }} />
                                        <StatItem label="FG%" value={fgPct} />
                                        <StatItem label="3P%" value={threePct} />
                                        <StatItem label="FT%" value={ftPct} />
                                    </div>

                                    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                                        {existingOffer ? (
                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, textTransform: 'uppercase' }}>Offer Pending</span>
                                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{formatMoney(existingOffer.amount)}</span>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); setSelectedPlayerForBids(player); }}
                                                    style={{ fontSize: '0.8rem', background: '#333', color: '#ccc', border: 'none', padding: '6px 12px', borderRadius: '8px' }}>
                                                    Bids
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Asking</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{formatMoney(askAmount)}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedPlayerForBids(player); }}
                                                        style={{ padding: '8px 12px', background: '#333', color: '#ccc', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                                                        Bids
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedPlayerForOffer(player); }}
                                                        style={{ padding: '8px 16px', background: team.colors?.primary || '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                                        Offer
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* ── COACHES TAB ── */}
            {activeTab === 'coaches' && (
                <>
                    {/* Your Current Coach Banner */}
                    {userCoach && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
                            border: '1px solid rgba(139,92,246,0.4)', borderRadius: '16px', padding: '16px 20px',
                            marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Your Head Coach</div>
                                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{userCoach.firstName} {userCoach.lastName}</div>
                                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '2px' }}>
                                    {STYLE_ICONS[userCoach.style] || '🏀'} {userCoach.style} • {userCoach.contract.yearsRemaining} yr{userCoach.contract.yearsRemaining !== 1 ? 's' : ''} left • {formatMoney(userCoach.contract.salary)}/yr
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                {[
                                    { label: 'OFF', value: userCoach.rating.offense, color: '#3b82f6' },
                                    { label: 'DEF', value: userCoach.rating.defense, color: '#ef4444' },
                                    { label: 'DEV', value: userCoach.rating.talentDevelopment, color: '#f59e0b' },
                                ].map(r => (
                                    <div key={r.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: r.color }}>{r.value}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>{r.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search + Sort */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input type="text" placeholder="Search coaches..." value={coachSearch}
                                onChange={(e) => setCoachSearch(e.target.value)}
                                style={{ width: '100%', padding: '11px 11px 11px 42px', borderRadius: '12px', border: 'none', background: '#2c2c2e', color: 'white', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {(['OVR', 'OFF', 'DEF', 'DEV'] as const).map(s => (
                                <button key={s} onClick={() => setCoachSortBy(s)} style={{
                                    padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.85rem',
                                    background: coachSortBy === s ? '#8b5cf6' : '#2c2c2e',
                                    color: coachSortBy === s ? 'white' : '#888', cursor: 'pointer', whiteSpace: 'nowrap'
                                }}>{s}</button>
                            ))}
                        </div>
                    </div>

                    {/* Coach Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {freeAgentCoaches.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎽</div>
                                <div style={{ fontWeight: 600 }}>No free agent coaches available</div>
                            </div>
                        )}
                        {freeAgentCoaches.map(coach => {
                            const ovr = Math.round((coach.rating.offense + coach.rating.defense + coach.rating.talentDevelopment) / 3);
                            const isExpanded = expandedCoachId === coach.id;
                            const ovrColor = ovr >= 80 ? '#e74c3c' : ovr >= 70 ? '#2ecc71' : '#f1c40f';

                            return (
                                <motion.div key={coach.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ background: '#1c1c1e', borderRadius: '14px', border: '1px solid #2a2a2e', overflow: 'hidden', cursor: 'pointer' }}
                                    onClick={() => setExpandedCoachId(isExpanded ? null : coach.id)}
                                >
                                    <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                        {/* Name + Style */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', lineHeight: 1.2 }}>
                                                {coach.firstName} {coach.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span>{STYLE_ICONS[coach.style] || '🏀'}</span>
                                                <span>{coach.style}</span>
                                            </div>
                                        </div>

                                        {/* Rating pills */}
                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                            {[
                                                { label: 'OFF', value: coach.rating.offense, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                                                { label: 'DEF', value: coach.rating.defense, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
                                                { label: 'DEV', value: coach.rating.talentDevelopment, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                                            ].map(r => (
                                                <div key={r.label} style={{
                                                    background: r.bg, borderRadius: '8px', padding: '4px 10px',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '42px'
                                                }}>
                                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: r.color }}>{r.value}</span>
                                                    <span style={{ fontSize: '0.6rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>{r.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* OVR + salary */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: ovrColor, lineHeight: 1 }}>{ovr}</div>
                                            <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>OVR</div>
                                            <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '3px' }}>{formatMoney(coach.contract.salary)}/yr</div>
                                        </div>

                                        <div style={{ color: '#555', fontSize: '0.85rem', flexShrink: 0, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{ padding: '0 18px 18px', borderTop: '1px solid #2a2a2e' }}>
                                                    <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <RatingBar label="OFF" value={coach.rating.offense} color="#3b82f6" />
                                                        <RatingBar label="DEF" value={coach.rating.defense} color="#ef4444" />
                                                        <RatingBar label="DEV" value={coach.rating.talentDevelopment} color="#f59e0b" />
                                                        <div style={{
                                                            marginTop: '6px', background: '#252528', borderRadius: '10px', padding: '12px',
                                                            fontSize: '0.85rem', color: '#aaa', lineHeight: 1.5
                                                        }}>
                                                            <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{STYLE_ICONS[coach.style]} {coach.style}: </span>
                                                            {STYLE_DESCRIPTIONS[coach.style]}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Modals */}
            <AnimatePresence>
                {selectedPlayerForOffer && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                    }} onClick={() => setSelectedPlayerForOffer(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                            onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px' }}>
                            <NegotiationView
                                player={selectedPlayerForOffer} team={team} salaryCap={salaryCap}
                                onNegotiate={(offer) => ({ decision: 'ACCEPTED', feedback: 'Blind Offer Placed' })}
                                onSign={(offer) => handleSubmitOffer(offer)}
                                onCancel={() => setSelectedPlayerForOffer(null)}
                            />
                        </motion.div>
                    </div>
                )}

                {selectedPlayerForBids && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                    }} onClick={() => setSelectedPlayerForBids(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '90%', maxWidth: '500px', background: '#1c1c1e', borderRadius: '16px', padding: '24px', border: '1px solid #333' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', color: 'white' }}>
                                Active Bids for {selectedPlayerForBids.lastName}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
                                {(activeOffers || []).filter(o => o.playerId === selectedPlayerForBids.id && o.status === 'pending').length > 0 ? (
                                    (activeOffers || [])
                                        .filter(o => o.playerId === selectedPlayerForBids.id && o.status === 'pending')
                                        .map(o => {
                                            let score = o.amount;
                                            const t = teams.find(t => t.id === o.teamId);
                                            if (t && t.wins > 45 && selectedPlayerForBids.age > 29) score *= 1.2;
                                            return { ...o, score };
                                        })
                                        .sort((a, b) => b.score - a.score)
                                        .map(offer => {
                                            const offeringTeam = teams.find(t => t.id === offer.teamId);
                                            const isUser = offer.teamId === userTeamId;
                                            const bestScore = Math.max(...(activeOffers || [])
                                                .filter(o => o.playerId === selectedPlayerForBids.id && o.status === 'pending')
                                                .map(o => {
                                                    let s = o.amount;
                                                    const t = teams.find(tm => tm.id === o.teamId);
                                                    if (t && t.wins > 45 && selectedPlayerForBids.age > 29) s *= 1.2;
                                                    return s;
                                                }));
                                            const chance = Math.round((offer.score / bestScore) * 100);
                                            return (
                                                <div key={offer.id} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '12px 16px', background: '#2c2c2e', borderRadius: '12px',
                                                    borderLeft: isUser ? '4px solid #0ea5e9' : '4px solid #666',
                                                    border: offer.score === bestScore ? '1px solid #2ecc71' : '1px solid transparent'
                                                }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {offeringTeam?.name || 'Unknown Team'}
                                                            {offer.score === bestScore && <span style={{ fontSize: '0.7rem', background: '#2ecc71', color: 'black', padding: '2px 6px', borderRadius: '4px' }}>FAVORITE</span>}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{isUser ? 'Your Offer' : 'AI Offer'} • {chance}% Match</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 700, color: '#2ecc71', fontSize: '1.1rem' }}>{formatMoney(offer.amount)}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{offer.years} years • Day {offer.dayOffered}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No active bids found.</div>
                                )}
                            </div>
                            <button onClick={() => setSelectedPlayerForBids(null)}
                                style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}

                {showDailyRecap && lastFreeAgencyResult && (
                    <DailyRecapModal
                        day={lastFreeAgencyResult.day}
                        offersUpdated={lastFreeAgencyResult.offersUpdated}
                        leagueNews={lastFreeAgencyResult.leagueNews}
                        onClose={handleCloseRecap}
                    />
                )}

                {showFinalSummary && (
                    <FreeAgencySummaryModal players={players} teams={teams} onClose={confirmFinish} />
                )}
            </AnimatePresence>
        </div>
    );
};
