import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import type { TeamStrategy, PaceType, OffensiveFocus, DefensiveStrategy } from '../simulation/TacticsTypes';
import { BackButton } from '../ui/BackButton';
import { PageHeader } from '../ui/PageHeader';
import { Activity, Target, Shield } from 'lucide-react';

interface CoachSettingsViewProps {
    team: Team;
    onBack: () => void;
    onSave: (settings: TeamStrategy) => void;
}

export const CoachSettingsView: React.FC<CoachSettingsViewProps> = ({ team, onBack, onSave }) => {
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
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ padding: '8px', background: 'rgba(52, 152, 219, 0.2)', borderRadius: '8px' }}>
                    <Icon size={20} color="#3498db" />
                </div>
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Adjust your team's tactical approach</div>
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
                                background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: isActive ? 'white' : '#aaa',
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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            <div style={{ padding: '20px' }}>


                {/* Save Changes Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ padding: '10px 24px', borderRadius: '12px' }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div style={{ padding: '0 20px 40px 20px', overflowY: 'auto' }}>

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
    );
};
