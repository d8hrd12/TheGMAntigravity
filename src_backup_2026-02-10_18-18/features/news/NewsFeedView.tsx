import React, { useState } from 'react';
import type { NewsStory } from '../../models/NewsStory';
import { Settings, X, Filter } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface NewsFeedViewProps {
    news: NewsStory[];
    onClose: () => void;
    onTradeForPlayer: (playerId: string) => void;
}

export const NewsFeedView: React.FC<NewsFeedViewProps> = ({ news, onClose, onTradeForPlayer }) => {
    const [filter, setFilter] = useState<'ALL' | 'GAME' | 'TRANSACTIONS' | 'INJURY' | 'RUMOR'>('ALL');

    const filteredNews = news.filter(s => {
        if (filter === 'ALL') return true;
        if (filter === 'TRANSACTIONS') return s.type === 'TRADE' || s.type === 'TRANSACTION';
        return s.type === filter;
    });

    const getPriorityColor = (priority: number) => {
        if (priority >= 5) return '#e74c3c'; // Red
        if (priority === 4) return '#e67e22'; // Orange
        if (priority === 3) return '#f1c40f'; // Yellow
        return 'var(--text-secondary)';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'var(--background)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'env(safe-area-inset-top, 44px)' // Mobile Spacer
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--surface)'
            }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    League News
                    <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                        {news.length}
                    </span>
                </h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                    <X />
                </button>
            </div >

            {/* Filters */}
            < div style={{
                padding: '10px 20px',
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                borderBottom: '1px solid var(--border)'
            }}>
                {(['ALL', 'TRANSACTIONS', 'GAME', 'INJURY', 'RUMOR'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            background: filter === f ? 'var(--primary)' : 'var(--surface)',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f === 'TRANSACTIONS' ? 'Transactions' : f}
                    </button>
                ))}
            </div >

            {/* Content */}
            < div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {
                    filteredNews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No news stories found.
                        </div>
                    ) : (
                        filteredNews.map(story => (
                            <div key={story.id} style={{
                                background: 'var(--surface)',
                                borderRadius: '12px',
                                padding: '16px',
                                borderLeft: `4px solid ${getPriorityColor(story.priority)}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <span>{story.type}</span>
                                    <span>{formatDate(story.date)}</span>
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{story.headline}</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>{story.content}</p>
                                {story.relatedPlayerId && (
                                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => {
                                                if (story.relatedPlayerId) {
                                                    onTradeForPlayer(story.relatedPlayerId);
                                                    onClose();
                                                }
                                            }}
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Trade For
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                }
            </div >
        </div >
    );
};
