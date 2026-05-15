import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import type { TeamStrategy, PaceType, OffensiveFocus, DefensiveStrategy } from '../simulation/TacticsTypes';
import { PageHeader } from '../ui/PageHeader';
import { Activity, Target, Shield } from 'lucide-react';

interface CoachSettingsViewProps {
    team: Team;
    onBack: () => void;
    onSave: (settings: TeamStrategy) => void;
    onFire?: () => void;
}

export const CoachSettingsView: React.FC<CoachSettingsViewProps> = ({ team, onBack, onSave, onFire }) => {
    // Default to 'Normal' / 'Balanced' / 'Man-to-Man' if undefined
    const [strategy, setStrategy] = useState<TeamStrategy>(team.tactics || {
        pace: 'Normal',
        offensiveFocus: 'Balanced',
        defense: 'Man-to-Man'
    });

    const handleSave = () => {
        onSave(strategy);
    };

    // Helper component for selection sections
    const SelectOption = ({ label, value, options, onChange, icon: Icon }: {
        label: string,
        value: string,
        options: string[],
        onChange: (val: any) => void,
        icon: any
    }) => (
        <div className="modern-card" style={{ padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ padding: '8px', background: 'rgba(52, 152, 219, 0.2)', borderRadius: '8px' }}>
                    <Icon size={20} color="#3498db" />
                </div>
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Adjust your team's tactical approach</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                {options.map((opt: string) => {
                    const isActive = value === opt;
                    return (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            style={{
                                padding: '12px',
                                background: isActive ? 'var(--text-main)' : 'var(--bg-card-hover)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'all 0.2s'
                            }}
                        >
                            {opt}
                        </button>
                    )
                })}
            </div>
        </div>
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <PageHeader 
                title="Coach Settings"
                subtitle="Tactical schemes & strategy"
                onBack={onBack}
                teamColor={team.colors?.primary}
            >
                <div style={{ display: 'flex', gap: '12px' }}>
                    {onFire && (
                        <button
                            onClick={onFire}
                            style={{ 
                                padding: '8px 16px', 
                                borderRadius: '10px', 
                                background: 'rgba(231, 76, 60, 0.1)', 
                                color: '#e74c3c', 
                                border: '1px solid rgba(231, 76, 60, 0.3)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Fire Coach
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ padding: '8px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}
                    >
                        Save Strategy
                    </button>
                </div>
            </PageHeader>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <SelectOption
                        label="Pace of Play"
                        value={strategy.pace}
                        options={['Very Slow', 'Slow', 'Normal', 'Fast', 'Seven Seconds']}
                        icon={Activity}
                        onChange={(val: PaceType) => setStrategy({ ...strategy, pace: val })}
                    />

                    <SelectOption
                        label="Offensive Focus"
                        value={strategy.offensiveFocus}
                        options={['Balanced', 'Inside', 'Perimeter', 'PickAndRoll']}
                        icon={Target}
                        onChange={(val: OffensiveFocus) => setStrategy({ ...strategy, offensiveFocus: val })}
                    />

                    <SelectOption
                        label="Defensive Scheme"
                        value={strategy.defense}
                        options={['Man-to-Man', 'Zone 2-3', 'Zone 3-2', 'Full Court Press']}
                        icon={Shield}
                        onChange={(val: DefensiveStrategy) => setStrategy({ ...strategy, defense: val })}
                    />
                </div>
            </div>
        </div>
    );
};
