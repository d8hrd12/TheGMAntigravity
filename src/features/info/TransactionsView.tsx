import React, { useState } from 'react';
import { ChevronLeft, Calendar } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { TradesSummaryView } from '../trade/TradesSummaryView';

export const TransactionsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { tradeHistory, teams, date, setSelectedPlayerId, setSelectedTeamId } = useGame();
    const [selectedYear, setSelectedYear] = useState<number>(date.getFullYear());

    // Get all unique years from trade history
    const years = Array.from(new Set([date.getFullYear(), ...tradeHistory.map(t => new Date(t.date).getFullYear())])).sort((a, b) => b - a);

    const filteredTrades = tradeHistory.filter(t => new Date(t.date).getFullYear() === selectedYear);

    return (
        <div className="animate-fade" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} className="btn-modern" style={{ padding: '8px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>League Transactions</h1>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                    >
                        {years.map(y => <option key={y} value={y}>{y} SEASON</option>)}
                    </select>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <TradesSummaryView 
                    trades={filteredTrades} 
                    teams={teams} 
                    onBack={onBack} 
                    onSelectPlayer={setSelectedPlayerId} 
                    onSelectTeam={setSelectedTeamId} 
                />
            </div>
        </div>
    );
};
