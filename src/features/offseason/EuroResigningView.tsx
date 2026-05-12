
import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import type { Player } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, DollarSign, Briefcase, ChevronRight, BarChart2, MessageSquare, Check, X, ArrowLeft } from 'lucide-react';
import { EuroNegotiationView } from '../negotiation/EuroNegotiationView';

export const EuroResigningView: React.FC = () => {
    const { players, userTeamId, endResigning, signPlayerWithContract, teams, salaryCap, setView } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    // Filter FAs who were on user team last year
    const expiringPlayers = players.filter(p => {
        if (p.teamId) return false;
        const lastSeason = p.careerStats?.[p.careerStats.length - 1];
        return lastSeason && lastSeason.teamId === userTeamId;
    });

    const [actionedPlayers, setActionedPlayers] = useState<string[]>([]);
    const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);

    const handleNegotiationResult = (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => {
        if (!negotiatingPlayer) return { decision: 'REJECTED' as const, feedback: '' };

        // AI CHOICE LOGIC (COPIED FROM NBA)
        const market = calculateContractAmount(negotiatingPlayer, salaryCap);
        const acceptableAmount = calculateAdjustedDemand(negotiatingPlayer, market.amount, market.years, offer.role, offer.years, true);

        const ratio = offer.amount / acceptableAmount;
        let decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED' = 'REJECTED';
        let feedback = '';

        if (ratio >= 0.95) {
            decision = 'ACCEPTED';
            feedback = "I'm happy with this offer. Let's keep winning together!";
        } else if (ratio >= 0.85) {
            if (offer.years > market.years) {
                decision = 'ACCEPTED';
                feedback = "The salary is a bit lower than I expected, but I value the long-term commitment.";
            } else {
                feedback = `We're close. If you can push it to €${(acceptableAmount / 1000000).toFixed(2)}M, I'm in.`;
            }
        } else if (ratio < 0.6) {
            decision = 'INSULTED';
            feedback = "Are you serious? This is disrespectful given my contributions last season.";
        } else {
            const diff = acceptableAmount - offer.amount;
            feedback = `I believe I'm worth more than this. Market value is around €${(market.amount / 1000000).toFixed(2)}M.`;
        }

        return { decision, feedback } as { decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED'; feedback: string };
    };

    const handleSignPlayer = (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => {
        if (negotiatingPlayer) {
            signPlayerWithContract(negotiatingPlayer.id, {
                amount: offer.amount,
                years: offer.years,
                role: offer.role
            });

            setActionedPlayers(prev => [...prev, negotiatingPlayer.id]);
            setNegotiatingPlayer(null);
        }
    };

    const handleRelease = (playerId: string) => {
        setActionedPlayers(prev => [...prev, playerId]);
        if (negotiatingPlayer?.id === playerId) setNegotiatingPlayer(null);
    };

    const visiblePlayers = expiringPlayers.filter(p => !actionedPlayers.includes(p.id));

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            color: 'var(--text-main)',
            background: 'linear-gradient(to bottom, var(--bg-body), rgba(var(--team-primary-rgb), 0.05))',
            minHeight: '100vh'
        }}>
            {/* Standardized Header Design */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: '#1a2a3a', letterSpacing: '-2px', lineHeight: 1.1 }}>
                    CONTRACT<br/>RENEWALS
                </h1>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8898a8', margin: '16px 0 32px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    EURO DAY 2 • RESIGNING PHASE
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                    {/* Budget Section */}
                    <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '28px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8898a8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>BUDGET LEFT</div>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#2ecc71', lineHeight: 1.1 }}>€{((userTeam?.salaryCapSpace || 0) / 1000000).toFixed(1)}M</div>
                    </div>
                    
                    {/* Finish Action */}
                    <button 
                        onClick={endResigning}
                        style={{ 
                            background: '#004a99', color: '#fff', border: 'none', borderRadius: '28px', 
                            fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                            boxShadow: '0 12px 35px rgba(0, 74, 153, 0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 74, 153, 0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 74, 153, 0.3)';
                        }}
                    >
                        FINISH
                    </button>
                </div>
            </div>



            {/* Players Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {visiblePlayers.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', background: 'var(--bg-card)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
                        <Users size={64} color="var(--text-dim)" style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>All contracts settled.</h2>
                        <p style={{ color: 'var(--text-dim)' }}>You can now proceed to global free agency.</p>
                    </div>
                )}

                {visiblePlayers.map(player => {
                    const ovr = calculateOverall(player);
                    const market = calculateContractAmount(player, salaryCap);
                    const lastSeason = player.careerStats?.[player.careerStats.length - 1];

                    return (
                        <motion.div
                            key={player.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: ovr >= 85 ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(241, 196, 15, 0.03) 100%)' : 'var(--bg-card)',
                                borderRadius: '24px',
                                border: ovr >= 85 ? '1px solid rgba(241, 196, 15, 0.2)' : '1px solid var(--border-color)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>{player.firstName} {player.lastName.toUpperCase()}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--team-primary)', background: 'rgba(var(--team-primary-rgb), 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{player.position}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>AGE {player.age}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: ovr >= 85 ? '#b8860b' : 'var(--text-main)', lineHeight: 1 }}>{ovr}</div>
                                        <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>OVR</div>
                                    </div>
                                </div>

                                {/* Last Season Stats */}
                                <div style={{ background: ovr >= 85 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '12px', marginBottom: '16px', border: ovr >= 85 ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: ovr >= 85 ? 'rgba(0,0,0,0.7)' : 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <BarChart2 size={10} /> PERFORMANCE
                                    </div>
                                    {lastSeason ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{(lastSeason.points / (lastSeason.gamesPlayed || 1)).toFixed(1)}</div>
                                                <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>PTS</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{(lastSeason.rebounds / (lastSeason.gamesPlayed || 1)).toFixed(1)}</div>
                                                <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>REB</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{(lastSeason.assists / (lastSeason.gamesPlayed || 1)).toFixed(1)}</div>
                                                <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>AST</div>
                                            </div>
                                            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#27ae60' }}>{lastSeason.fgAttempted > 0 ? ((lastSeason.fgMade / lastSeason.fgAttempted) * 100).toFixed(0) : '0'}%</div>
                                                <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>FG%</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#2980b9' }}>{lastSeason.threeAttempted > 0 ? ((lastSeason.threeMade / lastSeason.threeAttempted) * 100).toFixed(0) : '0'}%</div>
                                                <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontWeight: 800 }}>3P%</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', padding: '4px' }}>No stats</div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => setNegotiatingPlayer(player)}
                                        style={{ flex: 2, padding: '12px', borderRadius: '12px', background: '#000', color: '#fff', border: '1px solid #333', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <MessageSquare size={16} /> NEGOTIATE
                                    </button>
                                    <button 
                                        onClick={() => handleRelease(player.id)}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(231, 76, 60, 0.05)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.1)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        RELEASE
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '8px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)' }}>DEMAND</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>€{(market.amount / 1000000).toFixed(1)}M / YR</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Negotiation Modal */}
            <AnimatePresence>
                {negotiatingPlayer && userTeam && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }} onClick={() => setNegotiatingPlayer(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '600px' }}
                        >
                            <EuroNegotiationView
                                player={negotiatingPlayer}
                                team={userTeam}
                                salaryCap={salaryCap}
                                onNegotiate={handleNegotiationResult}
                                onSign={handleSignPlayer}
                                onCancel={() => setNegotiatingPlayer(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
