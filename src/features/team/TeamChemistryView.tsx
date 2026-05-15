import React, { useState, useEffect, useMemo } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { PageHeader } from '../ui/PageHeader';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { getAutoHierarchy, calculateTeamChemistry } from '../../utils/chemistryUtils';
import { Network, Smile, Meh, Frown, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface TeamChemistryViewProps {
    team: Team;
    players: Player[];
    onBack: () => void;
    onSave: (teamId: string, hierarchy: Record<string, number>) => void;
}

export const TeamChemistryView: React.FC<TeamChemistryViewProps> = ({ team, players, onBack, onSave }) => {
    const teamPlayers = useMemo(() => players.filter(p => p.teamId === team.id), [players, team.id]);
    const teamBaseline = useMemo(() => calculateTeamBaseline(teamPlayers), [teamPlayers]);

    // Local state for the editable hierarchy
    const [hierarchy, setHierarchy] = useState<Record<string, number>>({});
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    // Initialize hierarchy
    useEffect(() => {
        if (team.hierarchy && Object.keys(team.hierarchy).length > 0) {
            // Ensure all current players are in hierarchy
            const auto = getAutoHierarchy(teamPlayers);
            setHierarchy({ ...auto, ...team.hierarchy });
        } else {
            setHierarchy(getAutoHierarchy(teamPlayers));
        }
    }, [team.id]); // Run once on mount

    const handlePlayerClick = (playerId: string) => {
        if (!selectedPlayerId) {
            setSelectedPlayerId(playerId);
        } else if (selectedPlayerId === playerId) {
            setSelectedPlayerId(null);
        } else {
            // Swap logic
            setHierarchy(prev => {
                const newHierarchy = { ...prev };
                const temp = newHierarchy[selectedPlayerId];
                newHierarchy[selectedPlayerId] = newHierarchy[playerId];
                newHierarchy[playerId] = temp;
                return newHierarchy;
            });
            setSelectedPlayerId(null);
        }
    };

    const handleSave = () => {
        onSave(team.id, hierarchy);
        onBack();
    };

    // Calculate dynamic team chemistry score
    const currentChemistry = useMemo(() => {
        // Create a fake team with our modified hierarchy for calculation
        const tempTeam = { ...team, hierarchy };
        return calculateTeamChemistry(teamPlayers, tempTeam);
    }, [teamPlayers, team, hierarchy]);

    const getMoraleColor = (morale: number) => {
        if (morale >= 80) return '#2ecc71';
        if (morale >= 50) return '#f39c12';
        if (morale >= 30) return '#e67e22';
        return '#e74c3c';
    };

    const getMoraleIcon = (morale: number) => {
        if (morale >= 80) return <Smile size={14} color="#2ecc71" />;
        if (morale >= 50) return <Meh size={14} color="#f39c12" />;
        if (morale >= 30) return <Frown size={14} color="#e67e22" />;
        return <AlertTriangle size={14} color="#e74c3c" />;
    };

    // Group players by their assigned tiers
    const tier1 = teamPlayers.filter(p => hierarchy[p.id] === 1);
    const tier2 = teamPlayers.filter(p => hierarchy[p.id] === 2);
    const tier3 = teamPlayers.filter(p => hierarchy[p.id] === 3);
    const tier4 = teamPlayers.filter(p => hierarchy[p.id] === 4);

    // If limits are exceeded (e.g., user swapped incorrectly?), we'll just display them in the tier they are assigned to.
    // The auto logic enforces limits, but swaps maintain total counts.

    const PlayerCard = ({ player }: { player: Player }) => {
        const isSelected = selectedPlayerId === player.id;
        const morale = player.morale ?? 50;
        const ovr = calculateOverall(player);
        const stars = calculateStars(ovr, teamBaseline);
        const mColor = getMoraleColor(morale);

        return (
            <div 
                onClick={() => handlePlayerClick(player.id)}
                style={{
                    background: isSelected ? 'rgba(var(--primary-rgb), 0.15)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--team-primary)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px',
                    width: '180px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 15px rgba(var(--primary-rgb), 0.4)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    position: 'relative'
                }}
            >
                {isSelected && (
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--team-primary)', borderRadius: '50%', padding: '4px', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                        <ArrowLeftRight size={14} />
                    </div>
                )}
                
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {player.firstName[0]}. {player.lastName}
                </div>
                
                <StarRating stars={stars} size={12} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', background: 'var(--bg-body)', padding: '4px 8px', borderRadius: '20px', border: `1px solid ${mColor}40` }}>
                    {getMoraleIcon(morale)}
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: mColor }}>{morale}</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', sans-serif", paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <PageHeader
                title="Team Chemistry"
                subtitle="Social Dynamic & Hierarchy"
                onBack={onBack}
                teamColor={team.colors?.primary}
            />

            <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Header Controls */}
                    <div className="modern-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '50%' }}>
                                <Network size={24} color="var(--team-primary)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Chemistry Score: <span style={{ color: getMoraleColor(currentChemistry) }}>{currentChemistry}</span></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap a player to select, then tap another to swap their roles.</div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            style={{
                                background: '#2ecc71',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 24px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)'
                            }}
                        >
                            SAVE HIERARCHY
                        </button>
                    </div>

                    {/* Triangle Visualization */}
                    <div style={{ background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        {/* Tier 1: Leader */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Team Leader (40% Impact)</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                {tier1.map(p => <PlayerCard key={p.id} player={p} />)}
                                {tier1.length === 0 && <div style={{ width: '180px', height: '90px', border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Empty Slot</div>}
                            </div>
                        </div>

                        {/* Tier 2: Core */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Stars (30% Impact)</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                {tier2.map(p => <PlayerCard key={p.id} player={p} />)}
                            </div>
                        </div>

                        {/* Tier 3: Rotation */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key Rotation (20% Impact)</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                {tier3.map(p => <PlayerCard key={p.id} player={p} />)}
                            </div>
                        </div>

                        {/* Tier 4: Bench */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bench Unit (10% Impact)</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                {tier4.map(p => <PlayerCard key={p.id} player={p} />)}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};
