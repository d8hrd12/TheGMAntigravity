import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { AlertCircle, Check, Users } from 'lucide-react';

export const ExpansionDraftView: React.FC = () => {
    const { expansionPool, finishExpansionDraft, teams, contracts } = useGame();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'overall' | 'age' | 'salary'>('overall');

    const MAX_PICKS = 14;
    const MIN_PICKS = 8;

    const togglePlayer = (playerId: string) => {
        if (selectedIds.includes(playerId)) {
            setSelectedIds(prev => prev.filter(id => id !== playerId));
        } else {
            if (selectedIds.length >= MAX_PICKS) {
                alert(`You can only select up to ${MAX_PICKS} players.`);
                return;
            }
            setSelectedIds(prev => [...prev, playerId]);
        }
    };

    const handleFinish = () => {
        if (selectedIds.length < MIN_PICKS) {
            alert(`You must select at least ${MIN_PICKS} players to form a valid roster.`);
            return;
        }
        finishExpansionDraft(selectedIds);
    };

    const getContractInfo = (playerId: string) => {
        const c = contracts.find(con => con.playerId === playerId);
        if (!c) return "Free Agent";
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(c.amount)} (${c.yearsLeft}y)`;
    };

    const sortedPool = [...expansionPool].sort((a, b) => {
        if (sortBy === 'overall') return calculateOverall(b) - calculateOverall(a);
        if (sortBy === 'age') return a.age - b.age;
        if (sortBy === 'salary') {
            const salA = contracts.find(c => c.playerId === a.id)?.amount || 0;
            const salB = contracts.find(c => c.playerId === b.id)?.amount || 0;
            return salB - salA;
        }
        return 0;
    });

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={32} color="var(--primary)" />
                    Expansion Draft
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
                    Select up to 10 players to join your new franchise.
                    Unselected players will return to their original teams.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setSortBy('overall')}
                            style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border)', background: sortBy === 'overall' ? 'var(--primary)' : 'transparent', color: sortBy === 'overall' ? 'white' : 'var(--text)' }}
                        >Overall</button>
                        <button
                            onClick={() => setSortBy('age')}
                            style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border)', background: sortBy === 'age' ? 'var(--primary)' : 'transparent', color: sortBy === 'age' ? 'white' : 'var(--text)' }}
                        >Age</button>
                        <button
                            onClick={() => setSortBy('salary')}
                            style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border)', background: sortBy === 'salary' ? 'var(--primary)' : 'transparent', color: sortBy === 'salary' ? 'white' : 'var(--text)' }}
                        >Salary</button>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: selectedIds.length === MAX_PICKS ? 'var(--accent)' : 'var(--text)' }}>
                            Selected: {selectedIds.length} / {MAX_PICKS}
                        </span>

                        <button
                            onClick={handleFinish}
                            className="btn-primary"
                            style={{
                                padding: '10px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--primary)', // Always active, can stop early
                            }}
                        >
                            <Check size={18} /> Finish Draft
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                    {sortedPool.map(player => {
                        const isSelected = selectedIds.includes(player.id);
                        const overall = calculateOverall(player);
                        return (
                            <div
                                key={player.id}
                                onClick={() => togglePlayer(player.id)}
                                style={{
                                    background: isSelected ? 'var(--primary-dark)' : 'var(--surface-active)',
                                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                            {player.position}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{player.firstName} {player.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
                                                {player.age} yo • {getContractInfo(player.id)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 800,
                                        color: overall >= 80 ? '#2ecc71' : overall >= 75 ? '#f1c40f' : 'var(--text-secondary)'
                                    }}>
                                        {overall}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {sortedPool.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                        <AlertCircle size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p>No players in Expansion Pool. Something went wrong.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
