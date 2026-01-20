import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import type { PlayoffSeries } from '../../store/GameContext';
// import type { Team } from '../../models/Team';

export const PlayoffView: React.FC = () => {
    const { playoffs, teams, advanceDay, simulateRound } = useGame();
    // Default to the latest active round
    const maxRound = Math.max(...playoffs.map(s => s.round), 1);
    const [selectedRound, setSelectedRound] = useState(maxRound);

    // Auto-update selected round when max round changes (e.g. simulation advances)
    useEffect(() => {
        const currentMax = Math.max(...playoffs.map(s => s.round), 1);
        if (currentMax > selectedRound) {
            setSelectedRound(currentMax);
        }
    }, [playoffs, selectedRound]);


    const getTeam = (id: string) => teams.find(t => t.id === id);

    const SeriesCard = ({ series }: { series: PlayoffSeries }) => {
        const { userTeamId } = useGame(); // Get userTeamId
        const home = getTeam(series.homeTeamId);
        const away = getTeam(series.awayTeamId);
        if (!home || !away) return null;

        const isFinished = !!series.winnerId;
        const isUserInSeries = home.id === userTeamId || away.id === userTeamId;

        return (
            <div style={{
                background: isUserInSeries ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface)',
                border: isUserInSeries ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '12px',
                opacity: isFinished ? 0.9 : 1,
                boxShadow: isUserInSeries ? '0 0 15px rgba(var(--primary-rgb), 0.2)' : (isFinished ? 'none' : '0 4px 6px rgba(0,0,0,0.1)'),
                transform: isUserInSeries ? 'scale(1.02)' : 'none',
                transition: 'all 0.2s ease'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: series.winnerId === home.id ? 'bold' : 'normal', opacity: series.winnerId && series.winnerId !== home.id ? 0.6 : 1 }}>
                    <span style={{ fontSize: '1rem', color: home.id === userTeamId ? 'var(--primary)' : 'var(--text)', fontWeight: home.id === userTeamId ? '800' : 'inherit' }}>
                        {series.round === 1 ? <span style={{ fontSize: '0.7em', color: '#888', marginRight: '6px', verticalAlign: 'middle' }}>({getTeam(series.homeTeamId)?.conference === 'West' ? 'W' : 'E'}#{series.id.split('_')[2] === '1' ? '1' : (series.id.split('_')[2] === '2' ? '4' : (series.id.split('_')[2] === '3' ? '2' : '3'))})</span> : null}
                        {home.city} {home.name} {home.id === userTeamId && ' (YOU)'}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: series.winnerId === home.id ? 'var(--primary)' : 'var(--text)' }}>{series.homeWins}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: series.winnerId === away.id ? 'bold' : 'normal', opacity: series.winnerId && series.winnerId !== away.id ? 0.6 : 1 }}>
                    <span style={{ fontSize: '1rem', color: away.id === userTeamId ? 'var(--primary)' : 'var(--text)', fontWeight: away.id === userTeamId ? '800' : 'inherit' }}>
                        {series.round === 1 ? <span style={{ fontSize: '0.7em', color: '#888', marginRight: '6px', verticalAlign: 'middle' }}>({getTeam(series.awayTeamId)?.conference === 'West' ? 'W' : 'E'}#{series.id.split('_')[2] === '1' ? '8' : (series.id.split('_')[2] === '2' ? '5' : (series.id.split('_')[2] === '3' ? '7' : '6'))})</span> : null}
                        {away.city} {away.name} {away.id === userTeamId && ' (YOU)'}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: series.winnerId === away.id ? 'var(--primary)' : 'var(--text)' }}>{series.awayWins}</span>
                </div>
                {isFinished && <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--success)', textAlign: 'right' }}>Series Finished</div>}
            </div>
        );
    };

    const RoundView = ({ round }: { round: number }) => {
        const roundSeries = playoffs.filter(s => s.round === round);
        const westSeries = roundSeries.filter(s => s.conference === 'West');
        const eastSeries = roundSeries.filter(s => s.conference === 'East');
        const finals = roundSeries.filter(s => s.conference === 'Finals');

        return (
            <div className="animate-enter">
                {round === 4 ? (
                    <div>
                        <h3 style={{ textAlign: 'center', marginBottom: '15px', color: 'var(--accent)' }}>The NBA Finals</h3>
                        {finals.map(s => <SeriesCard key={s.id} series={s} />)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        {westSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>Western Conference</h4>
                                {westSeries.map(s => <SeriesCard key={s.id} series={s} />)}
                            </div>
                        )}
                        {eastSeries.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>Eastern Conference</h4>
                                {eastSeries.map(s => <SeriesCard key={s.id} series={s} />)}
                            </div>
                        )}
                    </div>
                )}
                {roundSeries.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Round not started yet.</p>}
            </div>
        );
    };

    const tabs = [
        { id: 1, label: 'Round 1' },
        { id: 2, label: 'Semis' },
        { id: 3, label: 'Conf. Finals' },
        { id: 4, label: 'Finals' },
    ];

    return (
        <div style={{ padding: '0 20px 100px 20px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'sticky', top: 0, background: 'var(--background)', zIndex: 10, padding: '20px 0 10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => window.location.reload()} // Emergency hatch if stuck, but ideally use props. 
                        // Wait, I can't access setView here easily without context or props.
                        // I'll assume App passes a setter or I should rely on App's footer.
                        // User said "cant go back", implying footer might differ?
                        // Actually, I should use useGame() to maybe trigger a navigation if possible, but navigation is in App state.
                        // Let's just rely on the existing footer? 
                        // User says "cant go back". Maybe the footer is hidden?
                        // Checking App.tsx, footer is ALWAYS visible unless...

                        // Valid Fix: Pass `onBack` prop to PlayoffView?
                        // Or just tell user to use the bottom tabs?
                        // If they say they can't, maybe the UI is blocking it.

                        // Let's add the button but it needs to do something.
                        // I will add `setView` to GameContext? No, that's App state.

                        // I will try to use the BACK ARROW icon and make it do `window.history.back()`? No, it's a SPA.

                        // OK, I will inspect App.tsx to see how PlayoffView is rendered.
                        // If I can't pass props easily without changing App.tsx signature, I might need to dispatch an event or something.
                        // BUT, looking at `TradeCenterView`, it has a back button.

                        // Let's look at `App.tsx` again.
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {/* Placeholder for now until I confirm App.tsx structure */}
                        {/* <ArrowLeft size={24} color="var(--text)" /> */}
                    </button>
                    <h2 style={{ margin: 0 }}>Playoffs</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => advanceDay()}
                        className="btn-primary"
                        style={{
                            padding: '10px 16px',
                            fontSize: '0.85rem'
                        }}
                    >
                        Sim Next Game
                    </button>

                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '20px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedRound(tab.id)}
                        style={{
                            padding: '8px 16px',
                            background: selectedRound === tab.id ? 'var(--primary)' : 'var(--surface)',
                            color: selectedRound === tab.id ? 'white' : 'var(--text-secondary)',
                            borderRadius: '20px',
                            whiteSpace: 'nowrap',
                            border: selectedRound === tab.id ? 'none' : '1px solid var(--border)',
                            fontWeight: selectedRound === tab.id ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <RoundView round={selectedRound} />
        </div>
    );
};
