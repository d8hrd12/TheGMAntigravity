
import React, { useState, useEffect } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { optimizeRotation, type RotationStrategy } from '../../utils/rotationUtils';
import { Info, Play, Users, BarChart2, Plus, Minus } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { PageHeader } from '../ui/PageHeader';

interface RotationViewProps {
    players: Player[];
    team: Team;
    onBack: () => void;
    onSave: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[], teamId: string, autoRotation: boolean, strategy: RotationStrategy) => void;
    onSelectPlayer: (playerId: string) => void;
}

export const RotationView: React.FC<RotationViewProps> = ({ players, team, onBack, onSave, onSelectPlayer }) => {
    const { leagueType } = useGame();
    const TOTAL_TARGET  = leagueType === 'EURO' ? 200 : 240; // 5×40 min Euro, 5×48 min NBA
    const MAX_PLAYER_MINS = leagueType === 'EURO' ? 40 : 48;
    const [roster, setRoster] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [autoRotation, setAutoRotation] = useState<boolean>(team.autoRotation || false);
    const [selectedStrategy, setSelectedStrategy] = useState<RotationStrategy>((team.rotationStrategy as RotationStrategy) || 50);
    const isFirstRun = React.useRef(true);
    const lastSavedRoster = React.useRef<string>('');
    const teamBaseline = React.useMemo(() => calculateTeamBaseline(players.filter(p => p.teamId === team.id)), [players, team.id]);

    useEffect(() => {
        // Only initialize if roster is empty or team changed
        if (roster.length > 0 && roster[0].teamId === team.id) {
            return;
        }

        const teamPlayers = players.filter(p => p.teamId === team.id);

        // CHECK IF MINUTES ARE ALREADY ASSIGNED (Persisted State)
        const totalMinutes = teamPlayers.reduce((sum, p) => sum + (p.minutes || 0), 0);
        const hasValidRotation = totalMinutes >= (TOTAL_TARGET - 20) && totalMinutes <= (TOTAL_TARGET + 20);

        if (hasValidRotation) {
            // Sort by existing rotation index if possible, otherwise by isStarter/minutes
            const sorted = [...teamPlayers].sort((a, b) => {
                const aIdx = a.rotationIndex ?? 99;
                const bIdx = b.rotationIndex ?? 99;
                return aIdx - bIdx;
            });

            // CUSTOM SORT FOR STARTERS (Top 5)
            // User requested: C, PF, SF, SG, PG
            const posOrder: Record<string, number> = { 'C': 1, 'PF': 2, 'SF': 3, 'SG': 4, 'PG': 5 };
            const starters = sorted.slice(0, 5).sort((a, b) => {
                return (posOrder[a.position] || 99) - (posOrder[b.position] || 99);
            });
            const bench = sorted.slice(5);

            setRoster([...starters, ...bench]);
            if (team.rotationStrategy === undefined) {
                setSelectedStrategy('Custom'); 
            }
        } else {
            // Apply initial optimization only if no valid state
            const optimized = optimizeRotation(teamPlayers, (team.rotationStrategy as RotationStrategy) || 50, TOTAL_TARGET);
            
            // CUSTOM SORT FOR STARTERS (Top 5)
            const posOrder: Record<string, number> = { 'C': 1, 'PF': 2, 'SF': 3, 'SG': 4, 'PG': 5 };
            const starters = optimized.slice(0, 5).sort((a, b) => {
                return (posOrder[a.position] || 99) - (posOrder[b.position] || 99);
            });
            const bench = optimized.slice(5);

            setRoster([...starters, ...bench]);
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

        onSave(updates, team.id, autoRotation, selectedStrategy);
    };

    const applyStrategy = (strategy: RotationStrategy) => {
        if (strategy === 'Custom') return; // Should not happen via button
        const optimized = optimizeRotation(roster, strategy, TOTAL_TARGET);
        
        // CUSTOM SORT FOR STARTERS (Top 5)
        const posOrder: Record<string, number> = { 'C': 1, 'PF': 2, 'SF': 3, 'SG': 4, 'PG': 5 };
        const starters = optimized.slice(0, 5).sort((a, b) => {
            return (posOrder[a.position] || 99) - (posOrder[b.position] || 99);
        });
        const bench = optimized.slice(5);

        setRoster([...starters, ...bench]);
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
            if (newMinutes < 0 || newMinutes > MAX_PLAYER_MINS) return prev;

            // 2. Cap check (only if adding)
            if (delta > 0) {
                const currentTotal = prev.reduce((sum, p) => sum + (p.minutes || 0), 0);
                if (currentTotal >= TOTAL_TARGET) return prev; // Hard cap
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
        <div style={{ width: '100%', margin: '0 auto', padding: '0', fontFamily: "'Inter', sans-serif" }}>
            <PageHeader
                title="Active Rotation"
                subtitle="Manage minutes & playing time"
                onBack={onBack}
                teamColor={team.colors?.primary}
            />
            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <button
                    onClick={handleSave}
                    style={{
                        background: '#2ecc71',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 32px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)'
                    }}
                >
                    SAVE ROTATION
                </button>
            </div>

            {/* Auto-Manage Toggle */}
            <div className="modern-card" style={{ marginBottom: '15px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}>Auto-Manage Rotation</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>AI will optimize minutes before every game.</span>
                </div>
                <div 
                    onClick={() => setAutoRotation(!autoRotation)}
                    style={{
                        width: '50px',
                        height: '26px',
                        background: autoRotation ? 'var(--team-primary)' : '#ddd',
                        borderRadius: '13px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: autoRotation ? '27px' : '3px',
                        width: '20px',
                        height: '20px',
                        background: '#fff',
                        borderRadius: '50%',
                        transition: 'left 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>
            </div>

            {/* Rotation Strategy Slider */}
            <div className="modern-card" style={{ marginBottom: '15px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}>Rotation Depth</span>
                    <span style={{ color: 'var(--team-primary)', fontWeight: 'bold' }}>
                        {typeof selectedStrategy === 'number' ? selectedStrategy : (selectedStrategy === 'Custom' ? 'Custom' : 50)}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={typeof selectedStrategy === 'number' ? selectedStrategy : (selectedStrategy === 'Custom' ? 50 : 50)}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        applyStrategy(val);
                    }}
                    style={{
                        width: '100%',
                        accentColor: 'var(--team-primary)',
                        cursor: 'pointer'
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>Deep Bench (0)</span>
                    <span>Standard (50)</span>
                    <span>Heavy Starters (100)</span>
                </div>
            </div>



            <div className="modern-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '10px', fontSize: '0.85rem' }}>
                <div>
                    <span style={{ color: 'var(--text-main)' }}>
                        {selectedPlayerId ? 'Tap another to swap' : 'Tap two to swap order.'}
                    </span>
                </div>
                <div>
                    <strong style={{ color: 'var(--text-main)' }}>Mins:</strong> <span style={{ color: totalMinutes === TOTAL_TARGET ? '#2ecc71' : (Math.abs(totalMinutes - TOTAL_TARGET) < 10 ? '#f1c40f' : '#e74c3c') }}>{totalMinutes}/{TOTAL_TARGET}</span>
                </div>
            </div>

            <div className="modern-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: 'var(--bg-card-hover)', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                        <tr>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)' }}>Player</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Pos</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: 'var(--text-dim)' }}>Stars</th>
                            <th style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Min</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((player, index) => {
                            const isStarter = index < 5;
                            const isSelected = selectedPlayerId === player.id;

                            // Selection Glow Logic
                            let rowBackground = isStarter ? 'rgba(var(--primary-rgb), 0.03)' : 'transparent';
                            let rowBoxShadow = 'none';
                            // Remove border between starters, keep for bench
                            let rowBorder = isStarter ? 'none' : '1px solid rgba(0,0,0,0.05)';

                            if (isSelected) {
                                if (isStarter) {
                                    // Starter Selected -> Red Glow
                                    rowBackground = 'rgba(231, 76, 60, 0.15)'; 
                                    rowBoxShadow = '0 0 15px rgba(231, 76, 60, 0.4) inset';
                                    rowBorder = '1px solid #e74c3c';
                                } else {
                                    // Bench Selected -> Green Glow
                                    rowBackground = 'rgba(46, 204, 113, 0.15)'; 
                                    rowBoxShadow = '0 0 15px rgba(46, 204, 113, 0.4) inset';
                                    rowBorder = '1px solid #2ecc71';
                                }
                            }

                            return (
                                <React.Fragment key={player.id}>
                                    {/* Bench Divider Line */}
                                    {index === 5 && (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '0' }}>
                                                <div style={{
                                                    height: '1px',
                                                    background: 'rgba(0,0,0,0.1)',
                                                    margin: '20px 0 10px 0',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <span style={{
                                                        background: 'var(--bg-main)',
                                                        padding: '0 15px',
                                                        fontSize: '0.7rem',
                                                        color: 'var(--text-dim)',
                                                        fontWeight: 800,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.15em',
                                                        position: 'relative',
                                                        zIndex: 2
                                                    }}>Bench Unit</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    <tr
                                        onClick={() => handlePlayerClick(player.id, index)}
                                        style={{
                                            borderBottom: rowBorder,
                                            background: rowBackground,
                                            boxShadow: rowBoxShadow,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            position: 'relative'
                                        }}
                                    >
                                        <td style={{ padding: '12px 16px', textAlign: 'left' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    minHeight: '44px', // Slightly taller to fit badge comfortably
                                                    justifyContent: 'center', 
                                                    alignItems: 'flex-start',
                                                    gap: '2px' // Fixed gap between name and badge
                                                }}>
                                                    <div style={{ 
                                                        fontWeight: 800, 
                                                        color: 'var(--text-main)', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '6px',
                                                        // More aggressive scaling
                                                        fontSize: player.lastName.length > 15 ? '0.7rem' : 
                                                                  player.lastName.length > 12 ? '0.78rem' : 
                                                                  player.lastName.length > 9 ? '0.84rem' : '0.92rem',
                                                        whiteSpace: 'nowrap',
                                                        letterSpacing: '-0.01em',
                                                        lineHeight: 1.1
                                                    }}>
                                                        {player.firstName.charAt(0)}. {player.lastName}
                                                        <Info 
                                                            size={13} 
                                                            style={{ color: 'var(--team-primary)', cursor: 'pointer', opacity: 0.6 }} 
                                                            onClick={(e) => { e.stopPropagation(); onSelectPlayer(player.id); }}
                                                        />
                                                    </div>
                                                    
                                                    {/* Badge Container with Fixed Height to prevent jumping */}
                                                    <div style={{ height: '14px', display: 'flex', alignItems: 'center' }}>
                                                        {isStarter ? (
                                                            <span style={{ 
                                                                fontSize: '0.55rem', 
                                                                color: 'var(--team-primary)', 
                                                                fontWeight: 900, 
                                                                letterSpacing: '0.08em',
                                                                textTransform: 'uppercase',
                                                                background: 'rgba(var(--primary-rgb), 0.12)',
                                                                padding: '1px 5px',
                                                                borderRadius: '3px',
                                                                display: 'inline-block',
                                                                lineHeight: '1',
                                                                boxShadow: '0 0 4px rgba(var(--primary-rgb), 0.1)'
                                                            }}>STARTER</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--text-dim)' }}>{player.position}{player.secondaryPosition ? `/${player.secondaryPosition}` : ''}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <StarRating stars={calculateStars(calculateOverall(player), teamBaseline)} size={12} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}>
                                                <button
                                                    onClick={(e) => changeMinutes(e, index, -1)}
                                                    style={{
                                                        background: 'rgba(0,0,0,0.05)',
                                                        border: 'none',
                                                        color: 'var(--text-main)',
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
                                                <span style={{ color: 'var(--text-main)', width: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{player.minutes}</span>
                                                <button
                                                    onClick={(e) => changeMinutes(e, index, 1)}
                                                    style={{
                                                        background: 'rgba(0,0,0,0.05)',
                                                        border: 'none',
                                                        color: 'var(--text-main)',
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
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    );
};
