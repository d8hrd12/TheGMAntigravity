import React from 'react';
import { Smile } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface TeamMoraleProps {
    players: any[];
    teamId: string;
    onSelectPlayer: (id: string) => void;
}

export const TeamMoraleDashboard: React.FC<TeamMoraleProps> = () => {
    // Replica based on screenshot
    const score = 80;
    const status = "Stable";

    return (
        <DashboardCard variant="primary" title="Team Chemistry" icon={<Smile size={16} />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="gauge-container" style={{ width: '70px', height: '70px' }}>
                    <svg className="gauge-svg" viewBox="0 0 100 100">
                        <circle className="gauge-bg" cx="50" cy="50" r="45" />
                        <circle 
                            className="gauge-fill" 
                            cx="50" cy="50" r="45" 
                            style={{ 
                                strokeDasharray: '283', 
                                strokeDashoffset: (283 - (283 * score) / 100),
                                stroke: 'var(--accent)'
                            }} 
                        />
                    </svg>
                    <div className="gauge-text">
                        <span className="gauge-value" style={{ fontSize: '1.2rem' }}>{score}</span>
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{status}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Locker Room Atmosphere</div>
                </div>
            </div>
        </DashboardCard>
    );
};
