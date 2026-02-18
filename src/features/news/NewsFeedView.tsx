import React, { useState } from 'react';
import type { NewsStory } from '../../models/NewsStory';
import type { Team } from '../../models/Team';
import { Settings, X, Filter, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface NewsFeedViewProps {
    news: NewsStory[];
    teams: Team[];
    onClose: () => void;
    onTradeForPlayer: (playerId: string) => void;
}

export const NewsFeedView: React.FC<NewsFeedViewProps> = ({ news, teams, onClose, onTradeForPlayer }) => {
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

    const getPriorityColor = (priority: number) => {
        if (priority >= 5) return '#ff4757'; // Modern Red
        if (priority === 4) return '#ffa502'; // Modern Orange
        if (priority === 3) return '#eccc68'; // Modern Yellow
        return 'rgba(255,255,255,0.2)';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'var(--background)',
            backgroundImage: 'radial-gradient(circle at top left, rgba(var(--primary-rgb), 0.1), transparent), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'env(safe-area-inset-top, 44px)'
        }}>
            {/* Header */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                borderTop: '1px solid rgba(255,255,255,0.05)', // Sheen
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(25, 25, 25, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.7px', color: 'white' }}>
                        League Pulse
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px', fontWeight: '500' }}>
                        {news.length} events logged this season
                    </div>
                </div>
                <button onClick={onClose} style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '12px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}>
                    <X size={22} />
                </button>
            </div >

            {/* Filters */}
            <div style={{
                padding: '16px 20px',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                background: 'rgba(15, 15, 15, 0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {(['ALL', 'PLAYER_TALK', 'RIVALRY', 'DRAFT', 'TRANSACTIONS', 'INJURY', 'RUMOR'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '10px 22px',
                            borderRadius: '16px',
                            border: filter === f ? '1.5px solid var(--primary)' : '1.5px solid rgba(255,255,255,0.1)',
                            background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                            color: 'white',
                            opacity: filter === f ? 1 : 0.7,
                            fontSize: '0.85rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            whiteSpace: 'nowrap',
                            boxShadow: filter === f ? '0 4px 15px var(--primary-glow)' : 'none'
                        }}
                    >
                        {f === 'ALL' ? 'Everything' :
                            f === 'PLAYER_TALK' ? 'Quotes' :
                                f === 'RIVALRY' ? 'Rivalries' :
                                    f === 'DRAFT' ? 'Prospects' :
                                        f === 'TRANSACTIONS' ? 'Moves' :
                                            f === 'INJURY' ? 'Injuries' :
                                                f === 'RUMOR' ? 'Intel' : f}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingBottom: '60px'
            }}>
                {
                    filteredNews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 40px', color: 'rgba(255,255,255,0.3)' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>📰</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)' }}>Silence in the League</div>
                            <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>No stories match this frequency right now.</div>
                        </div>
                    ) : (
                        filteredNews.map(story => {
                            const teamColor = getTeamColor(story.relatedTeamId);
                            return (
                                <div key={story.id} style={{
                                    background: 'rgba(30, 30, 30, 0.95)',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderLeft: `6px solid ${teamColor}`,
                                    position: 'relative',
                                    overflow: 'visible',
                                    height: 'auto',
                                    flexShrink: 0, // Prevent squeezing in flex containers
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                                    backgroundImage: `linear-gradient(135deg, ${teamColor}15 0%, transparent 100%)`,
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <div style={{ position: 'relative', zIndex: 1, height: 'auto', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                padding: '4px 12px',
                                                borderRadius: '8px',
                                                color: teamColor,
                                                border: `1px solid ${teamColor}60`
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: teamColor, boxShadow: `0 0 6px ${teamColor}` }} />
                                                {story.type}
                                            </div>
                                            <span style={{ color: 'rgba(255,255,255,0.6)', alignSelf: 'center' }}>{formatDate(story.date)}</span>
                                        </div>

                                        <div style={{
                                            margin: '0 0 12px 0',
                                            padding: 0,
                                            fontSize: '1.4rem',
                                            lineHeight: '1.2',
                                            fontWeight: '900',
                                            color: '#ffffff',
                                            letterSpacing: '-0.3px',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                            display: 'block'
                                        }}>
                                            {story.headline}
                                        </div>

                                        <div style={{
                                            margin: 0,
                                            padding: 0,
                                            fontSize: '1.0rem',
                                            color: 'rgba(255,255,255,0.9)',
                                            lineHeight: '1.5',
                                            fontWeight: '400',
                                            display: 'block'
                                        }}>
                                            {story.content}
                                        </div>

                                        {story.relatedPlayerId && (
                                            <div style={{ marginTop: '20px', paddingBottom: '8px' }}>
                                                <button
                                                    onClick={() => {
                                                        if (story.relatedPlayerId) {
                                                            onTradeForPlayer(story.relatedPlayerId);
                                                            onClose();
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.08)',
                                                        color: 'white',
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                        padding: '12px 20px',
                                                        borderRadius: '16px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    Negotiate Trade
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
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
