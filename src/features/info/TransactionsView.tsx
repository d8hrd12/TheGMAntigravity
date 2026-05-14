import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { Calendar, UserPlus, GraduationCap, DollarSign, ArrowRightLeft } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { TradesSummaryView } from '../trade/TradesSummaryView';
import { PageHeader } from '../ui/PageHeader';

export const TransactionsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { tradeHistory, transactions, teams, date, setSelectedPlayerId, setSelectedTeamId, leagueType, userTeamId } = useGame();
    const [selectedYear, setSelectedYear] = useState<number>(date.getFullYear());
    const [activeTab, setActiveTab] = useState<'all' | 'trades' | 'signings'>('all');

    // Get all unique years
    const years = Array.from(new Set([
        date.getFullYear(), 
        ...tradeHistory.map(t => new Date(t.date).getFullYear()),
        ...(transactions || []).map(t => new Date(t.date).getFullYear())
    ])).sort((a, b) => b - a);

    const filteredTrades = tradeHistory.filter(t => new Date(t.date).getFullYear() === selectedYear);
    const filteredTransactions = (transactions || []).filter(t => new Date(t.date).getFullYear() === selectedYear);

    // Merge and sort by date desc
    const combinedEvents = [
        ...filteredTrades.map(t => ({ ...t, eventType: 'TRADE' })),
        ...filteredTransactions.map(t => ({ ...t, eventType: t.type }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatCurrency = (amount?: number) => {
        if (!amount) return 'FREE';
        if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
        return `€${(amount / 1000).toFixed(0)}K`;
    };

    return (
        <div className="animate-fade" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
            <PageHeader 
                title="Transactions"
                subtitle="Roster movements & trade logs"
                onBack={onBack}
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {(['all', 'trades', 'signings'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--border-color)',
                                    background: activeTab === tab ? 'var(--text-main)' : 'var(--bg-body)',
                                    color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-body)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700, outline: 'none' }}
                        >
                            {years.map(y => <option key={y} value={y}>{y} SEASON</option>)}
                        </select>
                    </div>
                </div>
            </PageHeader>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {combinedEvents
                        .filter(event => {
                            if (activeTab === 'trades') return event.eventType === 'TRADE';
                            if (activeTab === 'signings') return ['SIGNING', 'NBA SIGNING', 'ACADEMY', 'TRANSFER'].includes(event.eventType);
                            return true;
                        })
                        .map((event: any, idx) => {
                        if (event.eventType === 'TRADE' && !event.playerName) {
                            return (
                                <div key={event.id || idx}>
                                    <TradesSummaryView 
                                        trades={[event]} 
                                        teams={teams} 
                                        onBack={() => {}} 
                                        onSelectPlayer={setSelectedPlayerId} 
                                        onSelectTeam={setSelectedTeamId} 
                                    />
                                </div>
                            );
                        }

                        const team = teams.find(t => t.id === event.teamId);
                        const fromTeam = teams.find(t => t.id === event.fromTeamId);
                        
                        let icon = <UserPlus size={18} />;
                        let badgeColor = '#3498db';
                        if (event.eventType === 'ACADEMY') {
                            icon = <GraduationCap size={18} />;
                            badgeColor = '#2ecc71';
                        } else if (event.eventType === 'TRANSFER') {
                            icon = <DollarSign size={18} />;
                            badgeColor = '#e67e22';
                        } else if (event.eventType === 'NBA SIGNING') {
                            icon = <ArrowRightLeft size={18} />;
                            badgeColor = '#9b59b6';
                        }

                        return (
                            <div key={idx} className="modern-card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: `${badgeColor}20`, 
                                    color: badgeColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {icon}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{event.eventType}</span>
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span 
                                            style={{ fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => event.playerId && setSelectedPlayerId(event.playerId)}
                                        >
                                            {event.playerName}
                                        </span>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                            {event.eventType === 'TRANSFER' ? 'transferred to' : 'signed with'}
                                        </span>
                                        <span 
                                            style={{ fontWeight: 700, color: team?.colors?.primary || 'var(--text-main)', cursor: 'pointer' }}
                                            onClick={() => team && setSelectedTeamId(team.id)}
                                        >
                                            {team?.name}
                                        </span>
                                        {fromTeam && (
                                            <>
                                                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>from</span>
                                                <span 
                                                    style={{ fontWeight: 700, color: fromTeam.colors.primary, cursor: 'pointer' }}
                                                    onClick={() => setSelectedTeamId(fromTeam.id)}
                                                >
                                                    {fromTeam.name}
                                                </span>
                                            </>
                                        )}
                                        {event.eventType === 'NBA SIGNING' && (
                                            <span style={{ fontSize: '0.8rem', background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>NBA</span>
                                        )}
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                                        {event.amount && <span>Contract: <b style={{ color: 'var(--text-main)' }}>{formatCurrency(event.amount)} / {event.years}y</b></span>}
                                        {event.fee > 0 && <span>Fee: <b style={{ color: '#e67e22' }}>{formatCurrency(event.fee)}</b></span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {combinedEvents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <p>No transactions recorded for the {selectedYear} season.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
