import React from 'react';
import { useGame } from '../../store/GameContext';
import { Trophy, ChevronRight, Star } from 'lucide-react';
import { calculateOverall } from '../../utils/playerUtils';

interface RetiredPlayersSummaryViewProps {
    onSelectPlayer?: (id: string) => void;
}

export const RetiredPlayersSummaryView: React.FC<RetiredPlayersSummaryViewProps> = ({ onSelectPlayer }) => {
    const { retiredPlayersHistory, continueFromRetirements, date, teams } = useGame();

    // Get latest year
    const currentYear = date.getFullYear();
    const latestRetirements = retiredPlayersHistory.find((h: any) => h.year === currentYear);
    const retiredList = latestRetirements ? [...latestRetirements.players] : [];

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '900px', 
            margin: '0 auto', 
            color: 'var(--text-main)',
            minHeight: '100vh',
            background: 'radial-gradient(circle at top, rgba(var(--team-primary-rgb), 0.15) 0%, transparent 70%)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: 900, 
                    marginBottom: '10px',
                    letterSpacing: '-2px',
                    background: 'linear-gradient(to bottom, #fff, #888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Retirement Ceremony
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Class of {currentYear}
                </p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '20px' 
            }}>
                {retiredList.length === 0 ? (
                    <div style={{ 
                        gridColumn: '1 / -1',
                        textAlign: 'center', 
                        padding: '60px', 
                        background: 'var(--bg-card)', 
                        borderRadius: '24px',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-dim)'
                    }}>
                        No notable retirements this year.
                    </div>
                ) : (
                    retiredList.map((p: any) => {
                        const ovr = calculateOverall(p);
                        const isHoF = p.isHallOfFame;
                        
                        return (
                            <div key={p.id}
                                onClick={() => onSelectPlayer && onSelectPlayer(p.id)}
                                className="retired-player-card"
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '24px',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: isHoF ? '2px solid #ffd700' : '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: isHoF ? '0 0 20px rgba(255, 215, 0, 0.15)' : 'var(--shadow-md)'
                                }}>
                                
                                {isHoF && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: '#ffd700'
                                    }}>
                                        <Trophy size={20} fill="#ffd700" />
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '60px', 
                                        height: '60px', 
                                        borderRadius: '18px', 
                                        background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontWeight: 900,
                                        fontSize: '1.2rem',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--team-primary)'
                                    }}>
                                        {p.position}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                                            {p.firstName} {p.lastName}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                color: 'var(--text-dim)',
                                                background: 'var(--bg-card-hover)',
                                                padding: '2px 8px',
                                                borderRadius: '6px'
                                            }}>
                                                Age {p.ageAtRetirement}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                • {ovr} OVR
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ color: 'var(--text-dim)', opacity: 0.5 }}>
                                    <ChevronRight size={24} />
                                </div>

                                <style>{`
                                    .retired-player-card:hover {
                                        transform: translateY(-5px);
                                        background: var(--bg-card-hover) !important;
                                        border-color: var(--team-primary) !important;
                                        box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                                    }
                                    .retired-player-card:active {
                                        transform: scale(0.98);
                                    }
                                `}</style>
                            </div>
                        );
                    })
                )}
            </div>

            <div style={{ 
                marginTop: '60px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                <button
                    onClick={continueFromRetirements}
                    className="btn-primary"
                    style={{ 
                        padding: '18px 60px', 
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        boxShadow: '0 10px 30px var(--primary-glow)'
                    }}
                >
                    Finish Ceremony &rarr;
                </button>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Press any player to view their career stats & records
                </p>
            </div>
        </div>
    );
};
