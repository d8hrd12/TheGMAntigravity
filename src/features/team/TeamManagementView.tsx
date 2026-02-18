import React, { useState } from 'react';
import type { Player } from '../../models/Player';
import type { Team, RotationSegment } from '../../models/Team';
import type { TeamStrategy } from '../simulation/TacticsTypes';
import { RotationView } from './RotationView';
import { CoachSettingsView } from './CoachSettingsView';
import { Users, Settings, User } from 'lucide-react';
import type { Coach } from '../../models/Coach';
import { CoachPreview } from './CoachPreview';

interface TeamManagementViewProps {
    players: Player[];
    team: Team;
    coaches: Coach[];
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
    onSaveRotation: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => void;
    onSaveStrategy: (settings: TeamStrategy) => void;
    onSaveSchedule: (schedule: RotationSegment[]) => void;
}

import { PageHeader } from '../ui/PageHeader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

// ...

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
    players,
    team,
    coaches,
    onBack,
    onSelectPlayer,
    onSaveRotation,
    onSaveStrategy,
    onSaveSchedule
}) => {
    const activeCoach = coaches.find(c => c.teamId === team.id);
    const [activeTab, setActiveTab] = useState<'rotation' | 'strategy'>('rotation');

    // Shared Tab Styles
    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        flex: 1,
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
        color: isActive ? 'white' : 'var(--text-secondary)',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
        borderRadius: '12px',
        transition: 'all 0.2s ease'
    });

    const handleRotationSave = (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => {
        // 1. Call original save to update DB/Context
        onSaveRotation(updates);
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'rotation': return 'Rotation';
            case 'strategy': return 'Game Plan';
            default: return 'Team Management';
        }
    };

    return (
        <div style={{ minHeight: '100%', paddingBottom: '140px', background: '#2A2A2A' }}>
            <div style={{ padding: '20px 20px 0 20px' }}>
                <PageHeader
                    title={getTitle()}
                    onBack={onBack}
                />

                <div style={{ marginBottom: '20px' }}>
                    <SegmentedControl
                        value={activeTab} // 'rotation' | 'strategy'
                        onChange={(val) => setActiveTab(val as 'rotation' | 'strategy')}
                        options={[
                            { value: 'rotation', label: <><Users size={16} /> Rotation</> },
                            { value: 'strategy', label: <><Settings size={16} /> Strategy</> }
                        ]}
                    />
                </div>
            </div>

            <div style={{ width: '100%' }}>
                {activeTab === 'rotation' && (
                    <RotationView
                        players={players}
                        team={team}
                        onBack={onBack}
                        onSelectPlayer={onSelectPlayer}
                        onSave={handleRotationSave}
                    />
                )}

                {activeTab === 'strategy' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px' }}>
                        {activeCoach && (
                            <div style={{ marginTop: '10px' }}>
                                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Personnel</h4>
                                <CoachPreview coach={activeCoach} />
                            </div>
                        )}
                        <CoachSettingsView
                            team={team}
                            onBack={onBack}
                            onSave={onSaveStrategy}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
