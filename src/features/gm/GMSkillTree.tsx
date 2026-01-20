import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { AVAILABLE_PERKS, type GMPerk } from '../../models/GMProfile';
import { Lock, Unlock, Check, ArrowRight } from 'lucide-react';

export const GMSkillTree: React.FC = () => {
    const { gmProfile, setGameState } = useGame();
    const [selectedPerkId, setSelectedPerkId] = useState<string | null>(null);

    const unlockPerk = (perkId: string) => {
        const perk = AVAILABLE_PERKS.find(p => p.id === perkId);
        if (!perk) return;

        if (gmProfile.trustPoints < perk.cost) {
            alert("Not enough Trust Points!");
            return;
        }

        // Simple check for now (no prerequisites enforced in UI yet, but standard tree logic usually requires parent)
        // For V1, we just check cost.

        if (confirm(`Unlock ${perk.name} for ${perk.cost} TP?`)) {
            setGameState(prev => ({
                ...prev,
                gmProfile: {
                    ...prev.gmProfile,
                    trustPoints: prev.gmProfile.trustPoints - perk.cost,
                    unlockedPerks: [...prev.gmProfile.unlockedPerks, perkId]
                }
            }));
        }
    };

    const isUnlocked = (id: string) => gmProfile.unlockedPerks.includes(id);

    return (
        <div style={{ padding: '20px', color: 'var(--text)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>GM Skill Tree</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                {AVAILABLE_PERKS.map(perk => {
                    const unlocked = isUnlocked(perk.id);
                    const canAfford = gmProfile.trustPoints >= perk.cost;

                    return (
                        <div key={perk.id}
                            onClick={() => !unlocked && unlockPerk(perk.id)}
                            style={{
                                width: '220px',
                                background: unlocked ? 'var(--primary-dark)' : 'var(--surface)',
                                border: unlocked ? '2px solid var(--primary)' : '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                opacity: !unlocked && !canAfford ? 0.5 : 1,
                                cursor: unlocked ? 'default' : 'pointer',
                                transition: 'transform 0.2s',
                                position: 'relative'
                            }}>

                            <div style={{
                                width: '50px', height: '50px',
                                borderRadius: '50%',
                                background: unlocked ? 'white' : 'var(--surface-glass)',
                                color: unlocked ? 'var(--primary)' : 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                {unlocked ? <Check /> : <Lock size={20} />}
                            </div>

                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}>
                                {perk.name}
                            </div>

                            <div style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)', minHeight: '40px' }}>
                                {perk.description}
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                padding: '4px 12px',
                                background: unlocked ? 'rgba(255,255,255,0.2)' : '#f1c40f',
                                color: unlocked ? 'white' : 'black',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                {unlocked ? 'OWNED' : `${perk.cost} TP`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
