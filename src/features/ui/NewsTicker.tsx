import React from 'react';
import type { Player } from '../../models/Player';
import type { NewsStory } from '../../models/NewsStory';
import type { Team } from '../../models/Team';

interface NewsTickerProps {
    players: Player[];
    news: NewsStory[];
    teams: Team[];
    onClick?: () => void;
    showTutorial?: boolean;
    onTutorialClose?: () => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ players, news, teams, onClick, showTutorial, onTutorialClose }) => {
    // Helper to get top leader for a stat
    const getLeader = (key: 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks') => {
        const qualified = players.filter(p => p.seasonStats && p.seasonStats.gamesPlayed > 0);
        if (qualified.length === 0) return null;
        return qualified.sort((a, b) => (b.seasonStats[key] / b.seasonStats.gamesPlayed) - (a.seasonStats[key] / a.seasonStats.gamesPlayed))[0];
    };

    const ptsLeader = getLeader('points');

    // Filter for high-priority news first (Trades, Injuries, Rumors)
    const priorityTypes = ['TRADE', 'INJURY', 'RUMOR', 'TRANSACTION', 'AWARD'];
    const importantNews = news.filter(s => priorityTypes.includes(s.type));
    const otherNews = news.filter(s => !priorityTypes.includes(s.type));

    // Interleave: 3 Important, 2 Other (e.g., game results)
    const finalNewsList = [
        ...importantNews.slice(0, 3),
        ...otherNews.slice(0, 2)
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 6); // Keep top 6 total

    // Fallback if no important news
    const displayNewsItems = finalNewsList.length > 0 ? finalNewsList : news.slice(0, 5);

    const getTeamColor = (teamId?: string | null) => {
        if (!teamId) return 'var(--primary)';
        const team = teams.find(t => t.id === teamId);
        return team?.colors?.primary || 'var(--primary)';
    };

    const formatHeadline = (s: NewsStory) => {
        switch (s.type) {
            case 'TRADE': return `🔄 TRADE: ${s.headline}`;
            case 'INJURY': return `🏥 INJURY: ${s.headline}`;
            case 'RUMOR': return `👀 RUMOR: ${s.headline}`;
            case 'TRANSACTION': return `✍️ SIGNING: ${s.headline}`;
            case 'AWARD': return `🏆 AWARD: ${s.headline}`;
            default: return s.headline;
        }
    };

    const [isFlashing, setIsFlashing] = React.useState(false);
    const [lastNewsId, setLastNewsId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (news.length > 0) {
            const latestId = news[0].id;
            if (lastNewsId !== null && latestId !== lastNewsId) {
                setIsFlashing(true);
            }
            setLastNewsId(latestId);
        }
    }, [news, lastNewsId]);

    const handleClick = () => {
        setIsFlashing(false);
        if (onClick) onClick();
    };

    // Prepare items with coloring
    const tickerSegments = displayNewsItems.map(s => ({
        text: formatHeadline(s),
        color: getTeamColor(s.relatedTeamId)
    }));

    if (ptsLeader) {
        tickerSegments.push({
            text: `📊 STATS: ${ptsLeader.lastName} leads the league with ${(ptsLeader.seasonStats.points / ptsLeader.seasonStats.gamesPlayed).toFixed(1)} PPG`,
            color: getTeamColor(ptsLeader.teamId)
        });
    }

    if (tickerSegments.length === 0) {
        tickerSegments.push({ text: "Welcome to TheGM! Season Tip-Off approaches...", color: 'var(--primary)' });
    }

    // Add Live Badge to the front
    const liveIndicator = { text: "LIVE PULSE", color: '#ff4757', isBadge: true };

    // Duplicate segments for seamless loop
    const displaySegments = [liveIndicator, ...tickerSegments, ...tickerSegments, ...tickerSegments];

    return (
        <>
            <div
                onClick={() => {
                    handleClick();
                    if (onTutorialClose) onTutorialClose();
                }}
                style={{
                    background: 'rgba(25, 25, 25, 0.8)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', // Subtle texture
                    color: 'var(--text)',
                    padding: '12px 0',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)', // Sheen
                    position: 'fixed',
                    top: 'var(--safe-top)',
                    left: 0,
                    width: '100vw',
                    zIndex: 9999,
                    cursor: onClick ? 'pointer' : 'default',
                    animation: isFlashing ? 'glow 1.5s infinite alternate' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isFlashing ? '0 4px 20px var(--primary-glow)' : '0 4px 15px rgba(0,0,0,0.4)',
                    boxSizing: 'border-box'
                }}
            >
                <div className="ticker-content" style={{ display: 'inline-block', animation: 'marquee 40s linear infinite' }}>
                    {displaySegments.map((seg, idx) => (
                        <span key={idx} style={{
                            padding: '0 28px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            {('isBadge' in seg) ? (
                                <span style={{
                                    background: seg.color,
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: '900',
                                    letterSpacing: '1px',
                                    boxShadow: `0 0 10px ${seg.color}60`
                                }}>
                                    {seg.text}
                                </span>
                            ) : (
                                <>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: seg.color,
                                        boxShadow: `0 0 10px ${seg.color}`
                                    }} />
                                    <span style={{
                                        color: 'white',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                        letterSpacing: '0.2px'
                                    }}>{seg.text}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: '12px', fontSize: '1rem' }}>✦</span>
                                </>
                            )}
                        </span>
                    ))}
                </div>
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.33%); }
                    }
                    @keyframes glow {
                        from { background: rgba(25, 25, 25, 0.8); border-bottom-color: rgba(255,255,255,0.1); }
                        to { background: rgba(var(--primary-rgb, 255, 95, 31), 0.3); border-bottom-color: var(--primary); }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `}</style>
            </div>

            {showTutorial && (
                <div
                    onClick={() => onTutorialClose && onTutorialClose()}
                    style={{
                        position: 'fixed',
                        top: 'calc(var(--safe-top) + 60px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pointerEvents: 'auto'
                    }}
                >
                    <div style={{
                        fontSize: '2rem',
                        color: 'var(--primary)',
                        animation: 'bounce 1s infinite',
                        marginBottom: '10px',
                        textShadow: '0 0 10px var(--primary-glow)'
                    }}>
                        ⬆
                    </div>
                    <div style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        padding: '16px 24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        textAlign: 'center',
                        maxWidth: '85vw'
                    }}>
                        <div style={{ fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>League Pulse</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Tap the ticker to dive into the stories.</div>
                    </div>
                </div>
            )}
        </>
    );
};

