import React from 'react';
import { Smile, Frown } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import type { Player } from '../../models/Player';

interface TeamMoraleDashboardProps {
    players: Player[];
    teamId: string;
    onSelectPlayer: (id: string) => void;
}

export const TeamMoraleDashboard: React.FC<TeamMoraleDashboardProps> = ({ players, teamId, onSelectPlayer }) => {
    const roster = players.filter(p => p.teamId === teamId);
    if (roster.length === 0) return null;

    const avgMorale = roster.reduce((sum, p) => sum + (p.morale || 50), 0) / roster.length;

    // Major Influencers
    const happyInfluencers = roster
        .filter(p => (p.morale || 50) > 85)
        .sort((a, b) => b.morale - a.morale)
        .slice(0, 2);

    const sadInfluencers = roster
        .filter(p => (p.morale || 50) < 30)
        .sort((a, b) => a.morale - b.morale)
        .slice(0, 2);

    return (
        <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Team Morale Indicator */}
            <div className="glass-panel" style={{ width: '100%', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{
                    position: 'relative', width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${avgMorale > 70 ? '#2ecc71' : avgMorale < 40 ? '#e74c3c' : '#f1c40f'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold'
                }}>
                    {Math.round(avgMorale)}
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Team Morale</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        {avgMorale > 80 ? 'Excellent Chemistry' : avgMorale > 60 ? 'Stable Environment' : avgMorale > 40 ? 'Some Tension' : 'Toxic Locker Room'}
                    </div>
                </div>
            </div>

            {/* Influencers */}
            <div className="glass-panel" style={{ width: '100%', padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Positive Influence</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {happyInfluencers.length > 0 ? happyInfluencers.map(p => (
                            <div key={p.id} onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                                <Smile size={14} color="#2ecc71" />
                                <span style={{ fontSize: '0.85rem' }}>{p.lastName}</span>
                            </div>
                        )) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                </div>

                <div style={{ width: '100%' }}>
                    <div style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Negative Influence</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {sadInfluencers.length > 0 ? sadInfluencers.map(p => (
                            <div key={p.id} onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(231, 76, 60, 0.1)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                                <Frown size={14} color="#e74c3c" />
                                <span style={{ fontSize: '0.85rem' }}>{p.lastName}</span>
                            </div>
                        )) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
