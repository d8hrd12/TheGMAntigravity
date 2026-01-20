import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { BackButton } from '../ui/BackButton';
import { Trophy } from 'lucide-react';

interface HistoryViewProps {
    onBack: () => void;
    onSelectPlayer: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack, onSelectPlayer }) => {
    const { retiredPlayersHistory = [], awardsHistory } = useGame();
    const [activeTab, setActiveTab] = useState<'retired' | 'awards'>('retired');
    const [viewMode, setViewMode] = useState<'year' | 'hof'>('year');
    const [selectedYear, setSelectedYear] = useState<number>(retiredPlayersHistory.length > 0 ? retiredPlayersHistory[retiredPlayersHistory.length - 1].year : new Date().getFullYear());

    const availableYears = retiredPlayersHistory.map(h => h.year).sort((a, b) => b - a);

    const activeRetirements = useMemo(() => {
        return retiredPlayersHistory.find(h => h.year === selectedYear)?.players || [];
    }, [retiredPlayersHistory, selectedYear]);

    const hallOfFamePlayers = useMemo(() => {
        return retiredPlayersHistory.flatMap(h => h.players).filter(p => p.isHallOfFame);
    }, [retiredPlayersHistory]);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />
                <h1 style={{ margin: 0 }}>League History</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('retired')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'retired' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'retired' ? 'white' : 'var(--text)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Retired Players
                </button>
            </div>

            {activeTab === 'retired' && (
                <div>
                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ background: 'var(--surface)', padding: '4px', borderRadius: '8px', display: 'flex' }}>
                            <button
                                onClick={() => setViewMode('year')}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'year' ? 'var(--border)' : 'transparent',
                                    color: 'var(--text)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                By Year
                            </button>
                            <button
                                onClick={() => setViewMode('hof')}
                                style={{
                                    padding: '8px 16px',
                                    background: viewMode === 'hof' ? 'linear-gradient(135deg, #f1c40f 0%, #d4ac0d 100%)' : 'transparent',
                                    color: viewMode === 'hof' ? '#000' : 'var(--text)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Trophy size={14} />
                                Hall of Fame ({hallOfFamePlayers.length})
                            </button>
                        </div>

                        {/* Year Selector (Only visible in 'year' mode) */}
                        {viewMode === 'year' && (
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: 'var(--surface)',
                                    color: 'var(--text)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem'
                                }}
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                                {availableYears.length === 0 && <option>{new Date().getFullYear()}</option>}
                            </select>
                        )}
                    </div>

                    {/* HOF Banner */}
                    {viewMode === 'hof' && hallOfFamePlayers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                            <Trophy size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                            <h3>Empty Halls</h3>
                            <p>No players have been inducted into the Hall of Fame yet.</p>
                        </div>
                    )}

                    {/* List */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                        {viewMode === 'year' ? (
                            activeRetirements.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)' }}>No records for this year.</div>
                            ) : (
                                activeRetirements.map(p => (
                                    <RetiredPlayerCard key={p.id} player={p} onClick={() => onSelectPlayer(p.id)} />
                                ))
                            )
                        ) : (
                            hallOfFamePlayers.map(p => (
                                <RetiredPlayerCard key={p.id} player={p} isHOFView onClick={() => onSelectPlayer(p.id)} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const RetiredPlayerCard = ({ player, isHOFView, onClick }: { player: any, isHOFView?: boolean, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            style={{
                background: isHOFView || player.isHallOfFame ? 'linear-gradient(to bottom right, var(--surface), rgba(241, 196, 15, 0.05))' : 'var(--surface)',
                padding: '15px',
                borderRadius: '12px',
                border: isHOFView || player.isHallOfFame ? '1px solid #f1c40f' : '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
            }}>
            {(isHOFView || player.isHallOfFame) && (
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <Trophy size={16} color="#f1c40f" />
                </div>
            )}

            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', paddingRight: '20px' }}>{player.firstName} {player.lastName}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {player.position} • Retired {player.exitYear} (Age {player.ageAtRetirement})
            </div>

            {/* Show HOF Badges or Stats Summary if possible */}
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Overall: {Math.round(player.overall)}
            </div>
        </div>
    );
};
