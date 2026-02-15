import React from 'react';
import { X, User } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { TeamLogo } from '../../components/common/TeamLogo';

interface DraftHistoryModalProps {
    year: number;
    onClose: () => void;
    onPlayerClick?: (playerId: string) => void;
}

export const DraftHistoryModal: React.FC<DraftHistoryModalProps> = ({ year, onClose, onPlayerClick }) => {
    const { draftHistory, teams } = useGame();

    const results = draftHistory[year] || [];

    // Sort just in case consistency is needed, usually results are pushed in order
    const sortedResults = [...results].sort((a, b) => a.pick - b.pick);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--surface)',
                width: '90%',
                maxWidth: '800px',
                height: '80vh',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--surface-active)'
                }}>
                    <h2 style={{ margin: 0, color: 'var(--text)' }}>{year} Draft Class</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {sortedResults.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '50px' }}>
                            No draft history available for {year}.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {sortedResults.map((result) => {
                                const team = teams.find(t => t.id === result.teamId);
                                return (
                                    <div key={result.pick}
                                        onClick={() => onPlayerClick && onPlayerClick(result.playerId)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'var(--surface-glass)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            cursor: onPlayerClick ? 'pointer' : 'default',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-active)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-glass)'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'var(--surface)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                border: '1px solid var(--border)',
                                                fontWeight: 'bold',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {result.pick}
                                            </div>

                                            {team && <TeamLogo teamId={team.id} size={30} />}

                                            <div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--text)', fontSize: '1.1rem' }}>
                                                    {result.playerName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    Round {result.round} &bull; {team ? `${team.city} ${team.name}` : 'Unknown Team'}
                                                </div>
                                            </div>
                                        </div>

                                        {onPlayerClick && <div style={{ color: 'var(--primary)' }}><User size={20} /></div>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
