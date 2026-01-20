import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { generateTradeOffers } from './TradeLogic';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { TradeProposal } from '../../models/TradeProposal';
import { calculateOverall } from '../../utils/playerUtils';
import { ChevronRight, DollarSign, RefreshCw, X } from 'lucide-react';

interface TradeFinderViewProps {
    shopPlayerId: string;
    onClose: () => void;
    onAccept: (offer: TradeProposal) => void;
    onSelectPlayer?: (playerId: string) => void;
}

export const TradeFinderView: React.FC<TradeFinderViewProps> = ({ shopPlayerId, onClose, onAccept, onSelectPlayer }) => {
    const { teams, players, contracts, salaryCap, date, draftClass, userTeamId } = useGame(); // Need picks? context might not expose picks directly easily
    // Assuming context exposes 'draftPicks' or similar?
    // Looking at GameContext, 'draftOrder' is exposed but not raw picks array easily? 
    // Wait, 'executeTrade' handles picks. 
    // generateTradeOffers needs picks. 
    // Let's check GameContext again for 'draftPicks'.
    // If not exposed, I might need to mock or fetch from teams?
    // Actually teams have assets? No, teams have rosterIds.
    // Let's assume for now we pass empty picks array or fix GameContext later to expose picks.
    // NOTE: GameContext exports 'draftPicks'? No, it likely has internal state.
    // I will try to use 'draftClass' which is players.
    // Draft picks are stored in 'draftPicks' in GameState but maybe not exposed in values?
    // I'll check. If not, I'll update GameContext to expose 'draftPicks' or 'getDraftPicks' helper.

    // For now, let's implement the View assuming we can get offers.

    const [offers, setOffers] = useState<TradeProposal[]>([]);
    const [loading, setLoading] = useState(true);

    const shopPlayer = players.find(p => p.id === shopPlayerId);
    const userTeam = teams.find(t => t.id === userTeamId);

    useEffect(() => {
        if (userTeam && shopPlayer) {
            // Simulate network delay for "Finding Trades..." effect
            setTimeout(() => {
                try {
                    // Gather all picks from all teams
                    const allPicks = teams.flatMap(t => t.draftPicks);

                    const generated = generateTradeOffers(
                        userTeam,
                        shopPlayerId,
                        teams,
                        players,
                        contracts,
                        allPicks,
                        salaryCap,
                        date.getFullYear()
                    );
                    setOffers(generated);
                } catch (err) {
                    console.error("Trade Finder Error:", err);
                    // We could set an error state here to show in UI
                } finally {
                    setLoading(false);
                }
            }, 800);
        }
    }, [shopPlayerId]);

    const getPlayer = (id: string) => players.find(p => p.id === id);
    const getTeam = (id: string) => teams.find(t => t.id === id);

    if (!shopPlayer || !userTeam) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 3000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--background)',
                width: '100%', maxWidth: '600px',
                height: '80%', maxHeight: '700px',
                borderRadius: '16px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Trade Finder</h2>
                        <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>
                            Shopping <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{shopPlayer.firstName} {shopPlayer.lastName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                    {loading ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <RefreshCw className="spin" size={32} style={{ marginBottom: '15px' }} />
                            <p>Querying League GMs...</p>
                        </div>
                    ) : offers.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>
                            <p>No teams made an offer for {shopPlayer.lastName}.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Try waiting closer to the deadline or lowering your expectations.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {offers.map((offer, idx) => {
                                const aiTeam = getTeam(offer.aiTeamId);
                                const salaryIn = offer.aiPlayerIds.reduce((sum, id) => {
                                    const c = contracts.find(c => c.playerId === id);
                                    return sum + (c?.amount || 0);
                                }, 0);

                                return (
                                    <div key={idx} style={{
                                        background: 'var(--surface-active)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {aiTeam?.city} {aiTeam?.name}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                                    Valid Offer
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            {/* Incoming Assets */}
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>THEY OFFER</div>
                                                {offer.aiPlayerIds.map(pid => {
                                                    const p = players.find(x => x.id === pid);
                                                    if (!p) return null;
                                                    // Check for OVR
                                                    const ovr = calculateOverall(p);

                                                    return (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => onSelectPlayer && onSelectPlayer(p.id)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', cursor: 'pointer' }}
                                                        >
                                                            <div style={{ fontWeight: 'bold' }}>{p.firstName} {p.lastName}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                                {p.position} • {p.age}yo • <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{ovr} OVR</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {offer.aiPickIds.map(pid => {
                                                    // Find pick from all teams
                                                    const pick = teams.flatMap(t => t.draftPicks).find(p => p.id === pid);
                                                    if (!pick) return <div key={pid} style={{ fontSize: '0.8rem', color: '#666' }}>Draft Pick (Unknown)</div>;

                                                    return (
                                                        <div key={pid} style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <span>{pick.year} Rd {pick.round}</span>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                (via {pick.originalTeamName || 'UNK'})
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div style={{ color: 'var(--text-secondary)' }}>
                                                <ChevronRight />
                                            </div>

                                            {/* Outgoing (Just Shop Player for now) */}
                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>YOU SEND</div>
                                                <div style={{ fontWeight: 'bold' }}>{shopPlayer.firstName} {shopPlayer.lastName}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                                            <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <DollarSign size={14} />
                                                Incoming Salary: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(salaryIn)}
                                            </div>
                                            <button
                                                onClick={() => onAccept(offer)}
                                                className="btn-primary"
                                                style={{ padding: '8px 20px', borderRadius: '8px' }}
                                            >
                                                View Trade
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
