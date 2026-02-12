
import React from 'react';
import type { CompletedTrade } from '../../store/GameContext';
import type { Team } from '../../models/Team';
import { formatDate } from '../../utils/dateUtils';

interface TradesSummaryViewProps {
    trades: CompletedTrade[];
    teams: Team[];
    onBack: () => void;
}

export const TradesSummaryView: React.FC<TradesSummaryViewProps> = ({ trades, teams, onBack }) => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

            {trades.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <p>No trades have occurred this season.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '15px' }}>
                    {trades.map(trade => {
                        const team1 = teams.find(t => t.id === trade.team1Id);
                        const team2 = teams.find(t => t.id === trade.team2Id);

                        return (
                            <div key={trade.id} className="glass-panel" style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                    {formatDate(trade.date)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                                    {/* Team 1 Side */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', color: team1?.colors?.primary, marginBottom: '5px' }}>
                                            {team1?.city} {team1?.name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <div style={{ fontStyle: 'italic', marginBottom: '2px', color: '#888' }}>Receives:</div>
                                            {trade.team2Assets.map((asset, i) => (
                                                <div key={i}>+ {asset}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div style={{ color: '#aaa', fontSize: '1.5rem' }}>⇄</div>

                                    {/* Team 2 Side */}
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: team2?.colors?.primary, marginBottom: '5px' }}>
                                            {team2?.city} {team2?.name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <div style={{ fontStyle: 'italic', marginBottom: '2px', color: '#888' }}>Receives:</div>
                                            {trade.team1Assets.map((asset, i) => (
                                                <div key={i}>+ {asset}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
