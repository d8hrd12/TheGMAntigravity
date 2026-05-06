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
        <div onClick={onNavigate} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <DashboardCard variant="primary" title="TEAM CHEMISTRY" icon={<Icon size={16} />} action={<ChevronRight size={16} color="var(--text-muted)" />}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: unhappyPlayers.length > 0 ? '16px' : '0' }}>
                    <div className="gauge-container" style={{ width: '70px', height: '70px', position: 'relative' }}>
                        <svg className="gauge-svg" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="10" />
                            <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                stroke={color} 
                                strokeWidth="10"
                                strokeLinecap="round"
                                style={{ 
                                    strokeDasharray: '283', 
                                    strokeDashoffset: (283 - (283 * avgMorale) / 100),
                                    transition: 'stroke-dashoffset 1s ease-in-out'
                                }} 
                            />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>{avgMorale}</span>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color }}>{status}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Locker Room Atmosphere</div>
                    </div>
                </div>

                {unhappyPlayers.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '8px' }}>UNHAPPY PLAYERS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {unhappyPlayers.map(p => (
                                <div 
                                    key={p.id}
                                    onClick={(e) => { e.stopPropagation(); onSelectPlayer(p.id); }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'var(--bg-body)',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        {p.firstName[0]}. {p.lastName}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#e74c3c' }}>
                                        {p.morale ?? 50}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DashboardCard>
        </div>
    );
};
