
import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { PlayoffHero } from './components/PlayoffHero';
import { PlayoffMatchupCard } from './components/PlayoffMatchupCard';
import { Trophy } from 'lucide-react';
import { BackButton } from '../ui/BackButton';


interface PlayoffViewProps {
    onNavigate: (view: any) => void;
    onBack?: () => void;
}

export const PlayoffView: React.FC<PlayoffViewProps> = ({ onNavigate, onBack }) => {
    const { playoffs, teams, advanceDay, userTeamId, startLiveGameFn } = useGame();

    // Find User's Active Series
    const userSeries = playoffs.find(s =>
        (s.homeTeamId === userTeamId || s.awayTeamId === userTeamId) && !s.winnerId
    );

    // Determines current round based on user series or max round
    const maxRound = Math.max(...playoffs.map(s => s.round), 1);
    const [selectedRound, setSelectedRound] = useState(maxRound);

    // Auto-update selected round if we advance
    useEffect(() => {
        if (maxRound > selectedRound) setSelectedRound(maxRound);
    }, [maxRound]);

    const handleSimGame = () => {
        if (confirm("Simulate the next game day?")) {
            advanceDay(); // Triggers one-day/one-game simulation
        }
    };

    const handlePlayGame = () => {
        if (!userSeries) return;
        // Logic to start game
        const home = teams.find(t => t.id === userSeries.homeTeamId);
        const away = teams.find(t => t.id === userSeries.awayTeamId);
        if (home && away) {
            startLiveGameFn({ home, away });
        }
    };

    const tabs = [
        { id: 1, label: 'Round 1' },
        { id: 2, label: 'Semis' },
        { id: 3, label: 'Conf. Finals' },
        { id: 4, label: 'Finals' },
    ];

    const currentRoundSeries = playoffs.filter(s => s.round === selectedRound);

    // Split by Conference if not Finals
    const westSeries = currentRoundSeries.filter(s => s.conference === 'West');
    const eastSeries = currentRoundSeries.filter(s => s.conference === 'East');
    const finalsSeries = currentRoundSeries.filter(s => s.conference === 'Finals');

    return (
        <div style={{ padding: '0 20px 100px 20px', height: '100%', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {onBack && <BackButton onClick={onBack} />}
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Trophy size={28} color="var(--primary)" />
                        Postseason
                    </h2>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    2025 Playoffs
                </div>
            </div>

            {/* HERO SECTION: User's Series (Only show if active) */}
            {userSeries && (
                <PlayoffHero
                    series={userSeries}
                    onSimGame={handleSimGame}
                    onPlayGame={handlePlayGame}
                    onViewRotation={() => onNavigate('rotation')}
                    onViewGameplan={() => onNavigate('strategy')}
                />
            )}

            {/* No Active Series Message */}
            {!userSeries && (
                <div style={{
                    padding: '16px',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                        {playoffs.length === 0 ? "Playoffs haven't started yet." : "You are waiting for the next round or have been eliminated."}
                    </div>
                    {playoffs.length > 0 && (
                        <button
                            onClick={handleSimGame}
                            className="btn-primary"
                            style={{ marginTop: '10px', padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                            Sim Day
                        </button>
                    )}
                </div>
            )}

            {/* Round Navigation Tabs */}
            <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedRound(tab.id)}
                        style={{
                            padding: '8px 14px',
                            background: selectedRound === tab.id ? 'var(--primary)' : 'var(--surface)',
                            color: selectedRound === tab.id ? 'white' : 'var(--text-secondary)',
                            borderRadius: '20px',
                            whiteSpace: 'nowrap',
                            border: selectedRound === tab.id ? 'none' : '1px solid var(--border)',
                            fontWeight: selectedRound === tab.id ? 'bold' : 'normal',
                            fontSize: '0.85rem'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Vertical Matchup List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {selectedRound === 4 ? (
                    <div>
                        {finalsSeries.length > 0 ? finalsSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />) : <div style={{ textAlign: 'center', color: '#666' }}>Waiting for Finals...</div>}
                    </div>
                ) : (
                    <>
                        {/* Western Conference */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                                Western Conference
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {westSeries.length > 0 ? westSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />) : <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>No matchups yet</div>}
                            </div>
                        </div>

                        {/* Eastern Conference */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                                Eastern Conference
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {eastSeries.length > 0 ? eastSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />) : <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>No matchups yet</div>}
                            </div>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
};
