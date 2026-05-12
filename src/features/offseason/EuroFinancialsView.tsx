
import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Ticket, ShoppingBag, DollarSign, ArrowLeft, Zap, Info, ChevronRight, Check } from 'lucide-react';

export const EuroFinancialsView: React.FC = () => {
    const { teams, userTeamId, games, setGameState, completeOffseasonTask, setView } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    // Calculate Hype based on last season
    const hype = useMemo(() => {
        if (!userTeam) return 0.5;
        
        // Simpler calculation: wins + playoff depth
        const wins = userTeam.wins || 0;
        const totalGames = 38; // EuroLeague regular season
        const winRatio = wins / totalGames;
        
        // Check playoff success from team history or awards (simplified here)
        // If they have many wins, they probably did well
        let playoffBonus = 0;
        if (wins > 25) playoffBonus = 0.3;
        else if (wins > 20) playoffBonus = 0.15;
        
        return Math.min(1.0, 0.2 + winRatio + playoffBonus);
    }, [userTeam]);

    const [ticketPrice, setTicketPrice] = useState(25);
    const [seasonTicketPrice, setSeasonTicketPrice] = useState(400);
    const [merchPriceMultiplier, setMerchPriceMultiplier] = useState(1.0);
    const [isSold, setIsSold] = useState(false);

    const totalCapacity = 15000; // Average Euro stadium
    const maxSeasonTicketRatio = 0.7;
    // DYNAMIC CALCULATION: Price affects sales
    const baseSeasonTickets = totalCapacity * maxSeasonTicketRatio * (hype ** 0.5);
    // Price elasticity: 400 is the "fair" price. Above 400 sales drop, below they rise.
    const seasonPriceElasticity = 1.0 - ((seasonTicketPrice - 400) / 1200);
    const seasonTicketsSold = Math.round(baseSeasonTickets * Math.max(0.1, seasonPriceElasticity));
    
    // Single Game Logic: 25 is fair.
    const singleGameCapacity = totalCapacity * (1 - maxSeasonTicketRatio);
    const singlePriceElasticity = 1.0 - ((ticketPrice - 25) / 150);
    const expectedAttendance = Math.round(singleGameCapacity * (hype ** 0.7) * Math.max(0.2, singlePriceElasticity));

    // Merch Logic: higher markup = lower volume, but current formula is simple revenue
    // Let's refine it: Base merch interest is 500k. 
    // Markup: 1x is base. 1.5x increases revenue per item but drops volume by 20%
    const merchVolumeElasticity = 1.0 - ((merchPriceMultiplier - 1.0) * 0.5);
    const merchRevenue = Math.round(500000 * (hype ** 1.2) * merchPriceMultiplier * Math.max(0.5, merchVolumeElasticity));

    // Revenue Calculation
    const seasonTicketRevenue = seasonTicketsSold * seasonTicketPrice;
    const singleGameSeasonRevenue = expectedAttendance * ticketPrice * 19; // 19 home games in EuroLeague

    const handleSale = () => {
        if (userTeam) {
            const totalCashInjection = seasonTicketRevenue + merchRevenue;
            
            setGameState(prev => ({
                ...prev,
                teams: prev.teams.map(t => 
                    t.id === userTeamId 
                    ? { ...t, cash: t.cash + totalCashInjection } 
                    : t
                )
            }));
            
            setIsSold(true);
        }
    };

    const handleContinue = () => {
        completeOffseasonTask('financials');
    };

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            color: 'var(--text-main)',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--bg-body) 0%, rgba(var(--team-primary-rgb), 0.05) 100%)'
        }}>
            {/* Standardized Header Design */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: '#1a2a3a', letterSpacing: '-2px', lineHeight: 1.1 }}>
                    TICKETS<br/>& REVENUE
                </h1>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8898a8', margin: '16px 0 32px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    EURO DAY 3 • REVENUE PLANNING
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                    {/* Budget Section */}
                    <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '28px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8898a8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>CURRENT CASH</div>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#2ecc71', lineHeight: 1.1 }}>€{((userTeam?.cash || 0) / 1000000).toFixed(1)}M</div>
                    </div>
                    
                    {/* Finish Action */}
                    <button 
                        onClick={handleContinue}
                        disabled={!isSold}
                        style={{ 
                            background: isSold ? '#004a99' : '#8898a8', color: '#fff', border: 'none', borderRadius: '28px', 
                            fontSize: '1.4rem', fontWeight: 900, cursor: isSold ? 'pointer' : 'not-allowed', textTransform: 'uppercase',
                            boxShadow: isSold ? '0 12px 35px rgba(0, 74, 153, 0.3)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'
                        }}
                    >
                        FINISH
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Enhanced Hype Meter */}
                <div style={{ background: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #eef2f6', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: `${hype * 100}%`, height: '100%', background: 'linear-gradient(90deg, rgba(var(--team-primary-rgb), 0.05), rgba(var(--team-primary-rgb), 0.15))', zIndex: 0 }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--team-primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Franchise Hype</div>
                                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#1a2a3a', lineHeight: 1 }}>{Math.round(hype * 100)}%</div>
                            </div>
                            <div style={{ textAlign: 'right', paddingBottom: '8px' }}>
                                <div style={{ fontSize: '1.2rem', color: '#1a2a3a', fontWeight: 900 }}>{hype > 0.8 ? 'ELITE' : hype > 0.6 ? 'HIGH' : 'STABLE'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#8898a8', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Marketability Rank</div>
                            </div>
                        </div>
                        
                        {/* Visible Progress Bar */}
                        <div style={{ width: '100%', height: '12px', background: '#f0f4f8', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${hype * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: '100%', background: 'var(--team-primary)', borderRadius: '6px' }}
                            />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8898a8', textTransform: 'uppercase', marginTop: '12px', fontWeight: 800, letterSpacing: '1px' }}>
                            Performance Factor: Based on last season's {userTeam?.wins} wins
                        </div>
                    </div>
                </div>

                {/* Inputs Stacked Vertically */}
                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Ticket size={24} color="var(--team-primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>Single Game Tickets</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>€{ticketPrice}</div>
                    </div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px', fontWeight: 800 }}>AVERAGE PRICE (€)</label>
                    <input 
                        type="range" min="10" max="150" step="5" 
                        value={ticketPrice} 
                        onChange={(e) => setTicketPrice(Number(e.target.value))}
                        style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#8898a8', fontWeight: 600 }}>
                        * Expected attendance: <b style={{ color: 'var(--text-main)' }}>{expectedAttendance} fans</b> per game.
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Zap size={24} color="#f1c40f" />
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>Season Pass</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>€{seasonTicketPrice}</div>
                    </div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px', fontWeight: 800 }}>SEASON PASS PRICE (€)</label>
                    <input 
                        type="range" min="200" max="1500" step="50" 
                        value={seasonTicketPrice} 
                        onChange={(e) => setSeasonTicketPrice(Number(e.target.value))}
                        style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#8898a8', fontWeight: 600 }}>
                        * Expected sales: <b style={{ color: 'var(--text-main)' }}>{seasonTicketsSold} passes</b> based on current hype.
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <ShoppingBag size={24} color="#e67e22" />
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>Merchandise Markup</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[0.8, 1.0, 1.2, 1.5].map(m => (
                            <button 
                                key={m}
                                onClick={() => setMerchPriceMultiplier(m)}
                                style={{
                                    flex: 1, padding: '16px', borderRadius: '16px',
                                    border: merchPriceMultiplier === m ? '2px solid var(--team-primary)' : '1px solid var(--border-color)',
                                    background: merchPriceMultiplier === m ? 'rgba(var(--team-primary-rgb), 0.1)' : 'transparent',
                                    color: merchPriceMultiplier === m ? 'var(--team-primary)' : 'var(--text-dim)',
                                    fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {m}x
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#8898a8', fontWeight: 600 }}>
                        * Projected seasonal impact: <b style={{ color: '#2ecc71' }}>+€{(merchRevenue / 1000000).toFixed(2)}M</b> revenue.
                    </div>
                </div>

                {/* Revenue Summary Section */}
                <div style={{ background: 'linear-gradient(135deg, #1a2a3a 0%, #0a1a2a 100%)', padding: '40px', borderRadius: '32px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: '0 0 32px 0', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue Estimate</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '1.1rem' }}>Season Passes</span>
                            <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>€{(seasonTicketRevenue / 1000000).toFixed(2)}M</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '1.1rem' }}>Merch Profits</span>
                            <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>€{(merchRevenue / 1000000).toFixed(2)}M</span>
                        </div>
                        <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px' }}>TOTAL INJECTION</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2ecc71' }}>€{((seasonTicketRevenue + merchRevenue) / 1000000).toFixed(2)}M</span>
                        </div>
                    </div>

                    {!isSold ? (
                        <button 
                            onClick={handleSale}
                            style={{ width: '100%', marginTop: '40px', padding: '24px', borderRadius: '24px', background: '#2ecc71', color: '#fff', border: 'none', fontWeight: 900, fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', textTransform: 'uppercase' }}
                        >
                            <DollarSign size={24} /> Start Ticket Sales
                        </button>
                    ) : (
                        <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.1)', color: '#2ecc71', padding: '24px', borderRadius: '24px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <Check size={24} /> SALES COMPLETED
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '40px', background: 'rgba(52, 152, 219, 0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(52, 152, 219, 0.2)', display: 'flex', gap: '16px' }}>
                <Info size={24} color="#3498db" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                    <b>Management Tip:</b> Your seasonal ticket sales are directly linked to your <b>Hype Meter</b>. A higher hype allows for more expensive season passes without losing customers. If your hype is low, consider keeping prices competitive to ensure a stable cash flow.
                </p>
            </div>
        </div>
    );
};
