
import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import type { Player } from '../../models/Player';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { EuroNegotiationView } from '../negotiation/EuroNegotiationView';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, DollarSign, Users, TrendingUp, BarChart2, Star, ChevronRight, X, ArrowLeft, Zap, Calendar } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';


export const EuroFreeAgencyView: React.FC<any> = ({ onBack, onComplete }) => {
    const { 
        players, teams, userTeamId, salaryCap, 
        freeAgencyDay, activeOffers, placeOffer, advanceFreeAgencyDay,
        lastFreeAgencyResult, setGameState, setView, completeOffseasonTask
    } = useGame();

    const team = teams.find(t => t.id === userTeamId)!;
    const userTeamBaseline = React.useMemo(() => calculateTeamBaseline(players.filter(p => p.teamId === userTeamId)), [players, userTeamId]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPos, setFilterPos] = useState<'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'>('All');
    const [selectedPlayerForOffer, setSelectedPlayerForOffer] = useState<Player | null>(null);

    const filteredAgents = players
        .filter(p => !p.teamId)
        .filter(p => filterPos === 'All' || p.position === filterPos)
        .filter(p => searchTerm ? (`${p.firstName} ${p.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) : true)
        .sort((a, b) => calculateOverall(b) - calculateOverall(a));

    const handleNegotiationResult = (offer: { amount: number; years: number; role: any }) => {
        if (!selectedPlayerForOffer) return { decision: 'REJECTED' as const, feedback: '' };
        
        // Use NBA logic for acceptance
        const market = calculateContractAmount(selectedPlayerForOffer, salaryCap);
        const acceptableAmount = calculateAdjustedDemand(selectedPlayerForOffer, market.amount, market.years, offer.role, offer.years, true);
        const ratio = offer.amount / acceptableAmount;

        if (ratio >= 0.95) return { decision: 'ACCEPTED' as const, feedback: "I'm ready to sign! This is a great project." };
        if (ratio >= 0.8) return { decision: 'REJECTED' as const, feedback: "We're close, but I have better offers elsewhere." };
        return { decision: 'INSULTED' as const, feedback: "This offer is nowhere near my market value." };
    };

    const handleSignPlayer = (offer: { amount: number; years: number; role: any }) => {
        if (selectedPlayerForOffer) {
            placeOffer(selectedPlayerForOffer.id, offer.amount, offer.years);
            setSelectedPlayerForOffer(null);
        }
    };

    const formatMoney = (amount: number) => `€${(amount / 1000000).toFixed(1)}M`;

    return (
        <div style={{ 
            padding: '24px', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            color: 'var(--text-main)',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--bg-body) 0%, rgba(var(--team-primary-rgb), 0.05) 100%)'
        }}>
            <PageHeader
                title="Global Market"
                subtitle={`Euro Day ${freeAgencyDay} • Recruiting`}
                onBack={onBack || (() => setView('dashboard'))}
                teamColor={team?.colors?.primary}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                    {/* Budget Section */}
                    <div style={{ background: 'var(--bg-card-hover)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>BUDGET</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2ecc71', lineHeight: 1.1 }}>{formatMoney(team.salaryCapSpace)}</div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={advanceFreeAgencyDay}
                            style={{ 
                                flex: 1,
                                background: 'rgba(var(--team-primary-rgb), 0.1)', 
                                color: 'var(--team-primary)', 
                                border: '1px solid var(--team-primary)', 
                                borderRadius: '16px', 
                                fontSize: '0.9rem', 
                                fontWeight: 900, 
                                cursor: 'pointer', 
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                padding: '12px 16px',
                                gap: '8px'
                            }}
                        >
                            <Calendar size={18} />
                            Next Day
                        </button>

                        <button 
                            onClick={() => completeOffseasonTask('freeAgency')}
                            style={{ 
                                flex: 1,
                                background: 'var(--team-primary)', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '16px', 
                                fontSize: '0.9rem', 
                                fontWeight: 900, 
                                cursor: 'pointer', 
                                textTransform: 'uppercase',
                                boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.25)', 
                                transition: 'all 0.3s ease',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                padding: '12px 16px'
                            }}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </PageHeader>

            {/* Daily Recap Section */}
            {lastFreeAgencyResult && lastFreeAgencyResult.day === freeAgencyDay && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        background: 'rgba(46, 204, 113, 0.1)', 
                        border: '1px solid #2ecc71', 
                        borderRadius: '20px', 
                        padding: '20px', 
                        marginBottom: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2ecc71' }}>
                        <Zap size={20} />
                        <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Day {freeAgencyDay} Recap</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                        {lastFreeAgencyResult.offersUpdated.map((offer: any) => {
                            const p = players.find(x => x.id === offer.playerId);
                            return (
                                <div key={offer.id} style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ fontWeight: 800 }}>{p?.lastName}</span>: 
                                    <span style={{ 
                                        marginLeft: '6px', 
                                        color: offer.status === 'accepted' ? '#2ecc71' : '#e74c3c',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}>
                                        {offer.status}
                                    </span>
                                </div>
                            );
                        })}
                        {lastFreeAgencyResult.leagueNews.slice(0, 3).map((news: string, i: number) => (
                            <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                • {news}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                        type="text" 
                        placeholder="Search for talent..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 500 }}
                    />
                </div>
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto', 
                    paddingBottom: '8px',
                    whiteSpace: 'nowrap',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    maxWidth: '100%'
                }}>
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                        <button 
                            key={pos}
                            onClick={() => setFilterPos(pos as any)}
                            style={{
                                padding: '0 24px',
                                height: '48px',
                                borderRadius: '16px',
                                border: filterPos === pos ? '1px solid var(--team-primary)' : '1px solid var(--border-color)',
                                background: filterPos === pos ? 'rgba(var(--team-primary-rgb), 0.1)' : 'var(--bg-card)',
                                color: filterPos === pos ? 'var(--team-primary)' : 'var(--text-dim)',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>

            {/* Players Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {filteredAgents.slice(0, 50).map(player => {
                    const ovr = calculateOverall(player);
                    const market = calculateContractAmount(player, salaryCap);
                    const lastS = player.careerStats?.[player.careerStats.length - 1];
                    const pending = activeOffers?.find(o => o.playerId === player.id && o.teamId === userTeamId);

                    return (
                        <motion.div
                            key={player.id}
                            whileHover={{ y: -5 }}
                            style={{
                                background: ovr >= 85 ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(241, 196, 15, 0.05) 100%)' : 'var(--bg-card)',
                                borderRadius: '24px',
                                border: ovr >= 85 ? '1px solid rgba(241, 196, 15, 0.3)' : '1px solid var(--border-color)',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: ovr >= 85 ? '0 10px 30px rgba(241, 196, 15, 0.1)' : 'none'
                            }}
                        >
                            {pending && (
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#2ecc71', color: '#000', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, zIndex: 2 }}>
                                    OFFER PENDING
                                </div>
                            )}

                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2px', color: 'var(--text-main)' }}>{player.firstName} {player.lastName}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)', background: 'rgba(var(--team-primary-rgb), 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{player.position}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>{player.age} YEARS OLD</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: ovr >= 85 ? '#b8860b' : 'var(--text-main)', lineHeight: 1 }}>{ovr}</div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                            <StarRating stars={calculateStars(ovr, userTeamBaseline)} size={10} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', background: 'rgba(0,0,0,0.03)', padding: '12px 8px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{lastS ? (lastS.points / (lastS.gamesPlayed || 1)).toFixed(1) : '0.0'}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>PTS</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{lastS ? (lastS.rebounds / (lastS.gamesPlayed || 1)).toFixed(1) : '0.0'}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>REB</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{lastS ? (lastS.assists / (lastS.gamesPlayed || 1)).toFixed(1) : '0.0'}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>AST</div>
                                    </div>
                                    <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#27ae60' }}>{lastS && lastS.fgAttempted > 0 ? ((lastS.fgMade / lastS.fgAttempted) * 100).toFixed(0) : '0'}%</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>FG%</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#2980b9' }}>{lastS && lastS.threeAttempted > 0 ? ((lastS.threeMade / lastS.threeAttempted) * 100).toFixed(0) : '0'}%</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>3P%</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>MARKET VALUE</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>{formatMoney(market.amount)}<span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}> / year</span></div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedPlayerForOffer(player)}
                                        disabled={!!pending}
                                        style={{ 
                                            padding: '12px 24px', 
                                            borderRadius: '12px', 
                                            background: pending ? 'var(--bg-body)' : 'var(--team-primary)', 
                                            color: pending ? 'var(--text-dim)' : '#fff', 
                                            border: 'none', 
                                            fontWeight: 900, 
                                            cursor: pending ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Zap size={16} /> {pending ? 'SENT' : 'RECRUIT'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Negotiation Modal */}
            <AnimatePresence>
                {selectedPlayerForOffer && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }} onClick={() => setSelectedPlayerForOffer(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '600px' }}
                        >
                            <EuroNegotiationView
                                player={selectedPlayerForOffer}
                                team={team}
                                salaryCap={salaryCap}
                                onNegotiate={handleNegotiationResult}
                                onSign={handleSignPlayer}
                                onCancel={() => setSelectedPlayerForOffer(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
