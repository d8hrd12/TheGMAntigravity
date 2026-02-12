import React from 'react';
import { useGame } from '../../store/GameContext';
import { Briefcase, Users, DollarSign, Trophy, MapPin } from 'lucide-react';

export const FranchiseHub: React.FC = () => {
    const { teams, userTeamId } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    const interestVal = userTeam.fanInterest || 1.0;
    const patienceVal = userTeam.ownerPatience || 50;
    const cashVal = userTeam.cash || 0;
    const marketVal = userTeam.marketSize || 'Medium';

    const getFanInterestLabel = (val: number) => {
        if (val >= 1.5) return { text: "Sold Out", color: "var(--primary)" };
        if (val >= 1.2) return { text: "High", color: "#60a5fa" };
        if (val >= 0.8) return { text: "Stable", color: "#9ca3af" };
        return { text: "Weak", color: "#ef4444" };
    };

    const fanInterest = getFanInterestLabel(interestVal);
    const formatCash = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1, notation: 'compact' }).format(amount);
    };

    const StatusItem = ({ icon: Icon, label, value, color }: any) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: '8px 16px',
            minWidth: '120px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                <Icon size={12} />
                <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: color || 'white' }}>{value}</span>
        </div>
    );

    return (
        <div style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            width: '100%',
            boxSizing: 'border-box',
            scrollbarWidth: 'none'
        }} className="no-scrollbar">
            <div style={{
                padding: '16px 20px',
                background: 'var(--primary)',
                color: 'black',
                fontWeight: 900,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderTopLeftRadius: '23px',
                borderBottomLeftRadius: '23px'
            }}>
                <Trophy size={18} />
                FRONT OFFICE
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                <StatusItem icon={MapPin} label="Market" value={marketVal} />
                <StatusItem icon={Users} label="Fan Interest" value={fanInterest.text} color={fanInterest.color} />
                <StatusItem icon={Briefcase} label="Owner Trust" value={`${patienceVal}%`} color={patienceVal > 60 ? '#10b981' : patienceVal > 30 ? '#f59e0b' : '#ef4444'} />
                <StatusItem icon={DollarSign} label="Budget" value={formatCash(cashVal)} color={cashVal < 0 ? '#ef4444' : '#10b981'} />
            </div>
        </div>
    );
};
