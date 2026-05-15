import React from 'react';
import { Smile, Frown, Meh, AlertTriangle, ChevronRight } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateTeamChemistry } from '../../utils/chemistryUtils';

interface TeamMoraleProps {
    players: Player[];
    team: Team;
    onSelectPlayer: (id: string) => void;
    onNavigate: () => void;
}

export const TeamMoraleDashboard: React.FC<TeamMoraleProps> = ({ players, team, onSelectPlayer, onNavigate }) => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    
    // Calculate average morale using the weighted hierarchy
    const avgMorale = calculateTeamChemistry(teamPlayers, team);

    // Determine status and colors
    let status = "Stable";
    let color = "var(--accent)";
    let Icon = Smile;
    
    if (avgMorale >= 80) {
        status = "Excellent";
        color = "#2ecc71"; // green
        Icon = Smile;
    } else if (avgMorale >= 50) {
        status = "Stable";
        color = "#f39c12"; // orange
        Icon = Meh;
    } else if (avgMorale >= 30) {
        status = "Tense";
        color = "#e67e22"; // dark orange
        Icon = Frown;
    } else {
        status = "Toxic";
        color = "#e74c3c"; // red
        Icon = AlertTriangle;
    }

    // Find the unhappiest players
    const unhappyPlayers = [...teamPlayers]
        .filter(p => (p.morale ?? 50) < 50)
        .sort((a, b) => (a.morale ?? 50) - (b.morale ?? 50))
        .slice(0, 3);

    return (
        <div onClick={onNavigate} style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}>
            <DashboardCard variant="default" title="TEAM CHEMISTRY" icon={<Icon size={16} color={color} />} action={<ChevronRight size={16} color="#8e8e93" />}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '4px' }}>
                    <div className="gauge-container" style={{ width: '80px', height: '80px', position: 'relative' }}>
                        <svg className="gauge-svg" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#f2f2f7" strokeWidth="12" />
                            <circle 
                                cx="50" cy="50" r="42" 
                                fill="none" 
                                stroke={color} 
                                strokeWidth="12"
                                strokeLinecap="round"
                                style={{ 
                                    strokeDasharray: '264', 
                                    strokeDashoffset: (264 - (264 * avgMorale) / 100),
                                    transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} 
                            />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1c1c1e', letterSpacing: '-0.02em' }}>{avgMorale}</span>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color, letterSpacing: '-0.01em' }}>{status}</div>
                        <div style={{ fontSize: '0.65rem', color: '#8e8e93', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginTop: '2px' }}>Atmosphere</div>
                    </div>
                </div>

                {unhappyPlayers.length > 0 && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.55rem', color: '#8e8e93', fontWeight: 800, letterSpacing: '0.1em' }}>CONCERNS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {unhappyPlayers.map(p => (
                                <div 
                                    key={p.id}
                                    onClick={(e) => { e.stopPropagation(); onSelectPlayer(p.id); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#fef2f2',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid #fee2e2',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                >
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>
                                        {p.lastName.toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444' }}>
                                        {p.morale}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DashboardCard>
        </div>
    );
};
