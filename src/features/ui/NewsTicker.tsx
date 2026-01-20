import React from 'react';
import type { Player } from '../../models/Player';
import type { NewsStory } from '../../models/NewsStory';

interface NewsTickerProps {
    players: Player[];
    news: NewsStory[];
    onClick?: () => void;
    showTutorial?: boolean;
    onTutorialClose?: () => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ players, news, onClick, showTutorial, onTutorialClose }) => {
    // Helper to get top leader for a stat
    const getLeader = (key: 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks') => {
        const qualified = players.filter(p => p.seasonStats && p.seasonStats.gamesPlayed > 0);
        if (qualified.length === 0) return null;
        return qualified.sort((a, b) => (b.seasonStats[key] / b.seasonStats.gamesPlayed) - (a.seasonStats[key] / a.seasonStats.gamesPlayed))[0];
    };

    const ptsLeader = getLeader('points');
    const recentNews = news.slice(0, 5).map(s => `NEWS: ${s.headline}`);

    let items: string[] = [];

    if (!ptsLeader && recentNews.length === 0) {
        items = ["Welcome to TheGM! Season Tip-Off approaches...", "Trade Deadline: Game 40", "Upcoming: Draft Class 2026"];
    } else {
        const stats = ptsLeader ? [
            `PTS Leader: ${ptsLeader.lastName} (${(ptsLeader.seasonStats.points / ptsLeader.seasonStats.gamesPlayed).toFixed(1)})`
        ] : [];

        items = [...recentNews, ...stats];
    }

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

    // Duplicate items for seamless loop
    const displayItems = [...items, ...items, ...items, ...items]; // Repeat enough times to fill screen + scroll

    // Determine if tutorial should show
    // We expect showTutorial prop

    return (
        <>
            <div
                onClick={() => {
                    handleClick();
                    if (onTutorialClose) onTutorialClose();
                }}
                style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    padding: '8px 0',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    borderBottom: '1px solid var(--border)',
                    position: 'fixed',
                    top: 'var(--safe-top)',
                    left: 0,
                    width: '100vw',
                    zIndex: 9999,
                    cursor: onClick ? 'pointer' : 'default',
                    animation: isFlashing ? 'glow 1.0s infinite alternate' : 'none', // Faster pulse
                    transition: 'background 0.3s',
                    boxShadow: isFlashing ? '0 0 10px var(--primary-glow)' : 'none'
                }}
            >
                <div className="ticker-content" style={{ display: 'inline-block', animation: 'marquee 60s linear infinite', color: 'var(--primary)', paddingLeft: '20px' }}>
                    {displayItems.join('  ✦  ')}
                </div>
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes glow {
                        from { background: var(--surface); box-shadow: 0 0 5px transparent; }
                        to { background: var(--surface-active); box-shadow: 0 0 20px var(--primary); border-bottom-color: var(--primary); }
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
                        top: 'calc(var(--safe-top) + 50px)',
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
                        marginBottom: '10px'
                    }}>
                        ⬆
                    </div>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        textAlign: 'center',
                        maxWidth: '80vw'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>League News</div>
                        <div style={{ fontSize: '0.9rem' }}>Tap the bar to see all league updates!</div>
                    </div>
                </div>
            )}
        </>
    );
};
