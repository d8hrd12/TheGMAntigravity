import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import type { Player } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { NegotiationView } from '../negotiation/NegotiationView';
import { UpcomingFreeAgentsModal } from './UpcomingFreeAgentsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, DollarSign, Briefcase } from 'lucide-react';

interface ResigningViewProps {
    onSelectPlayer?: (id: string) => void;
    onShowMessage?: (title: string, msg: string, type: 'error' | 'info' | 'success') => void;
}

import { PageHeader } from '../ui/PageHeader';

export const ResigningView: React.FC<ResigningViewProps> = ({ onSelectPlayer, onShowMessage }) => {
    const { players, userTeamId, endResigning, signPlayerWithContract, teams, salaryCap } = useGame();

    const userTeam = teams.find(t => t.id === userTeamId);

    // Filter FAs who were on user team last year
    const expiringPlayers = players.filter(p => {
        if (p.teamId) return false;
        const lastSeason = p.careerStats?.[p.careerStats.length - 1];
        return lastSeason && lastSeason.teamId === userTeamId;
    });

    const [actionedPlayers, setActionedPlayers] = useState<string[]>([]);
    const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);
    const [showFAModal, setShowFAModal] = useState(false);

    const handleNegotiationResult = (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => {
        if (!negotiatingPlayer) return { decision: 'REJECTED' as const, feedback: '' };

        const market = calculateContractAmount(negotiatingPlayer, salaryCap);
        const acceptableAmount = calculateAdjustedDemand(negotiatingPlayer, market.amount, market.years, offer.role, offer.years, true);

        const ratio = offer.amount / acceptableAmount;
        let decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED' = 'REJECTED';
        let feedback = '';

        if (ratio >= 0.95) {
            decision = 'ACCEPTED';
            feedback = "I'm happy to accept this offer!";
        } else if (ratio >= 0.85) {
            if (offer.years > market.years) {
                decision = 'ACCEPTED';
                feedback = " The salary is a bit lower than I wanted, but the extra security convinces me.";
            } else {
                feedback = `We are close, but I need at least $${(acceptableAmount / 1000000).toFixed(2)}M.`;
            }
        } else if (ratio < 0.6) {
            decision = 'INSULTED';
            feedback = "That is an insulting offer. I am not sure we can make this work.";
        } else {
            const diff = acceptableAmount - offer.amount;
            if (diff < 1000000) {
                feedback = `We are close. I need around $${(acceptableAmount / 1000000).toFixed(2)}M.`;
            } else {
                feedback = `That offer is too low. Market value is around $${(market.amount / 1000000).toFixed(2)}M.`;
            }
        }

        return { decision, feedback };
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
            onShowMessage?.("Deal Accepted", `${negotiatingPlayer.firstName} ${negotiatingPlayer.lastName} has re-signed!`, "success");
        }
    };

    const handleRelease = (playerId: string) => {
        setActionedPlayers(prev => [...prev, playerId]);
        if (negotiatingPlayer?.id === playerId) setNegotiatingPlayer(null);
    };

    const visiblePlayers = expiringPlayers.filter(p => !actionedPlayers.includes(p.id));

    return (
        <div style={{ color: 'var(--text-main)', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <PageHeader 
                title="Re-sign Players"
                subtitle="Negotiate extensions before Free Agency begins."
                onBack={endResigning}
                backLabel="Finish"
                teamColor={userTeam?.colors?.primary}
            >
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => setShowFAModal(true)}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem' }}
                    >
                        <Users size={18} />
                        View Upcoming Free Agents
                    </button>

                    <button
                        onClick={endResigning}
                        className="btn-primary"
                        style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
                    >
                        Finish & Advance
                    </button>
                </div>
            </PageHeader>

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Financial Status Bar */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px',
                background: 'var(--surface)',
                padding: '15px 25px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', color: '#2ecc71' }}>
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Available Cash</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>${((userTeam?.cash || 0) / 1000000).toFixed(1)}M</div>
                    </div>
                </div>

                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '10px',
                        background: (userTeam?.salaryCapSpace || 0) > 0 ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                        borderRadius: '12px',
                        color: (userTeam?.salaryCapSpace || 0) > 0 ? '#3498db' : '#e74c3c'
                    }}>
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Cap Space</div>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: (userTeam?.salaryCapSpace || 0) > 0 ? '#3498db' : '#e74c3c'
                        }}>
                            ${((userTeam?.salaryCapSpace || 0) / 1000000).toFixed(1)}M
                        </div>
                    </div>
                </div>
            </div>

            {/* Players List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {visiblePlayers.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: '20px' }}>
                        <h3>No players left to re-sign.</h3>
                        <p>You can proceed to Free Agency.</p>
                    </div>
                )}

                {visiblePlayers.map(player => {
                    const ovr = calculateOverall(player);
                    const market = calculateContractAmount(player, salaryCap); // Estimate for badge

                    return (
                        <motion.div
                            key={player.id}
                            whileHover={{ y: -5, background: 'rgba(255,255,255,0.95)' }}
                            onClick={() => setNegotiatingPlayer(player)}
                            style={{
                                background: 'rgba(255,255,255,0.9)', // Lighter background for dark text
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '24px',
                                padding: '24px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* Decorative Frame Line */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--team-primary, #FF5F1F)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); onSelectPlayer?.(player.id); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', letterSpacing: '-0.5px' }}>
                                            {player.firstName} <span style={{ color: '#555' }}>{player.lastName.toUpperCase()}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {player.position} • {player.age} Years Old
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StarRating stars={calculateStars(ovr, 75)} size={10} />
                                </div>
                            </div>

                            {/* Stats Preview Frame */}
                            {player.careerStats && player.careerStats.length > 0 && (() => {
                                const lastS = player.careerStats[player.careerStats.length - 1];
                                const gp = lastS.gamesPlayed || 1;
                                return (
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1px', 
                                        background: 'rgba(0,0,0,0.1)', 
                                        borderRadius: '16px', 
                                        overflow: 'hidden',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Points</div>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111' }}>{(lastS.points / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Rebounds</div>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111' }}>{(lastS.rebounds / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Assists</div>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111' }}>{(lastS.assists / gp).toFixed(1)}</div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                borderTop: '1px solid var(--border)',
                                paddingTop: '12px'
                            }}>
                                <span>Expiring Contract</span>
                                <span style={{ color: '#2ecc71', fontWeight: 600 }}>Asking ~${(market.amount / 1000000).toFixed(1)}M</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Negotiation Modal */}
            <AnimatePresence>
                {negotiatingPlayer && userTeam && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }} onClick={() => setNegotiatingPlayer(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '650px' }}
                        >
                            <NegotiationView
                                player={negotiatingPlayer}
                                team={userTeam}
                                salaryCap={salaryCap}
                                onNegotiate={handleNegotiationResult}
                                onSign={handleSignPlayer}
                                onCancel={() => setNegotiatingPlayer(null)}
                            // We can use onSelectPlayer to show detail if needed, but for now modal is enough focus
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Upcoming FA Modal */}
            <UpcomingFreeAgentsModal
                isOpen={showFAModal}
                onClose={() => setShowFAModal(false)}
            />

            </div>
        </div>
    );
};
