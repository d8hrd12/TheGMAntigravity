import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import type { Player } from '../../../models/Player';
import type { Team } from '../../../models/Team';
import { calculateOverall } from '../../../utils/playerUtils';

interface FreeAgencySummaryModalProps {
    players: Player[];
    teams: Team[];
    onClose: () => void;
}

export const FreeAgencySummaryModal: React.FC<FreeAgencySummaryModalProps> = ({ players, teams, onClose }) => {

    // Filter for players who changed teams via Free Agency (simple heuristic: acquisition type logic or just check new contracts)
    // For now, we'll list top players who have a new teamId

    // We can assume `players` has the updated state. 
    // Ideally we want "Previous Team" vs "New Team".
    // Since we don't have explicit "Previous Team" stored easily on the player object without checking history,
    // we will rely on what we can display. 

    // BETTER: Filter players acquired by "free_agent" in the current year.
    const currentYear = new Date().getFullYear(); // This might be drifting, but ok for display
    // Actually we should filter by `acquisition` field if we set it.

    const significantSignings = players
        .filter(p => p.acquisition?.type === 'free_agent')
        .sort((a, b) => calculateOverall(b) - calculateOverall(a))
        .slice(0, 50);

    const getTeamName = (id: string | null | undefined) => {
        if (!id) return 'FA';
        return teams.find(t => t.id === id)?.name || 'Unknown';
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#1c1c1e', width: '90%', maxWidth: '800px', height: '80vh',
                    borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{ padding: '30px', background: 'linear-gradient(to right, #0f172a, #1e293b)', borderBottom: '1px solid #333', textAlign: 'center' }}>
                    <h1 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>Free Agency Report</h1>
                    <p style={{ margin: '10px 0 0 0', color: '#94a3b8' }}>Summary of major offseason moves.</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Player</th>
                                <th style={{ textAlign: 'center', padding: '10px' }}>OVR</th>
                                <th style={{ textAlign: 'right', padding: '10px' }}>New Home</th>
                            </tr>
                        </thead>
                        <tbody>
                            {significantSignings.map(p => {
                                const prevTeamId = p.acquisition?.previousTeamId;
                                const prevTeamName = getTeamName(prevTeamId);
                                const newTeamName = getTeamName(p.teamId);

                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #2c2c2e' }}>
                                        <td style={{ padding: '15px 10px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.firstName} {p.lastName}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#888' }}>{p.position} • {p.age}yo</div>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 700, color: '#f1c40f' }}>
                                            {calculateOverall(p)}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <span style={{ color: '#888' }}>{prevTeamName}</span>
                                                <ArrowRight size={14} color="#555" />
                                                <span style={{ color: '#3498db', fontWeight: 600 }}>{newTeamName}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {significantSignings.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                        No major signings recorded this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '20px', background: '#1e1e20', borderTop: '1px solid #333' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%', padding: '14px', background: '#34c759', color: 'white',
                            border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer'
                        }}
                    >
                        Complete Offseason
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
