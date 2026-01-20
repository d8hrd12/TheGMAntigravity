
import React, { useState, useEffect } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { optimizeRotation, type RotationStrategy } from '../../utils/rotationUtils';
import { Info, Play, Users, BarChart2, Plus, Minus } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface RotationViewProps {
    players: Player[];
    team: Team;
    onBack: () => void;
    onSave: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => void;
    onSelectPlayer: (playerId: string) => void;
}

export const RotationView: React.FC<RotationViewProps> = ({ players, team, onBack, onSave, onSelectPlayer }) => {
    const [roster, setRoster] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<RotationStrategy>('Standard');
    const isFirstRun = React.useRef(true);
    const lastSavedRoster = React.useRef<string>('');

    useEffect(() => {
        // Only initialize if roster is empty or team changed
        if (roster.length > 0 && roster[0].teamId === team.id) {
            return;
        }

        const teamPlayers = players.filter(p => p.teamId === team.id);

        // CHECK IF MINUTES ARE ALREADY ASSIGNED (Persisted State)
        const totalMinutes = teamPlayers.reduce((sum, p) => sum + (p.minutes || 0), 0);
        const hasValidRotation = totalMinutes >= 200 && totalMinutes <= 240; // Approx check

        if (hasValidRotation) {
            // Sort by existing rotation index if possible, otherwise by isStarter/minutes
            const sorted = [...teamPlayers].sort((a, b) => {
                const aIdx = a.rotationIndex ?? 99;
                const bIdx = b.rotationIndex ?? 99;
                return aIdx - bIdx;
            });
            setRoster(sorted);
            setSelectedStrategy('Custom'); // Assuming it's already customized
        } else {
            // Apply initial optimization only if no valid state
            const optimized = optimizeRotation(teamPlayers, 'Standard');
            setRoster(optimized);
        }

        isFirstRun.current = false;
    }, [players, team.id]);

    // Auto-Save Effect - DISABLED for now based on user request for manual save
    // useEffect(() => { ... }, [roster, onSave]);

    const handleSave = () => {
        const updates = roster.map((p, index) => ({
            id: p.id,
            minutes: p.minutes || 0,
            isStarter: index < 5, // Top 5 are starters
            rotationIndex: index // SAVE THE ORDER
        }));

        onSave(updates);
    };

    const applyStrategy = (strategy: RotationStrategy) => {
        if (strategy === 'Custom') return; // Should not happen via button
        const optimized = optimizeRotation(roster, strategy);
        setRoster(optimized);
        setSelectedStrategy(strategy);
    };

    const changeMinutes = (e: React.MouseEvent, index: number, delta: number) => {
        e.stopPropagation();

        setRoster(prev => {
            const newRoster = [...prev];
            const player = newRoster[index];
            const currentMinutes = player.minutes || 0;
            const newMinutes = currentMinutes + delta;

            // 1. Bounds check
            if (newMinutes < 0 || newMinutes > 48) return prev;

            // 2. Cap check (only if adding)
            if (delta > 0) {
                const currentTotal = prev.reduce((sum, p) => sum + (p.minutes || 0), 0);
                if (currentTotal >= 240) return prev; // Hard cap
            }

            newRoster[index] = { ...player, minutes: newMinutes };
            return newRoster;
        });

        setSelectedStrategy('Custom');
    };

    const handlePlayerClick = (id: string, index: number) => {
        if (!selectedPlayerId) {
            // Select first player to swap
            setSelectedPlayerId(id);
        } else if (selectedPlayerId === id) {
            // Deselect if same player clicked
            setSelectedPlayerId(null);
        } else {
            // Swap logic
            const firstIndex = roster.findIndex(p => p.id === selectedPlayerId);
            const secondIndex = index;

            if (firstIndex !== -1 && secondIndex !== -1) {
                const newRoster = [...roster];
                // Swap elements
                [newRoster[firstIndex], newRoster[secondIndex]] = [newRoster[secondIndex], newRoster[firstIndex]];
                setRoster(newRoster);
            }
            setSelectedPlayerId(null);
        }
    };

    const totalMinutes = roster.reduce((sum, p) => sum + (p.minutes || 0), 0);

    return (
        <div style={{ width: '100%', margin: '0 auto', padding: '10px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <BackButton onClick={onBack} />
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Rotation</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            background: '#2ecc71',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['Standard', 'Heavy Starters', 'Deep Bench'] as RotationStrategy[]).map(s => {
                    const isActive = selectedStrategy === s;
                    return (
                        <button
                            key={s}
                            onClick={() => applyStrategy(s)}
                            style={{
                                padding: '10px 4px',
                                background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: isActive ? 'white' : '#aaa',
                                border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: isActive ? 'bold' : 'normal',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {s}
                        </button>
                    )
                })}
            </div>

            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '10px', fontSize: '0.85rem' }}>
                <div>
                    <span style={{ color: '#fff' }}>
                        {selectedPlayerId ? 'Tap another to swap' : 'Tap two to swap order.'}
                    </span>
                </div>
                <div>
                    <strong style={{ color: '#fff' }}>Mins:</strong> <span style={{ color: totalMinutes === 240 ? '#2ecc71' : (Math.abs(totalMinutes - 240) < 10 ? '#f1c40f' : '#e74c3c') }}>{totalMinutes}/240</span>
                </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'center', color: '#aaa', width: '30px' }}>#</th>
                            <th style={{ padding: '8px', textAlign: 'left', color: '#aaa' }}>Player</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: '#aaa' }}>Pos</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: '#aaa' }}>OVR</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: '#aaa' }}>Min</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((player, index) => {
                            const isStarter = index < 5;
                            const isSelected = selectedPlayerId === player.id;

                            // Selection Glow Logic
                            let rowBackground = isStarter ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent';
                            let rowBoxShadow = 'none';
                            let rowBorder = index === 4 ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)';

                            if (isSelected) {
                                if (isStarter) {
                                    // Starter Selected -> Red Glow
                                    rowBackground = 'rgba(231, 76, 60, 0.2)'; // Red tint
                                    rowBoxShadow = '0 0 15px rgba(231, 76, 60, 0.6) inset';
                                    rowBorder = '1px solid #e74c3c';
                                } else {
                                    // Bench Selected -> Green Glow
                                    rowBackground = 'rgba(46, 204, 113, 0.2)'; // Green tint
                                    rowBoxShadow = '0 0 15px rgba(46, 204, 113, 0.6) inset';
                                    rowBorder = '1px solid #2ecc71';
                                }
                            }

                            return (
                                <tr
                                    key={player.id}
                                    onClick={() => handlePlayerClick(player.id, index)}
                                    style={{
                                        borderBottom: rowBorder,
                                        background: rowBackground,
                                        boxShadow: rowBoxShadow,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        position: 'relative' // Needed for z-index if shadow overlaps?
                                    }}
                                >
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#888', fontWeight: 'bold' }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); onSelectPlayer(player.id); }}
                                                style={{ fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                {player.firstName.charAt(0)}. {player.lastName}
                                                <Info size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                            </div>
                                        </div>
                                        {isStarter && <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold' }}>START</span>}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#ccc' }}>{player.position}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{calculateOverall(player)}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}>
                                            <button
                                                onClick={(e) => changeMinutes(e, index, -1)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    color: '#fff',
                                                    borderRadius: '4px',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span style={{ color: '#fff', width: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{player.minutes}</span>
                                            <button
                                                onClick={(e) => changeMinutes(e, index, 1)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    color: '#fff',
                                                    borderRadius: '4px',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
