import React, { useState } from 'react';
import type { NewsStory } from '../../models/NewsStory';
import type { Team } from '../../models/Team';
import { X, Filter, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface NewsFeedViewProps {
    news: NewsStory[];
    teams: Team[];
    onClose: () => void;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
}

export const NewsFeedView: React.FC<NewsFeedViewProps> = ({ news, teams, onClose, onSelectPlayer, onSelectTeam }) => {
    const [filter, setFilter] = useState<'ALL' | 'PLAYER_TALK' | 'RIVALRY' | 'DRAFT' | 'TRANSACTIONS' | 'INJURY' | 'RUMOR'>('ALL');

    const filteredNews = news.filter(s => {
        if (filter === 'ALL') return true;
        if (filter === 'TRANSACTIONS') return s.type === 'TRADE' || s.type === 'TRANSACTION';
        if (filter === 'RIVALRY') return s.headline.includes('RIVALRY:');
        return s.type === filter;
    });

    const getTeamColor = (teamId?: string) => {
        if (!teamId) return 'var(--primary)';
        const team = teams.find(t => t.id === teamId);
        return team?.colors?.primary || 'var(--primary)';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'var(--bg-main)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        League News
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {news.length} updates logged
                    </div>
                </div>
                <button onClick={onClose} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <X size={20} />
                </button>
            </div >

            {/* Filters */}
            <div style={{
                padding: '12px 20px',
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                scrollbarWidth: 'none',
            }}>
                {(['ALL', 'PLAYER_TALK', 'RIVALRY', 'DRAFT', 'TRANSACTIONS', 'INJURY', 'RUMOR'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`nav-link ${filter === f ? 'active' : ''}`}
                        style={{
                            padding: '0 16px',
                            width: 'auto',
                            margin: 0,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                paddingBottom: '80px'
            }}>
                {
                    filteredNews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>No news items found.</div>
                        </div>
                    ) : (
                        filteredNews.map(story => {
                            const team = teams.find(t => t.id === story.relatedTeamId);
                            const teamColor = team?.colors?.primary || 'var(--primary)';
                            return (
                                <div key={story.id} style={{
                                    background: '#ffffff',
                                    borderRadius: '14px',
                                    padding: '20px',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: `4px solid ${teamColor}`,
                                    boxShadow: 'var(--shadow-sm)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div 
                                            onClick={() => team && onSelectTeam(team.id)}
                                            style={{ 
                                                fontSize: '0.65rem', 
                                                fontWeight: '800', 
                                                color: teamColor, 
                                                textTransform: 'uppercase',
                                                cursor: team ? 'pointer' : 'default',
                                            }}>
                                            {story.type} {team ? `• ${team.abbreviation}` : ''}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{formatDate(story.date)}</span>
                                    </div>

                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
                                        {story.headline}
                                    </h3>

                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                                        {story.content}
                                    </p>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                        {story.relatedPlayerId && (
                                            <button
                                                onClick={() => onSelectPlayer(story.relatedPlayerId!)}
                                                className="btn-modern"
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                            >
                                                View Player
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                        {team && (
                                            <button
                                                onClick={() => onSelectTeam(team.id)}
                                                className="btn-modern"
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                                View Team
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )
                }
            </div >
        </div >
    );
};
