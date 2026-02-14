import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import type { Player } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';
import { NegotiationView } from '../negotiation/NegotiationView';
import { UpcomingFreeAgentsModal } from './UpcomingFreeAgentsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, DollarSign, Briefcase } from 'lucide-react';

interface ResigningViewProps {
    onSelectPlayer?: (id: string) => void;
    onShowMessage?: (title: string, msg: string, type: 'error' | 'info' | 'success') => void;
}

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
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text)' }}>

            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Re-sign Players</h1>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Negotiate extensions before Free Agency begins.
                    </p>
                </div>

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
            </div>

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
                            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                            onClick={() => setNegotiatingPlayer(player)}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                padding: '20px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

                                    <div
                                        onClick={(e) => { e.stopPropagation(); onSelectPlayer?.(player.id); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{player.firstName} {player.lastName}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{player.position} • {player.age} yo</div>
                                    </div>
                                </div>
                                <div style={{
                                    background: ovr >= 85 ? 'linear-gradient(135deg, #f1c40f, #f39c12)' : '#ecf0f1',
                                    color: ovr >= 85 ? '#fff' : '#2c3e50',
                                    padding: '5px 12px',
                                    borderRadius: '8px',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    boxShadow: ovr >= 85 ? '0 2px 10px rgba(243, 156, 18, 0.3)' : 'none'
                                }}>
                                    {ovr}
                                </div>
                            </div>

                            {/* Stats Preview */}
                            {player.careerStats && player.careerStats.length > 0 && (() => {
                                const lastS = player.careerStats[player.careerStats.length - 1];
                                const gp = lastS.gamesPlayed || 1;
                                return (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '4px', marginBottom: '15px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>PTS</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.points / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>REB</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.rebounds / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>AST</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.assists / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>SPG</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.steals / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>BPG</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.blocks / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>MPG</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(lastS.minutes / gp).toFixed(1)}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>FG%</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lastS.fgAttempted > 0 ? ((lastS.fgMade / lastS.fgAttempted) * 100).toFixed(0) + '%' : '-'}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>3P%</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lastS.threeAttempted > 0 ? ((lastS.threeMade / lastS.threeAttempted) * 100).toFixed(0) + '%' : '-'}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>FT%</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lastS.ftAttempted > 0 ? ((lastS.ftMade / lastS.ftAttempted) * 100).toFixed(0) + '%' : '-'}</div>
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
    );
};
