import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface UpcomingFreeAgentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpcomingFreeAgentsModal: React.FC<UpcomingFreeAgentsModalProps> = ({ isOpen, onClose }) => {
    const { players, teams, userTeamId, contracts } = useGame();

    const detailedFAs = useMemo(() => {
        if (!isOpen) return [];

        // 1. Identify Expiring Players
        // Logic: expiring means yearsLeft === 0 OR yearsLeft === 1 if we dictate next season preview.
        // User wants "Upcoming Free Agents" (Next Summer potentially or current summer).
        // Since this modal is usually for Resigning Phase, "expiring" means specific contracts ending NOW.
        // Robustness: Filter ANY player whose active contract (teamId matched) has yearsLeft <= 1

        // Let's create a map of player -> contract
        const playerContractMap = new Map();
        contracts.forEach(c => {
            if (c.yearsLeft <= 1) playerContractMap.set(c.playerId, c);
        });

        return players
            .filter(p => {
                // Must belong to another team
                if (!p.teamId || p.teamId === userTeamId) return false;

                // Must have expiring contract
                // We check existing `contracts` state.
                const contract = playerContractMap.get(p.id);
                // Also check if simply the player object has yearsLeft (for older saves/compatibility)
                // If yearsLeft is 0 or 1, we consider them "Upcoming FA" for the list.
                return !!contract;
            })
            .map(p => {
                const team = teams.find(t => t.id === p.teamId);
                const ovr = calculateOverall(p);

                // Resign Intent Logic (Simulation)
                let intent = 'Unsure';
                let intentColor = '#999';

                const teamSuccess = team ? team.wins / (Math.max(1, team.wins + team.losses)) : 0.5;
                const happiness = p.morale || 80;

                if (happiness > 90 && teamSuccess > 0.55) {
                    intent = 'Likely to Resign';
                    intentColor = '#34c759';
                } else if (happiness < 60 || teamSuccess < 0.4) {
                    intent = 'Wants Out';
                    intentColor = '#ff3b30';
                } else {
                    intent = 'Testing Market';
                    if (ovr > 85) intentColor = '#ff9f0a';
                }

                return { ...p, team, ovr, intent, intentColor };
            })
            .sort((a, b) => b.ovr - a.ovr); // Sort by best players
    }, [isOpen, players, contracts, teams, userTeamId]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }} onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#1c1c1e',
                        width: '95%', maxWidth: '1000px', maxHeight: '85vh',
                        borderRadius: '20px', border: '1px solid #333',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '20px 25px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2c2c2e' }}>
                        <div>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Upcoming Free Agents</h2>
                            <p style={{ margin: '5px 0 0', color: '#aaa', fontSize: '0.9rem' }}>All players from other teams with expiring contracts.</p>
                        </div>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '5px' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* List */}
                    <div style={{ overflowY: 'auto', padding: '20px' }}>
                        <div style={{ display: 'grid', flexDirection: 'column', gap: '10px' }}>
                            {detailedFAs.map(p => {
                                // Stats
                                const lastS = p.careerStats && p.careerStats.length > 0 ? p.careerStats[p.careerStats.length - 1] : null;
                                const gp = lastS ? (lastS.gamesPlayed || 1) : 1;
                                const ppg = lastS ? (lastS.points / gp).toFixed(1) : '–';
                                const rpg = lastS ? (lastS.rebounds / gp).toFixed(1) : '–';
                                const apg = lastS ? (lastS.assists / gp).toFixed(1) : '–';
                                const fgp = lastS && lastS.fgAttempted ? ((lastS.fgMade / lastS.fgAttempted) * 100).toFixed(0) : '-';
                                const tp = lastS && lastS.threeAttempted ? ((lastS.threeMade / lastS.threeAttempted) * 100).toFixed(0) : '-';

                                return (
                                    <div key={p.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px', background: '#262626', borderRadius: '12px', border: '1px solid #333'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                            {/* Info */}
                                            <div style={{ minWidth: '200px' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{p.firstName} {p.lastName}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#999', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                    <span style={{ fontWeight: 700, color: '#white', background: '#444', padding: '2px 6px', borderRadius: '4px' }}>{p.position}</span>
                                                    <span>•</span>
                                                    <span style={{ color: p.ovr >= 85 ? '#ffd60a' : '#ddd', fontWeight: 700 }}>{p.ovr} OVR</span>
                                                    <span>•</span>
                                                    <span>{p.age}yo</span>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', textAlign: 'center' }}>
                                                <div><div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>PTS</div><div style={{ color: 'white', fontWeight: 700 }}>{ppg}</div></div>
                                                <div><div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>REB</div><div style={{ color: 'white', fontWeight: 700 }}>{rpg}</div></div>
                                                <div><div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>AST</div><div style={{ color: 'white', fontWeight: 700 }}>{apg}</div></div>
                                                <div style={{ borderLeft: '1px solid #444', paddingLeft: '15px' }}><div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>FG%</div><div style={{ color: 'white', fontWeight: 700 }}>{fgp}%</div></div>
                                                <div><div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>3P%</div><div style={{ color: 'white', fontWeight: 700 }}>{tp}%</div></div>
                                            </div>
                                        </div>

                                        {/* Team & Intent */}
                                        <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888' }}>Current: {p.team?.abbreviation}</div>
                                            <div style={{
                                                marginTop: '6px', display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
                                                background: `${p.intentColor}22`, color: p.intentColor, fontWeight: 700, fontSize: '0.85rem'
                                            }}>
                                                {p.intent}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {detailedFAs.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#666', fontStyle: 'italic' }}>
                                    No upcoming free agents found. (Check league contract statuses)
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
