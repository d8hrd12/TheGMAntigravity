import React, { useState } from 'react';
import { 
    Trophy, TrendingUp, TrendingDown, Star, CheckCircle2, 
    Newspaper, DollarSign, ArrowUpRight, ArrowDownRight, Award, Zap, User 
} from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { calculateOverall, calculateEWA } from '../../utils/playerUtils';
import type { Player } from '../../models/Player';

const VintagePlayerSilhouette: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#faf6eb',
            border: '2px solid #1c1c1e',
            overflow: 'hidden'
        }}>
            <img 
                src="/assets/signing_of_year.jpg" 
                alt="Signing of the Year" 
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    // Apply perfect vintage grayscale, high contrast & newspaper brightness
                    filter: 'grayscale(100%) contrast(135%) brightness(95%)',
                    display: 'block'
                }}
            />
            {/* Vintage newspaper print screen halftone texture overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                opacity: 0.18,
                background: 'radial-gradient(circle, #000 20%, transparent 20%), radial-gradient(circle, #000 20%, transparent 20%)',
                backgroundSize: '3px 3px',
                backgroundPosition: '0 0, 1.5px 1.5px'
            }} />
        </div>
    );
};

interface EuroSeasonReviewModalProps {
    review: {
        euroLeagueWinner: string;
        euroCupWinner: string;
        promoted: string;
        relegated: string;
    };
    onClose: () => void;
}

type ActiveTab = 'headline' | 'champions' | 'movements' | 'signing' | 'financials';

export const EuroSeasonReviewModal: React.FC<EuroSeasonReviewModalProps> = ({ review, onClose }) => {
    const { teams, players, contracts, transactions, date, userTeamId } = useGame();
    const [activeTab, setActiveTab] = useState<ActiveTab>('headline');

    const userTeam = teams.find(t => t.id === userTeamId);
    const userTeamName = userTeam?.name || '';
    
    // Check user's outcome
    const isUserPromoted = review.promoted === userTeamName;
    const isUserRelegated = review.relegated === userTeamName;
    const isUserELWinner = review.euroLeagueWinner === userTeamName;
    const isUserECWinner = review.euroCupWinner === userTeamName;

    const findTeamLogo = (teamName: string) => {
        return teams.find(t => t.name === teamName)?.logo;
    };

    const findTeamColors = (teamName: string) => {
        return teams.find(t => t.name === teamName)?.colors || { primary: '#3498db', secondary: '#ffffff' };
    };

    // Headline logic
    let headlineText = "EUROPEAN BASKETBALL IN SHOCKWAVES: SEASON RECAP!";
    let headlineSub = "Promotion, relegation, and championship glory finalized in spectacular fashion.";
    let bannerColor = 'linear-gradient(135deg, #1e3c72, #2a5298)';
    let primaryHighlightColor = '#3498db';

    if (isUserPromoted || isUserECWinner) {
        headlineText = `${userTeamName.toUpperCase()} CLINCHES PROMOTION TO EUROLEAGUE!`;
        headlineSub = `A fairytale campaign concludes with absolute triumph and a ticket to Europe's top tier next season.`;
        bannerColor = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        primaryHighlightColor = '#2ecc71';
    } else if (isUserRelegated) {
        headlineText = `HEARTBREAK! ${userTeamName.toUpperCase()} RELEGATED TO EUROCUP!`;
        headlineSub = `A devastating season ends in the drop. The board demands a complete roster review for a swift return.`;
        bannerColor = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        primaryHighlightColor = '#e74c3c';
    } else if (isUserELWinner) {
        headlineText = `${userTeamName.toUpperCase()} CROWNED KINGS OF EUROPE!`;
        headlineSub = `Panionios or other EuroLeague heavyweights watch in awe as they lift the ultimate trophy.`;
        bannerColor = 'linear-gradient(135deg, #f1c40f, #f39c12)';
        primaryHighlightColor = '#f1c40f';
    }

    // Dynamic Article text generator (Enforcing EuroLeague news FIRST, then EuroCup news)
    const getArticleText = () => {
        const elChampText = `In the EuroLeague, the powerhouse ${review.euroLeagueWinner} claimed the ultimate continental prize after a breathtaking playoff run, showcasing the absolute pinnacle of high-IQ half-court execution. They have solidified their place at the top of the European basketball hierarchy.`;
        
        const ecChampText = `Meanwhile, in the EuroCup, ${review.euroCupWinner} triumphed in spectacular fashion to earn promotion to Europe's elite tier for next season. On the flip side, ${review.relegated} suffers a bitter relegation down to the EuroCup after finishing at the bottom of the regular season standings.`;

        if (isUserPromoted || isUserECWinner) {
            return `Major headlines across Europe! While ${review.euroLeagueWinner} dominated the EuroLeague to lift the ultimate cup, all eyes are on ${userTeamName} in the EuroCup. By capturing the EuroCup crown, the team has officially secured promotion to the EuroLeague next season! The promotion brings a massive cash infusion of €5,000,000. Preparations for free agency must begin immediately to stand a chance against Europe's elite.`;
        }
        if (isUserRelegated) {
            return `Major shockwaves in Europe! While ${review.euroLeagueWinner} celebrated their EuroLeague championship, tragedy struck ${userTeamName} as they were relegated to the EuroCup. The drop triggers a parachute payment of €1,500,000, but a major drop in general sponsor interest is expected. The front office faces an uphill battle to keep the core roster intact for a swift return next season.`;
        }
        
        return `${elChampText} ${ecChampText}`;
    };

    // Helper to get stats of the season that just ended
    const getPlayerYearStats = (p: Player) => {
        const regStats = p.careerStats ? p.careerStats.filter(c => !c.isPlayoffs) : [];
        if (regStats.length > 0) {
            const sorted = [...regStats].sort((a, b) => b.season - a.season);
            return sorted[0];
        }
        return p.seasonStats;
    };

    const calculateEWAForPlayer = (p: Player) => {
        const stats = getPlayerYearStats(p);
        return calculateEWA({ ...p, seasonStats: stats });
    };

    // Signing of the Year Logic
    const getSigningOfTheYear = () => {
        // Filter players who had a transaction this season or were acquired this season
        // AND played at least 1 game in the season that just ended
        let candidates = players.filter(p => {
            const stats = getPlayerYearStats(p);
            const hasPlayed = stats && stats.gamesPlayed > 0;
            
            const wasTransacted = transactions.some(t => 
                t.playerId === p.id && 
                (t.type === 'signing' || t.type === 'trade' || t.type === 'transfer' || t.type === 'free_agent')
            );
            
            // Also accept if acquisition type is free_agent/trade/draft AND acquisition year matches date.getFullYear()
            const isAcquisitionThisSeason = p.acquisition && (
                p.acquisition.year === date.getFullYear() || 
                p.acquisition.year === date.getFullYear() - 1 // handle late offseason year boundary
            ) && (
                p.acquisition.type === 'free_agent' || 
                p.acquisition.type === 'trade' || 
                p.acquisition.type === 'draft'
            );
            
            const isOnTeam = p.teamId && p.teamId !== 'FA' && !p.isRetired;
            return hasPlayed && (wasTransacted || isAcquisitionThisSeason) && isOnTeam;
        });

        // Sort candidates by Estimated Wins Added (EWA) descending
        candidates.sort((a, b) => calculateEWAForPlayer(b) - calculateEWAForPlayer(a));

        let bestPlayer = candidates.length > 0 ? candidates[0] : null;

        // Failsafe 1: Look for any player who has careerStats/seasonStats games played > 0, sorted by EWA
        if (!bestPlayer) {
            let activeOnTeams = players.filter(p => p.teamId && p.teamId !== 'FA' && !p.isRetired);
            activeOnTeams.sort((a, b) => {
                const statsA = getPlayerYearStats(a);
                const statsB = getPlayerYearStats(b);
                if (statsA.gamesPlayed === 0 && statsB.gamesPlayed > 0) return 1;
                if (statsB.gamesPlayed === 0 && statsA.gamesPlayed > 0) return -1;
                return calculateEWAForPlayer(b) - calculateEWAForPlayer(a);
            });
            if (activeOnTeams.length > 0) {
                bestPlayer = activeOnTeams[0];
            }
        }

        let bestTransaction = null;
        if (bestPlayer) {
            const trans = transactions.find(t => t.playerId === bestPlayer.id && (t.type === 'signing' || t.type === 'trade' || t.type === 'transfer' || t.type === 'free_agent'));
            const pContract = contracts.find(c => c.playerId === bestPlayer.id);
            bestTransaction = {
                playerName: `${bestPlayer.firstName} ${bestPlayer.lastName}`,
                toTeamId: trans?.teamId || bestPlayer.teamId || '',
                amount: trans?.amount || (pContract ? pContract.amount : 1500000)
            };
        }

        return { player: bestPlayer, transaction: bestTransaction };
    };

    const { player: signingPlayer, transaction: signingTrans } = getSigningOfTheYear();
    const signingTeam = signingPlayer ? teams.find(t => t.id === signingPlayer.teamId) : null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(5, 5, 8, 0.95)', backdropFilter: 'blur(20px)',
            zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
            <div style={{
                width: '100%', maxWidth: '780px', background: '#ffffff',
                borderRadius: '24px', border: '8px solid #1c1c1e',
                boxShadow: '0 40px 120px rgba(0,0,0,0.85)', overflow: 'hidden',
                animation: 'newspaperSpin 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex', flexDirection: 'column', color: '#1c1c1e'
            }}>
                
                {/* Vintage Newspaper Masthead Banner */}
                <div style={{ 
                    padding: '24px 24px 16px 24px', 
                    borderBottom: '4px double #1c1c1e',
                    textAlign: 'center',
                    background: '#faf6eb' // Newspaper cream
                }}>
                    <div style={{ 
                        fontSize: '0.62rem', 
                        fontWeight: 900, 
                        letterSpacing: '2.5px', 
                        color: '#555555',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                    }}>
                        <span>★ ★ ★</span>
                        <span>EUROPEAN BASKETBALL CHRONICLE</span>
                        <span>★ ★ ★</span>
                    </div>
                    
                    <h1 style={{ 
                        fontFamily: "'Playfair Display', 'Georgia', serif", 
                        fontSize: '2.5rem', 
                        fontWeight: 900, 
                        margin: '8px 0',
                        letterSpacing: '-1.5px',
                        textTransform: 'uppercase',
                        lineHeight: 1.0,
                        color: '#000000'
                    }}>
                        THE GM HERALD
                    </h1>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        borderTop: '1px solid #1c1c1e', 
                        borderBottom: '1px solid #1c1c1e',
                        padding: '6px 0',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        color: '#444444',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '8px'
                    }}>
                        <span>VOLUME XLVI • NO. 12</span>
                        <span>OFFSEASON POST-FINALS REVIEW</span>
                        <span>€0.50 LIRA</span>
                    </div>
                </div>

                {/* Tab Navigation Menu (Bookmark Ribbon Tabs style) */}
                <div style={{ 
                    display: 'flex', 
                    background: '#141415', // Sleek book desk slate
                    padding: '0px 12px 6px 12px',
                    gap: '6px',
                    overflowX: 'auto',
                    borderBottom: '4px solid #1c1c1e',
                    position: 'relative',
                    zIndex: 20
                }}>
                    {[
                        { id: 'headline', label: 'Front Page', icon: <Newspaper size={13} />, color: '#8b0000' },
                        { id: 'champions', label: 'Champions', icon: <Trophy size={13} />, color: '#b58900' },
                        { id: 'movements', label: 'Movements', icon: <TrendingUp size={13} />, color: '#2a6f5e' },
                        { id: 'signing', label: 'Star Sign', icon: <Star size={13} />, color: '#5e2a6f' },
                        { id: 'financials', label: 'Finances', icon: <DollarSign size={13} />, color: '#2a4b6f' }
                    ].map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ActiveTab)}
                                style={{
                                    flex: 1,
                                    padding: active ? '10px 4px 18px 4px' : '10px 4px 14px 4px',
                                    border: 'none',
                                    // Pointy ribbon tail clip path
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 50% 100%, 0% calc(100% - 10px))',
                                    background: active ? tab.color : 'rgba(255, 255, 255, 0.08)',
                                    color: active ? '#ffffff' : '#d1cbba',
                                    fontWeight: 900,
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontFamily: "'Courier New', Courier, monospace",
                                    whiteSpace: 'nowrap',
                                    transform: active ? 'translateY(0px)' : 'translateY(-4px)',
                                    boxShadow: active ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
                                    zIndex: active ? 10 : 1,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                <span style={{ opacity: active ? 1 : 0.7 }}>{tab.icon}</span>
                                <span style={{ fontSize: '0.62rem', fontWeight: 900 }}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div style={{ 
                    padding: '24px', 
                    background: '#fcfaf2', // Rich cream paper feel
                    flex: 1, 
                    maxHeight: '62vh', 
                    overflowY: 'auto'
                }}>

                    {/* TAB 1: FRONT PAGE HEADLINE */}
                    {activeTab === 'headline' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                background: bannerColor,
                                color: '#ffffff',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.12, transform: 'rotate(15deg)' }}>
                                    <Newspaper size={180} />
                                </div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>
                                    EXTRA • BREAKING NEWS
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 10px 0', lineHeight: 1.1, fontFamily: "'Playfair Display', serif" }}>
                                    {headlineText}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.4 }}>
                                    {headlineSub}
                                </p>
                            </div>

                            {/* Two-Column Newspaper Article Layout */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                gap: '20px', 
                                marginTop: '8px',
                                borderTop: '1px solid #d1cbba',
                                paddingTop: '16px'
                            }}>
                                <div>
                                    <h3 style={{ 
                                        fontFamily: "'Playfair Display', serif", 
                                        fontSize: '1.1rem', 
                                        fontWeight: 900, 
                                        margin: '0 0 10px 0',
                                        textTransform: 'uppercase'
                                    }}>
                                        The Final Verdict
                                    </h3>
                                    <p style={{ 
                                        fontSize: '0.82rem', 
                                        lineHeight: 1.6, 
                                        color: '#333333', 
                                        textAlign: 'justify', 
                                        margin: 0,
                                        fontFamily: 'Georgia, serif'
                                    }}>
                                        {getArticleText()}
                                    </p>
                                </div>
                                
                                <div style={{ 
                                    borderLeft: '1px solid #d1cbba', 
                                    paddingLeft: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '16px',
                                    background: '#faf6eb',
                                    padding: '16px',
                                    borderRadius: '12px'
                                }}>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#888888', letterSpacing: '1px', textTransform: 'uppercase' }}>OFFICIAL STAMP</span>
                                    {findTeamLogo(review.promoted || review.euroCupWinner) ? (
                                        <img 
                                            src={findTeamLogo(review.promoted || review.euroCupWinner)} 
                                            alt="Promoted Logo" 
                                            style={{ width: '90px', height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>
                                            {review.promoted.charAt(0)}
                                        </div>
                                    )}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#27ae60', letterSpacing: '1px', textTransform: 'uppercase' }}>PROMOTED TO EUROLEAGUE</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>{review.promoted}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CHAMPIONS HUB (EuroLeague FIRST, then EuroCup) */}
                    {activeTab === 'champions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#f1c40f', background: 'rgba(241, 196, 15, 0.1)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>
                                    <Award size={14} /> HALL OF CHAMPIONS
                                </div>
                                <h3 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Continental Glory Claimed</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                
                                {/* EuroLeague Winner (FIRST) */}
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    border: '2px solid #f1c40f',
                                    boxShadow: '0 8px 30px rgba(241, 196, 15, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#f1c40f' }}>
                                        <Trophy size={20} />
                                    </div>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#f1c40f', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                        EuroLeague Champion
                                    </div>
                                    {findTeamLogo(review.euroLeagueWinner) ? (
                                        <img 
                                            src={findTeamLogo(review.euroLeagueWinner)} 
                                            alt={review.euroLeagueWinner} 
                                            style={{ width: '90px', height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(241, 196, 15, 0.2))' }}
                                        />
                                    ) : (
                                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#f1c40f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 900 }}>
                                            {review.euroLeagueWinner.charAt(0)}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', textTransform: 'uppercase' }}>
                                        {review.euroLeagueWinner}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600 }}>CROWNED KINGS OF THE CONTINENT</div>
                                </div>

                                {/* EuroCup Winner (SECOND) */}
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    border: '2px solid #3498db',
                                    boxShadow: '0 8px 30px rgba(52, 152, 219, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#3498db' }}>
                                        <Star size={20} />
                                    </div>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#3498db', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                        EuroCup Champion
                                    </div>
                                    {findTeamLogo(review.euroCupWinner) ? (
                                        <img 
                                            src={findTeamLogo(review.euroCupWinner)} 
                                            alt={review.euroCupWinner} 
                                            style={{ width: '90px', height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(52, 152, 219, 0.2))' }}
                                        />
                                    ) : (
                                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 900 }}>
                                            {review.euroCupWinner.charAt(0)}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', textTransform: 'uppercase' }}>
                                        {review.euroCupWinner}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600 }}>PROMOTED TO THE EUROLEAGUE</div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB 3: MOVEMENTS (PROMOTION & RELEGATION - EuroLeague first, then EuroCup) */}
                    {activeTab === 'movements' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e67e22', background: 'rgba(230, 126, 34, 0.1)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>
                                    <Zap size={14} /> LEAGUE MOVEMENTS
                                </div>
                                <h3 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Promotion & Relegation</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                
                                {/* Relegated (EuroLeague drop comes FIRST) */}
                                <div style={{
                                    background: 'rgba(231, 76, 60, 0.04)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: '1px solid rgba(231, 76, 60, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{ 
                                        width: '50px', height: '50px', borderRadius: '12px', 
                                        background: 'rgba(231, 76, 60, 0.1)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        color: '#e74c3c', flexShrink: 0
                                    }}>
                                        <TrendingDown size={24} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#c0392b', letterSpacing: '1px', textTransform: 'uppercase' }}>RELEGATED TO EUROCUP</div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1c1c1e' }}>
                                            {review.relegated}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#666666', marginTop: '2px' }}>EuroLeague 18th place drops.</div>
                                    </div>
                                    {findTeamLogo(review.relegated) && (
                                        <img src={findTeamLogo(review.relegated)} alt="" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                    )}
                                </div>

                                {/* Promoted (EuroCup climb comes SECOND) */}
                                <div style={{
                                    background: 'rgba(46, 204, 113, 0.04)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: '1px solid rgba(46, 204, 113, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{ 
                                        width: '50px', height: '50px', borderRadius: '12px', 
                                        background: 'rgba(46, 204, 113, 0.1)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        color: '#2ecc71', flexShrink: 0
                                    }}>
                                        <TrendingUp size={24} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#27ae60', letterSpacing: '1px', textTransform: 'uppercase' }}>PROMOTED TO EUROLEAGUE</div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1c1c1e' }}>
                                            {review.promoted}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#666666', marginTop: '2px' }}>EuroCup Champion gets the ticket.</div>
                                    </div>
                                    {findTeamLogo(review.promoted) && (
                                        <img src={findTeamLogo(review.promoted)} alt="" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB 4: SIGNING OF THE YEAR */}
                    {activeTab === 'signing' && (() => {
                        const stats = signingPlayer ? getPlayerYearStats(signingPlayer) : null;
                        const gp = stats?.gamesPlayed || 1;
                        const ppg = ((stats?.points || 0) / gp).toFixed(1);
                        const rpg = ((stats?.rebounds || 0) / gp).toFixed(1);
                        const apg = ((stats?.assists || 0) / gp).toFixed(1);
                        const spg = ((stats?.steals || 0) / gp).toFixed(1);
                        const bpg = ((stats?.blocks || 0) / gp).toFixed(1);
                        const ewa = signingPlayer ? calculateEWAForPlayer(signingPlayer).toFixed(1) : '0.0';

                        const signingTeamId = signingTrans?.toTeamId || signingPlayer?.teamId;
                        const signingTeam = signingTeamId ? teams.find(t => t.id === signingTeamId) : null;
                        const signingTeamName = signingTeam ? signingTeam.name : 'their new club';

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8b0000', background: 'rgba(139, 0, 0, 0.08)', padding: '6px 16px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px', border: '1px solid #8b0000' }}>
                                        ★ THE DAILY LEDGER SPORTS SPECIAL ★
                                    </div>
                                    <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", textTransform: 'uppercase', color: '#000000' }}>
                                        BLOCKBUSTER SIGNS DOMINATE POST-SEASON TALK
                                    </h3>
                                </div>

                                {signingPlayer ? (
                                    <div style={{
                                        background: '#faf6eb', // Classic aged newspaper yellow/cream
                                        border: '4px double #1c1c1e',
                                        padding: '24px',
                                        boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '20px',
                                        position: 'relative'
                                    }}>
                                        
                                        {/* Vintage Dotted Stamp Header */}
                                        <div style={{
                                            borderBottom: '1px dashed #1c1c1e',
                                            paddingBottom: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.65rem',
                                            fontWeight: 900,
                                            fontFamily: 'Courier New, Courier, monospace',
                                            color: '#555555'
                                        }}>
                                            <span>PRESS WIRE: EXCLUSIVE REPORT</span>
                                            <span>DATELINE: SUMMER OFF-SEASON</span>
                                        </div>

                                        {/* Real Newspaper Floating Page Content */}
                                        <div style={{ width: '100%' }}>
                                            
                                            {/* FLOATING PHOTO: Tall Slim Retro Black & White Photo (Left) */}
                                            <div style={{
                                                width: '130px',
                                                float: 'left',
                                                marginRight: '20px',
                                                marginBottom: '14px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}>
                                                <div style={{
                                                    width: '130px',
                                                    height: '312px',
                                                    boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <VintagePlayerSilhouette />
                                                </div>
                                                <div style={{
                                                    fontSize: '0.58rem',
                                                    fontStyle: 'italic',
                                                    color: '#555555',
                                                    fontFamily: 'Georgia, serif',
                                                    textAlign: 'center',
                                                    lineHeight: '1.2',
                                                    padding: '2px'
                                                }}>
                                                    Figure 1. {signingPlayer.lastName} captured in post-season hardwood workouts.
                                                </div>
                                            </div>

                                            {/* ARTICLE HEADER & TEXT (Flows next to and wraps around the floated photo) */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, fontFamily: "'Playfair Display', Georgia, serif", textTransform: 'uppercase', letterSpacing: '-0.5px', color: '#000000', lineHeight: 1.15 }}>
                                                    {signingPlayer.firstName} {signingPlayer.lastName}
                                                </h4>
                                                <span style={{ 
                                                    border: '2px solid #1c1c1e', color: '#1c1c1e', background: '#ffffff',
                                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900,
                                                    fontFamily: 'Courier New, monospace', boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                                                }}>
                                                    {calculateOverall(signingPlayer)} OVR
                                                </span>
                                            </div>
                                            
                                            <div style={{ fontSize: '0.75rem', color: '#444444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                                POSITION: {signingPlayer.position} • AGE {signingPlayer.age}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                                {signingTeam?.logo && (
                                                    <img src={signingTeam.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                                )}
                                                <span style={{ fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', color: '#8b0000', letterSpacing: '0.5px' }}>
                                                    SIGNED BY {signingTeamName.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* News Story (Drop Cap) */}
                                            <p style={{ 
                                                fontSize: '0.85rem', 
                                                lineHeight: 1.55, 
                                                color: '#222222', 
                                                textAlign: 'justify', 
                                                margin: '0 0 16px 0',
                                                fontFamily: 'Georgia, serif'
                                            }}>
                                                <span style={{
                                                    float: 'left',
                                                    fontSize: '3.1rem',
                                                    fontWeight: 900,
                                                    fontFamily: "'Playfair Display', Georgia, serif",
                                                    lineHeight: '0.8',
                                                    paddingRight: '8px',
                                                    paddingTop: '3px',
                                                    color: '#000000'
                                                }}>{signingPlayer.firstName[0]}</span>
                                                n spectacular roster moves that stunned commentators, the acquisition of {signingPlayer.firstName} {signingPlayer.lastName} by {signingTeamName} completely redefined the competitive landscape. Front office strategists described the blockbuster deal as absolute gold standard, cementing elite scoring and veteran composure. Fan interest has reached record numbers following the ink drying on this monumental campaign signing.
                                            </p>

                                            {/* Clear floats so that the box score renders correctly below the floated elements */}
                                            <div style={{ clear: 'both' }}></div>

                                            {/* Official Dotted Box Score */}
                                            <div style={{
                                                fontFamily: "'Courier New', Courier, monospace",
                                                fontSize: '0.82rem',
                                                fontWeight: 'bold',
                                                lineHeight: '1.65',
                                                color: '#1c1c1e',
                                                border: '2px solid #1c1c1e',
                                                padding: '16px',
                                                background: '#fcfaf2',
                                                boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                marginTop: '10px'
                                            }}>
                                                <div style={{ textAlign: 'center', borderBottom: '1px dashed #1c1c1e', paddingBottom: '6px', marginBottom: '8px', fontWeight: 900, fontSize: '0.9rem' }}>
                                                    ★ OFFICIAL RECORD SHEET ★
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>GAMES PLAYED</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{gp} GP</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>POINTS/GM</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{ppg} PPG</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>REBOUNDS/GM</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{rpg} RPG</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>ASSISTS/GM</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{apg} APG</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>STEALS/GM</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{spg} SPG</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
                                                    <span style={{ flexShrink: 0 }}>BLOCKS/GM</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #1c1c1e', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{bpg} BPG</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', borderTop: '2px dashed #1c1c1e', paddingTop: '8px', marginTop: '8px', fontWeight: 900, color: '#8b0000', fontSize: '0.85rem' }}>
                                                    <span style={{ flexShrink: 0 }}>EST. WINS ADDED (EWA)</span>
                                                    <div style={{ flexGrow: 1, borderBottom: '1px dotted #8b0000', margin: '0 4px' }}></div>
                                                    <span style={{ flexShrink: 0 }}>{ewa} WINS</span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Ledger Footer */}
                                        <div style={{
                                            borderTop: '1px dashed #1c1c1e',
                                            paddingTop: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            fontFamily: 'Courier New, Courier, monospace',
                                            color: '#444444'
                                        }}>
                                            <span>SALARY VALUE: €{(contracts.find(c => c.playerId === signingPlayer.id)?.amount || 1200000).toLocaleString()} / YR</span>
                                            <span style={{ fontWeight: 900, color: '#8b0000' }}>★ THE DAILY LEDGER FRANCHISE IMPACT AWARD ★</span>
                                        </div>

                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#888888', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                                        No blockbuster signings logged for this chronicle edition.
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* TAB 5: FINANCIALS & BUDGET SHIFTS */}
                    {activeTab === 'financials' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>
                                    <DollarSign size={14} /> FINANCIAL IMPACT REPORT
                                </div>
                                <h3 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Offseason Budget Adjustments</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                {/* Promotion Budget Statement */}
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: '1px solid #d1cbba',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#27ae60', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            🚀 PROMOTION FINANCIAL PACKAGE
                                        </span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#27ae60', background: 'rgba(46, 204, 113, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                                            +€5,000,000
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#555555', lineHeight: 1.4, margin: 0 }}>
                                        The team that earns promotion to the **EuroLeague** receives a major financial infusion from TV rights and elite sponsorships. Merchandising and ticket prices will automatically scale up by **+25%**, providing massive offseason power to sign superstars!
                                    </div>
                                </div>

                                {/* Relegation Budget Statement */}
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: '1px solid #d1cbba',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#e74c3c', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            🛡️ RELEGATION PARACHUTE PAYMENT
                                        </span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#e67e22', background: 'rgba(230, 126, 34, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                                            +€1,500,000
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#555555', lineHeight: 1.4, margin: 0 }}>
                                        To protect clubs dropping to the **EuroCup**, the board grants a **€1.5M Relegation Parachute**. However, general ticket prices and fan interest will contract by **-20%**, forcing the GM to manage salary sheets carefully to avoid cash depletion.
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

                {/* Continue button at bottom */}
                <div style={{ 
                    padding: '20px', 
                    background: '#1c1c1e', 
                    borderTop: '4px double #ffffff',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%', 
                            padding: '16px', 
                            borderRadius: '12px',
                            background: '#ffffff', 
                            color: '#1c1c1e', 
                            border: 'none',
                            fontWeight: 900, 
                            fontSize: '0.95rem', 
                            cursor: 'pointer',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px',
                            transition: 'all 0.2s',
                            fontFamily: "'SF Pro Display', sans-serif",
                            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.025)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.1)';
                        }}
                    >
                        <CheckCircle2 size={18} />
                        CONTINUE TO OFFSEASON
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes newspaperSpin {
                    from { 
                        opacity: 0; 
                        transform: scale(0.35) rotate(-35deg); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) rotate(0deg); 
                    }
                }
            `}</style>
        </div>
    );
};
