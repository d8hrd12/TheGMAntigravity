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
        <DashboardCard variant="white" title="Team Chemistry" icon={<Smile size={16} />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    position: 'relative',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Ring */}
                    <svg width="70" height="70" viewBox="0 0 70 70">
                        <circle
                            cx="35" cy="35" r="30"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                        />
                        <circle
                            cx="35" cy="35" r="30"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="6"
                            strokeDasharray={`${(score / 100) * 188.4} 188.4`}
                            strokeLinecap="round"
                            transform="rotate(-90 35 35)"
                        />
                    </svg>
                    <div style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: 900, color: '#1A1A1A' }}>
                        {score}
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1A1A1A' }}>{status}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9CA3AF' }}>Locker Room Atmosphere</div>
                </div>
            </div>
        </DashboardCard>
    );
};
