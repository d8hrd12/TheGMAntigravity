import React, { useState } from 'react';
import type { Player } from '../../models/Player';
import type { Team, RotationSegment } from '../../models/Team';
import type { TeamStrategy } from '../simulation/TacticsTypes';
import { RotationView } from './RotationView';
import { CoachSettingsView } from './CoachSettingsView';
import { Users, Settings } from 'lucide-react';

interface TeamManagementViewProps {
    players: Player[];
    team: Team;
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
    onSaveRotation: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => void;
    onSaveStrategy: (settings: TeamStrategy) => void;
    onSaveSchedule: (schedule: RotationSegment[]) => void;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
    players,
    team,
    onBack,
    onSelectPlayer,
    onSaveRotation,
    onSaveStrategy,
    onSaveSchedule
}) => {
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

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 20px 0 20px' }}>
                <div style={{
                    display: 'flex',
                    background: 'var(--surface)',
                    padding: '4px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    marginBottom: '10px'
                }}>
                    <button
                        onClick={() => setActiveTab('rotation')}
                        style={tabStyle(activeTab === 'rotation')}
                    >
                        <Users size={18} />
                        Rotation
                    </button>
                    <button
                        onClick={() => setActiveTab('strategy')}
                        style={tabStyle(activeTab === 'strategy')}
                    >
                        <Settings size={18} />
                        Strategy
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
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
                    <CoachSettingsView
                        team={team}
                        onBack={onBack}
                        onSave={onSaveStrategy}
                    />
                )}
            </div>
        </div>
    );
};
