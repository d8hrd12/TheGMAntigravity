import React, { useState } from 'react';
import type { MatchResult } from './SimulationTypes';
import type { Team } from '../../models/Team';
import { formatDate } from '../../utils/dateUtils';
import { BackButton } from '../ui/BackButton';

interface GameResultsViewProps {
    games: MatchResult[]; // All games history
    teams: Team[];
    onBack: () => void;
    onSelectGame: (game: MatchResult) => void;
}

export const GameResultsView: React.FC<GameResultsViewProps> = ({ games, teams, onBack, onSelectGame }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>('all');

    const filteredGames = selectedTeamId === 'all'
        ? games
        : games.filter(g => g.homeTeamId === selectedTeamId || g.awayTeamId === selectedTeamId);

    // Sort by date descending (newest first)
    const sortedGames = [...filteredGames].reverse();

    return (
        <div style={{ paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text)' }}>&larr; Back</button>
                <h2>Game Results</h2>
                <div style={{ width: '50px' }}></div> {/* Spacer */}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                >
                    <option value="all">All Teams</option>
                    {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.city} {t.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
                {sortedGames.map(game => {
                    const home = teams.find(t => t.id === game.homeTeamId);
                    const away = teams.find(t => t.id === game.awayTeamId);

                    return (
                        <div
                            key={game.id}
                            onClick={() => onSelectGame(game)}
                            className="glass-panel"
                            style={{
                                padding: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{formatDate(game.date)}</div>
                                <div style={{ fontWeight: game.winnerId === game.awayTeamId ? 'bold' : 'normal', color: 'var(--text)' }}>
                                    {away?.city} {away?.name} <span style={{ float: 'right' }}>{game.awayScore}</span>
                                </div>
                                <div style={{ fontWeight: game.winnerId === game.homeTeamId ? 'bold' : 'normal', color: 'var(--text)' }}>
                                    {home?.city} {home?.name} <span style={{ float: 'right' }}>{game.homeScore}</span>
                                </div>
                            </div>
                            <div style={{ marginLeft: '10px', color: 'var(--text-secondary)' }}>&rsaquo;</div>
                        </div>
                    );
                })}
                {sortedGames.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No games found.</p>}
            </div>
        </div>
    );
};
