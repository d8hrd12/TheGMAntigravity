
import React from 'react';
import type { CompletedTrade, TradeAssetItem } from '../../store/GameContext';
import type { Team } from '../../models/Team';
import { formatDate } from '../../utils/dateUtils';

interface TradesSummaryViewProps {
    trades: CompletedTrade[];
    teams: Team[];
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
}

export const TradesSummaryView: React.FC<TradesSummaryViewProps> = ({ trades, teams, onBack, onSelectPlayer, onSelectTeam }) => {
    return (
        <div style={{ 
            padding: '40px 24px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
        }}>

            {trades.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 40px', 
                    color: '#8e8e93',
                    background: '#f9f9f9',
                    borderRadius: '32px',
                    border: '1px dashed #eeeeee'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No trades have occurred this season.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '24px' }}>
                    {trades.map(trade => {
                        const team1 = teams.find(t => t.id === trade.team1Id);
                        const team2 = teams.find(t => t.id === trade.team2Id);

                        return (
                            <div key={trade.id} style={{ 
                                padding: '32px', 
                                borderRadius: '24px', 
                                border: '1px solid #eeeeee',
                                background: '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ 
                                    marginBottom: '24px', 
                                    fontSize: '0.75rem', 
                                    color: '#8e8e93', 
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#111111' }}></div>
                                    {formatDate(trade.date)}
                                </div>

                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                                    alignItems: window.innerWidth < 768 ? 'center' : 'start', 
                                    gap: window.innerWidth < 768 ? '20px' : '40px' 
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                        <div
                                            style={{ 
                                                fontWeight: 900, 
                                                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.2rem',
                                                color: '#111111',
                                                letterSpacing: '-0.02em',
                                                cursor: 'pointer',
                                                padding: '4px 0',
                                                textAlign: window.innerWidth < 768 ? 'center' : 'left'
                                            }}
                                            onClick={() => team1 && onSelectTeam(team1.id)}
                                        >
                                            {team1?.city} {team1?.name}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receives</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                                                {trade.team2Items ? (
                                                    trade.team2Items.map((item, i) => (
                                                        <div key={i} style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '8px',
                                                            background: '#f9f9f9',
                                                            padding: '8px 12px',
                                                            borderRadius: '10px',
                                                            border: '1px solid #f2f2f7'
                                                        }}>
                                                            <span
                                                                style={{
                                                                    cursor: item.type === 'player' ? 'pointer' : 'default',
                                                                    color: '#111111',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.9rem'
                                                                }}
                                                                onClick={() => item.type === 'player' && onSelectPlayer(item.id)}
                                                            >
                                                                {item.description}
                                                            </span>
                                                            {item.subText && <span style={{ fontSize: '0.7rem', color: '#8e8e93', fontWeight: 600 }}>({item.subText})</span>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    trade.team2Assets.map((asset, i) => (
                                                        <div key={i} style={{ fontSize: '0.9rem', color: '#111111', fontWeight: 600 }}>+ {asset}</div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider / Icon */}
                                    <div style={{ 
                                        height: window.innerWidth < 768 ? 'auto' : '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        paddingTop: window.innerWidth < 768 ? '0' : '40px',
                                        transform: window.innerWidth < 768 ? 'rotate(90deg)' : 'none'
                                    }}>
                                        <div style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            borderRadius: '50%', 
                                            background: '#f2f2f7', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: '#111111'
                                        }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>⇄</div>
                                        </div>
                                    </div>

                                    {/* Team 2 Side */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: window.innerWidth < 768 ? 'center' : 'right', flex: 1 }}>
                                        <div
                                            style={{ 
                                                fontWeight: 900, 
                                                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.2rem',
                                                color: '#111111',
                                                letterSpacing: '-0.02em',
                                                cursor: 'pointer',
                                                padding: '4px 0',
                                                textAlign: window.innerWidth < 768 ? 'center' : 'right'
                                            }}
                                            onClick={() => team2 && onSelectTeam(team2.id)}
                                        >
                                            {team2?.city} {team2?.name}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receives</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: window.innerWidth < 768 ? 'center' : 'flex-end' }}>
                                                {trade.team1Items ? (
                                                    trade.team1Items.map((item, i) => (
                                                        <div key={i} style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '8px',
                                                            background: '#f9f9f9',
                                                            padding: '8px 12px',
                                                            borderRadius: '10px',
                                                            border: '1px solid #f2f2f7'
                                                        }}>
                                                            {item.subText && <span style={{ fontSize: '0.7rem', color: '#8e8e93', fontWeight: 600 }}>({item.subText})</span>}
                                                            <span
                                                                style={{
                                                                    cursor: item.type === 'player' ? 'pointer' : 'default',
                                                                    color: '#111111',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.9rem'
                                                                }}
                                                                onClick={() => item.type === 'player' && onSelectPlayer(item.id)}
                                                            >
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    trade.team1Assets.map((asset, i) => (
                                                        <div key={i} style={{ fontSize: '0.9rem', color: '#111111', fontWeight: 600 }}>+ {asset}</div>
                                                    ))
                                                )}
                                            </div>
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
