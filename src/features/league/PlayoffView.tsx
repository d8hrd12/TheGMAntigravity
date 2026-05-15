
import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { PlayoffHero } from './components/PlayoffHero';
import { PlayoffMatchupCard } from './components/PlayoffMatchupCard';
import { Trophy } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';



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
        advanceDay(); // Triggers one-day/one-game simulation
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
    const elSeries = currentRoundSeries.filter(s => s.conference === 'EuroLeague');
    const ecSeries = currentRoundSeries.filter(s => s.conference === 'EuroCup');
    const finalsSeries = currentRoundSeries.filter(s => s.conference === 'Finals');

    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
            <PageHeader
                title="Postseason"
                subtitle={`${new Date().getFullYear()} Playoffs`}
                onBack={onBack || (() => {})}
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            <div style={{ padding: '0 20px' }}>

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
            <div style={{ display: 'flex', overflowX: 'auto', gap: '2px', marginBottom: '24px', padding: '4px', background: '#f2f2f7', borderRadius: '10px', scrollbarWidth: 'none' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedRound(tab.id)}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            background: selectedRound === tab.id ? '#ffffff' : 'transparent',
                            color: selectedRound === tab.id ? '#111111' : '#8e8e93',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                            border: 'none',
                            fontWeight: selectedRound === tab.id ? '700' : '500',
                            fontSize: '0.8rem',
                            boxShadow: selectedRound === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
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
                        {westSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                                    Western Conference
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {westSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />)}
                                </div>
                            </div>
                        )}

                        {/* Eastern Conference */}
                        {eastSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                                    Eastern Conference
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {eastSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />)}
                                </div>
                            </div>
                        )}

                        {/* EuroLeague */}
                        {elSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: '#f39c12', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #f39c12', paddingBottom: '4px' }}>
                                    EuroLeague
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {elSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />)}
                                </div>
                            </div>
                        )}

                        {/* EuroCup */}
                        {ecSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: '#3498db', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #3498db', paddingBottom: '4px' }}>
                                    EuroCup
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {ecSeries.map(s => <PlayoffMatchupCard key={s.id} series={s} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>

            </div>
        </div>
    );
};
