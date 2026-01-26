import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { getTeamState } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';

interface TradingBlockViewProps {
    teams: Team[];
    players: Player[];
    userTeamId: string;
    onInitiateTrade: (targetTeamId: string, targetPlayerId?: string) => void;
    onClose: () => void;
}

export const TradingBlockView: React.FC<TradingBlockViewProps> = ({ teams, players, userTeamId, onInitiateTrade, onClose }) => {
    const [filterState, setFilterState] = useState<'All' | 'Rebuilding' | 'Contender'>('All');

    const aiTeams = teams.filter(t => t.id !== userTeamId);

    const filteredTeams = aiTeams.filter(t => {
        if (filterState === 'All') return true;
        const state = getTeamState(t);
        return state === filterState || (filterState === 'Contender' && state === 'PlayoffTeam');
    });

    return (
        <div style={{ padding: '20px', color: '#333', height: '100%', overflowY: 'auto', background: '#f4f6f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>League Trading Block</h2>
                <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ccc', cursor: 'pointer' }}>Close</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['All', 'Rebuilding', 'Contender'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilterState(f as any)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            background: filterState === f ? '#333' : '#e0e0e0',
                            color: filterState === f ? '#fff' : '#333',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Team Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredTeams.map(team => {
                    const state = getTeamState(team);
                    const block = team.tradingBlock || [];
                    const needs = team.teamNeeds || [];

                    // Skip empty blocks if we want to be cleaner? No, show needs.

                    return (
                        <div key={team.id} style={{ background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: team.colors?.primary }}>{team.city} {team.name}</h3>
                                    <span style={{ fontSize: '0.8em', padding: '2px 6px', borderRadius: '4px', background: state === 'Contender' ? '#d4edda' : '#f8d7da', color: state === 'Contender' ? '#155724' : '#721c24', fontWeight: 'bold' }}>
                                        {state}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onInitiateTrade(team.id)}
                                    style={{ padding: '6px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}
                                >
                                    Trade
                                </button>
                            </div>

                            {/* NEEDS */}
                            <div style={{ marginBottom: '10px', fontSize: '0.85em', color: '#666' }}>
                                <strong>Seeking:</strong> {needs.length > 0 ? needs.join(', ') : 'Best Available'}
                            </div>

                            {/* BLOCK */}
                            {block.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {block.map(item => {
                                        const player = players.find(p => p.id === item.playerId);
                                        if (!player) return null;
                                        return (
                                            <div
                                                key={item.playerId}
                                                // onClick={() => onInitiateTrade(team.id, player.id)} // Moved to button to prevent ambiguity
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px',
                                                    background: '#f8f9fa',
                                                    borderRadius: '4px',
                                                    border: '1px solid #eee'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{player.firstName} {player.lastName}</div>
                                                    <div style={{ fontSize: '0.75em', color: '#555' }}>
                                                        {player.position} • {player.age}yo • {player.overall || calculateOverall(player)} OVR
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                    <div style={{ fontSize: '0.75em', color: '#e67e22', fontStyle: 'italic' }}>
                                                        {item.askingPriceDescription}
                                                    </div>
                                                    <button
                                                        onClick={() => onInitiateTrade(team.id, player.id)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            background: '#28a745',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75em',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.9em', color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                                    No players explicitly on block.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
