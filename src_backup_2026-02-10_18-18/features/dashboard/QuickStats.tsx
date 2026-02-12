import React from 'react';
import { useGame } from '../../store/GameContext';
import { DollarSign, Trophy, TrendingUp } from 'lucide-react';

export const QuickStats: React.FC = () => {
    const { userTeamId, teams } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    // Calculate League Rank
    const sortedTeams = [...teams].sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        return a.losses - b.losses; // Less losses is better
    });
    const rank = sortedTeams.findIndex(t => t.id === userTeamId) + 1;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(amount);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <StatBox
                icon={<DollarSign size={14} color="#2ecc71" />}
                label="Cap Space"
                value={formatMoney(userTeam.salaryCapSpace)}
                color="#2ecc71"
            />
            <StatBox
                icon={<Trophy size={14} color="#f1c40f" />}
                label="Rank"
                value={`#${rank}`}
                color="#f1c40f"
            />
            <StatBox
                icon={<TrendingUp size={14} color="#3498db" />}
                label="Record"
                value={`${userTeam.wins}-${userTeam.losses}`}
                color="#3498db"
            />
        </div>
    );
}

const StatBox = ({ icon, label, value, color }: any) => (
    <div className="glass-panel" style={{
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        borderRadius: '12px',
        background: 'var(--surface-glass)',
        border: '1px solid var(--border)',
        alignItems: 'center',
        textAlign: 'center'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {icon}
            {label}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: color }}>
            {value}
        </div>
    </div>
)
