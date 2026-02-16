import React, { useEffect, useState, useRef } from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { LiveGameEngine } from './LiveGameEngine';
import type { LiveGameState } from './LiveGameEngine';
import { Play, Pause, FastForward, User, ArrowLeftRight, Clock, ArrowLeft } from 'lucide-react';

interface LiveGameViewProps {
    homeTeam: Team;
    awayTeam: Team;
    homeRoster: Player[];
    awayRoster: Player[];
    onGameEnd: (result: any) => void;
    userTeamId: string;
    date: Date;
}

export const LiveGameView: React.FC<LiveGameViewProps> = ({ homeTeam, awayTeam, homeRoster, awayRoster, onGameEnd, userTeamId, date }) => {

    // Engine Instance
    const engineRef = useRef<LiveGameEngine | null>(null);
    const [gameState, setGameState] = useState<LiveGameState | null>(null);
    const [showSubs, setShowSubs] = useState<'HOME' | 'AWAY' | null>(null);
    const [selectedBench, setSelectedBench] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'points', direction: 'desc' });
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isExitingAfterSim, setIsExitingAfterSim] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [gameState?.events.length]);

    useEffect(() => {
        if (isExitingAfterSim && gameState?.isFinished) {
            onGameEnd(engineRef.current?.getResults());
        }
    }, [isExitingAfterSim, gameState?.isFinished, onGameEnd]);

    const handleBack = () => {
        if (gameState?.isFinished) {
            onGameEnd(engineRef.current?.getResults());
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleSimAndExit = () => {
        if (engineRef.current) {
            setIsExitingAfterSim(true);
            engineRef.current.simulateRestOfGame();
        }
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const getSortedRoster = (roster: Player[], teamId: string) => {
        if (!gameState) return roster;
        return [...roster].sort((a, b) => {
            const statsA = teamId === homeTeam.id ? gameState.boxScore.homeStats[a.id] : gameState.boxScore.awayStats[a.id];
            const statsB = teamId === homeTeam.id ? gameState.boxScore.homeStats[b.id] : gameState.boxScore.awayStats[b.id];

            if (!statsA || !statsB) return 0;

            let valA: number = 0;
            let valB: number = 0;

            switch (sortConfig.key) {
                case 'minutes': valA = statsA.minutes; valB = statsB.minutes; break;
                case 'points': valA = statsA.points; valB = statsB.points; break;
                case 'rebounds': valA = statsA.rebounds; valB = statsB.rebounds; break;
                case 'assists': valA = statsA.assists; valB = statsB.assists; break;
                case 'steals': valA = statsA.steals; valB = statsB.steals; break;
                case 'blocks': valA = statsA.blocks; valB = statsB.blocks; break;
                case 'turnovers': valA = statsA.turnovers; valB = statsB.turnovers; break;
                case 'fg': valA = statsA.fgMade; valB = statsB.fgMade; break; // Sort by makes
                case '3pt': valA = statsA.threeMade; valB = statsB.threeMade; break;
                case 'ft': valA = statsA.ftMade; valB = statsB.ftMade; break;
                default: return 0;
            }

            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        });
    };

    const handleTimeout = () => {
        if (engineRef.current) {
            engineRef.current.callTimeout(userTeamId);
        }
    };

    // Initialize Engine
    useEffect(() => {
        engineRef.current = new LiveGameEngine(homeTeam, awayTeam, homeRoster, awayRoster, date, userTeamId);
        const unsubscribe = engineRef.current.subscribe(setGameState);
        return () => { unsubscribe(); };
    }, []);

    // Game Loop
    useEffect(() => {
        let timeoutId: any;

        const loop = () => {
            if (engineRef.current) {
                engineRef.current.tick();
            }
            const speed = engineRef.current?.state.gameSpeed || 1;
            // Base tick is 1000ms.
            // Speed 1x = 1000ms
            // Speed 4x = 250ms
            // Speed 16x = 62.5ms
            timeoutId = setTimeout(loop, 1000 / speed);
        };

        loop();

        return () => clearTimeout(timeoutId);
    }, []);

    if (!gameState) return <div>Loading Arena...</div>;

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Helper for strategies in modal
    const StrategyControl = ({ playerId, type }: { playerId: string, type: 'offense' | 'defense' }) => {
        const strat = engineRef.current?.state.playerStrategies?.[playerId];
        const current = type === 'offense' ? strat?.offense : strat?.defense;

        const cycles = ['LOW', 'NORMAL', 'MAX'];
        const colors: any = { LOW: '#f1c40f', NORMAL: '#3498db', MAX: '#e74c3c' };

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
                <span style={{ minWidth: '25px', color: 'var(--text-secondary)' }}>{type === 'offense' ? 'OFF' : 'DEF'}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const idx = cycles.indexOf(current || 'NORMAL');
                        const next = cycles[(idx + 1) % 3];
                        engineRef.current?.updatePlayerStrategy(playerId, type, next as any);
                    }}
                    style={{
                        background: colors[current || 'NORMAL'],
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        minWidth: '55px'
                    }}
                >
                    {current || 'NORMAL'}
                </button>
            </div>
        );
    };

    const handleSub = (teamId: string, inId: string, outId: string) => {
        if (engineRef.current) {
            engineRef.current.substitute(teamId, inId, outId);
            setShowSubs(null);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text)' }}>

            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <button
                    onClick={handleBack}
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Live Game • {homeTeam.abbreviation} vs {awayTeam.abbreviation}
                </div>
            </div>

            {/* Scoreboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '15px 10px', borderRadius: '12px', marginBottom: '20px', borderBottom: '4px solid var(--primary)', gap: '10px' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                        {gameState.homeTeam.logo && <img src={gameState.homeTeam.logo} alt="" style={{ width: 'clamp(20px, 8vw, 40px)', height: 'clamp(20px, 8vw, 40px)', objectFit: 'contain' }} />}
                        <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 5vw, 2rem)' }}>{gameState.homeTeam.abbreviation}</h2>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 8vw, 3rem)', fontWeight: 'bold' }}>{gameState.homeScore}</div>
                    <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.9rem)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        F: {gameState.homeFouls} • T: {gameState.homeTimeouts}
                    </div>
                </div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 'clamp(0.9rem, 4vw, 1.5rem)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        Q{gameState.quarter} - {formatTime(gameState.timeRemaining - (4 - gameState.quarter) * 720)}
                    </div>
                    <div style={{ fontSize: 'clamp(0.7rem, 3vw, 1.2rem)', color: 'var(--accent)', marginTop: '5px' }}>
                        SC: <span style={{ fontWeight: 'bold' }}>{Number(gameState.shotClock).toFixed(1)}</span>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        {gameState.isPaused ?
                            <button onClick={() => { console.log('Resume Clicked'); engineRef.current?.togglePause(); }} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Play size={16} /> {gameState.timeRemaining === (4 - (gameState.quarter - 1)) * 720 && gameState.quarter > 1 ? (gameState.quarter === 3 ? 'Start Halftime' : 'Resume Quarter') : 'Resume'}</button> :
                            <button onClick={() => engineRef.current?.togglePause()} style={{ background: '#f1c40f', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Pause size={16} /> Pause</button>
                        }
                    </div>

                    <div style={{ marginTop: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        {[1, 4, 16].map(s => (
                            <button
                                key={s}
                                onClick={() => {
                                    if (engineRef.current) {
                                        engineRef.current.setGameSpeed(s);
                                    }
                                }}
                                style={{
                                    background: gameState.gameSpeed === s ? 'var(--primary)' : 'var(--surface-light)',
                                    color: gameState.gameSpeed === s ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                x{s}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                            onClick={() => engineRef.current?.simulateRestOfGame()}
                            style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            title="Simulate to End"
                        >
                            <FastForward size={16} /> Sim End
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                        {gameState.awayTeam.logo && <img src={gameState.awayTeam.logo} alt="" style={{ width: 'clamp(20px, 8vw, 40px)', height: 'clamp(20px, 8vw, 40px)', objectFit: 'contain' }} />}
                        <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 5vw, 2rem)' }}>{gameState.awayTeam.abbreviation}</h2>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 8vw, 3rem)', fontWeight: 'bold' }}>{gameState.awayScore}</div>
                    <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.9rem)', color: 'var(--text-secondary)' }}>F: {gameState.awayFouls}</div>
                </div>
            </div>

            {/* Event Log (Full Width) */}
            <div style={{ marginBottom: '20px', background: '#C0C0C0', borderRadius: '12px', padding: '15px', height: '250px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #999', paddingBottom: '5px', color: '#000' }}>Play-by-Play</h3>
                <div
                    ref={logRef}
                    style={{ flex: 1, overflowY: 'auto', scrollBehavior: 'smooth' }}
                >
                    {gameState.events.map((e, i) => {
                        const homeColor = gameState.homeTeam.colors?.primary || '#3498db';
                        const awayColor = gameState.awayTeam.colors?.primary || '#e74c3c';

                        const isHome = e.teamId === gameState.homeTeam.id;
                        const isAway = e.teamId === gameState.awayTeam.id;

                        let entryColor = 'var(--text)';
                        if (isHome) entryColor = homeColor;
                        if (isAway) entryColor = awayColor;

                        const eventQtr = Math.ceil((2880 - e.gameTime) / 720) || 1;
                        const qOffset = (4 - eventQtr) * 720;
                        const displayTime = e.gameTime - qOffset;

                        return (
                            <div key={i} style={{ marginBottom: '8px', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: 'monospace', minWidth: '45px', color: '#555' }}>
                                    {formatTime(displayTime)}
                                </span>
                                {/* Team Indicator */}
                                <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                                    {isHome && (gameState.homeTeam.logo ?
                                        <img src={gameState.homeTeam.logo} style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> :
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: homeColor }} />
                                    )}
                                    {isAway && (gameState.awayTeam.logo ?
                                        <img src={gameState.awayTeam.logo} style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> :
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: awayColor }} />
                                    )}
                                    {!isHome && !isAway && <div style={{ width: '6px', height: '6px', background: '#555', borderRadius: '50%' }} />}
                                </div>
                                <span style={{ color: entryColor, fontWeight: isHome || isAway ? '600' : 'normal', flex: 1 }}>
                                    {e.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current 5 Rosters (Side by Side / Stacked on Mobile) */}
            <div className="responsive-grid">

                {/* Home Lineup Box */}
                <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '350px', borderTop: `4px solid ${gameState.homeTeam.colors?.primary || '#ccc'}` }}>
                    {/* Watermark Logo */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
                        {gameState.homeTeam.logo ? (
                            <img src={gameState.homeTeam.logo} alt="" style={{ width: '280px', height: '280px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: gameState.homeTeam.colors?.primary || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '5rem', fontWeight: 'bold' }}>
                                {gameState.homeTeam.abbreviation}
                            </div>
                        )}
                    </div>

                    {/* Header & Controls */}
                    <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                            {gameState.homeTeam.logo && <img src={gameState.homeTeam.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
                            <h3 style={{ margin: 0 }}>{gameState.homeTeam.name}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {userTeamId === gameState.homeTeam.id && (
                                <>
                                    <button
                                        onClick={() => setShowSubs('HOME')}
                                        style={{
                                            fontSize: '0.8rem',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            flex: 1
                                        }}
                                    >
                                        Subs & Strategy
                                    </button>
                                    <button
                                        onClick={handleTimeout}
                                        disabled={gameState.isPaused || gameState.homeTimeouts === 0}
                                        style={{
                                            fontSize: '0.8rem',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            background: 'var(--accent)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            flex: 1,
                                            opacity: (gameState.isPaused || gameState.homeTimeouts === 0) ? 0.5 : 1,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Clock size={14} /> Timeout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Player List */}
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                        <div style={{ display: 'flex', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '5px', padding: '0 5px' }}>
                            <span style={{ flex: 1 }}>PLAYER</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>PTS</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>REB</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>AST</span>
                        </div>
                        {gameState.homeLineup.map(p => {
                            const stats = gameState.boxScore.homeStats[p.id] || {};
                            const fatigue = p.fatigue !== undefined ? p.fatigue : 100;
                            const fatigueColor = fatigue > 80 ? '#2ecc71' : fatigue > 60 ? '#f1c40f' : '#e74c3c';

                            return (
                                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', padding: '8px 5px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ flex: 1, fontWeight: 'bold' }}>{p.lastName} <small style={{ fontWeight: 'normal', color: '#aaa' }}>{p.position}</small></span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.points || 0}</span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.rebounds || 0}</span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.assists || 0}</span>
                                    </div>
                                    {/* Stamina Bar */}
                                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', marginTop: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${fatigue}%`, height: '100%', background: fatigueColor, transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Away Lineup Box */}
                <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '350px', borderTop: `4px solid ${gameState.awayTeam.colors?.primary || '#ccc'}` }}>
                    {/* Watermark Logo */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
                        {gameState.awayTeam.logo ? (
                            <img src={gameState.awayTeam.logo} alt="" style={{ width: '280px', height: '280px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: gameState.awayTeam.colors?.primary || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '5rem', fontWeight: 'bold' }}>
                                {gameState.awayTeam.abbreviation}
                            </div>
                        )}
                    </div>

                    {/* Header & Controls */}
                    <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                            {gameState.awayTeam.logo && <img src={gameState.awayTeam.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
                            <h3 style={{ margin: 0 }}>{gameState.awayTeam.name}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {userTeamId === gameState.awayTeam.id && (
                                <>
                                    <button
                                        onClick={() => setShowSubs('AWAY')}
                                        style={{
                                            fontSize: '0.8rem',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            flex: 1
                                        }}
                                    >
                                        Subs & Strategy
                                    </button>
                                    <button
                                        onClick={handleTimeout}
                                        disabled={gameState.isPaused || gameState.awayTimeouts === 0}
                                        style={{
                                            fontSize: '0.8rem',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            background: 'var(--accent)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            flex: 1,
                                            opacity: (gameState.isPaused || gameState.awayTimeouts === 0) ? 0.5 : 1,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Clock size={14} /> Timeout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Player List */}
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                        <div style={{ display: 'flex', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '5px', padding: '0 5px' }}>
                            <span style={{ flex: 1 }}>PLAYER</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>PTS</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>REB</span>
                            <span style={{ width: '30px', textAlign: 'center' }}>AST</span>
                        </div>
                        {gameState.awayLineup.map(p => {
                            const stats = gameState.boxScore.awayStats[p.id] || {};
                            const fatigue = p.fatigue !== undefined ? p.fatigue : 100;
                            const fatigueColor = fatigue > 80 ? '#2ecc71' : fatigue > 60 ? '#f1c40f' : '#e74c3c';

                            return (
                                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', padding: '8px 5px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ flex: 1, fontWeight: 'bold' }}>{p.lastName} <small style={{ fontWeight: 'normal', color: '#aaa' }}>{p.position}</small></span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.points || 0}</span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.rebounds || 0}</span>
                                        <span style={{ width: '30px', textAlign: 'center' }}>{stats.assists || 0}</span>
                                    </div>
                                    {/* Stamina Bar */}
                                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', marginTop: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${fatigue}%`, height: '100%', background: fatigueColor, transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Box Scores */}
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Home Box Score */}
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid ' + (gameState.homeTeam.colors?.primary || '#3498db') }}>{gameState.homeTeam.city} Box Score</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-secondary)', textAlign: 'right', cursor: 'pointer' }}>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Player</th>
                                    <th onClick={() => handleSort('minutes')} style={{ padding: '8px', textDecoration: sortConfig.key === 'minutes' ? 'underline' : 'none' }}>MIN</th>
                                    <th onClick={() => handleSort('points')} style={{ padding: '8px', fontWeight: 'bold', textDecoration: sortConfig.key === 'points' ? 'underline' : 'none' }}>PTS</th>
                                    <th onClick={() => handleSort('rebounds')} style={{ padding: '8px', textDecoration: sortConfig.key === 'rebounds' ? 'underline' : 'none' }}>REB</th>
                                    <th onClick={() => handleSort('assists')} style={{ padding: '8px', textDecoration: sortConfig.key === 'assists' ? 'underline' : 'none' }}>AST</th>
                                    <th onClick={() => handleSort('turnovers')} style={{ padding: '8px', textDecoration: sortConfig.key === 'turnovers' ? 'underline' : 'none' }}>TO</th>
                                    <th onClick={() => handleSort('steals')} style={{ padding: '8px', textDecoration: sortConfig.key === 'steals' ? 'underline' : 'none' }}>STL</th>
                                    <th onClick={() => handleSort('blocks')} style={{ padding: '8px', textDecoration: sortConfig.key === 'blocks' ? 'underline' : 'none' }}>BLK</th>
                                    <th style={{ padding: '8px', textDecoration: sortConfig.key === 'pf' ? 'underline' : 'none' }}>PF</th>
                                    <th onClick={() => handleSort('ft')} style={{ padding: '8px', textDecoration: sortConfig.key === 'ft' ? 'underline' : 'none' }}>FT</th>
                                    <th onClick={() => handleSort('fg')} style={{ padding: '8px', textDecoration: sortConfig.key === 'fg' ? 'underline' : 'none' }}>FG</th>
                                    <th onClick={() => handleSort('3pt')} style={{ padding: '8px', textDecoration: sortConfig.key === '3pt' ? 'underline' : 'none' }}>3PT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameState.boxScore && getSortedRoster(homeRoster, gameState.homeTeam.id).map(p => {
                                    const stats = gameState.boxScore.homeStats[p.id];
                                    if (!stats) return null;
                                    return (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold' }}>{p.lastName} <small style={{ fontWeight: 'normal' }}>{p.position}</small></td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{Math.floor(stats.minutes)}</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{stats.points}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.rebounds}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.assists}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.turnovers}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.steals}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.blocks}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.personalFouls}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.ftMade}/{stats.ftAttempted}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.fgMade}/{stats.fgAttempted}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.threeMade}/{stats.threeAttempted}</td>
                                        </tr>
                                    );

                                })}
                                {/* Totals Row */}
                                <tr style={{ borderTop: '2px solid rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                                    <td style={{ textAlign: 'left', padding: '8px' }}>TOTALS</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Math.round(Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.minutes || 0), 0))}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.points || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.rebounds || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.assists || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.turnovers || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.steals || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.blocks || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.personalFouls || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.ftMade || 0), 0)}/{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.ftAttempted || 0), 0)}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.fgMade || 0), 0)}/{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.fgAttempted || 0), 0)}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.threeMade || 0), 0)}/{Object.values(gameState.boxScore.homeStats).reduce((acc, p) => acc + (p.threeAttempted || 0), 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Away Box Score */}
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid ' + (gameState.awayTeam.colors?.primary || '#e74c3c') }}>{gameState.awayTeam.city} Box Score</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-secondary)', textAlign: 'right', cursor: 'pointer' }}>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Player</th>
                                    <th onClick={() => handleSort('minutes')} style={{ padding: '8px', textDecoration: sortConfig.key === 'minutes' ? 'underline' : 'none' }}>MIN</th>
                                    <th onClick={() => handleSort('points')} style={{ padding: '8px', fontWeight: 'bold', textDecoration: sortConfig.key === 'points' ? 'underline' : 'none' }}>PTS</th>
                                    <th onClick={() => handleSort('rebounds')} style={{ padding: '8px', textDecoration: sortConfig.key === 'rebounds' ? 'underline' : 'none' }}>REB</th>
                                    <th onClick={() => handleSort('assists')} style={{ padding: '8px', textDecoration: sortConfig.key === 'assists' ? 'underline' : 'none' }}>AST</th>
                                    <th onClick={() => handleSort('turnovers')} style={{ padding: '8px', textDecoration: sortConfig.key === 'turnovers' ? 'underline' : 'none' }}>TO</th>
                                    <th onClick={() => handleSort('steals')} style={{ padding: '8px', textDecoration: sortConfig.key === 'steals' ? 'underline' : 'none' }}>STL</th>
                                    <th onClick={() => handleSort('blocks')} style={{ padding: '8px', textDecoration: sortConfig.key === 'blocks' ? 'underline' : 'none' }}>BLK</th>
                                    <th style={{ padding: '8px', textDecoration: sortConfig.key === 'pf' ? 'underline' : 'none' }}>PF</th>
                                    <th onClick={() => handleSort('ft')} style={{ padding: '8px', textDecoration: sortConfig.key === 'ft' ? 'underline' : 'none' }}>FT</th>
                                    <th onClick={() => handleSort('fg')} style={{ padding: '8px', textDecoration: sortConfig.key === 'fg' ? 'underline' : 'none' }}>FG</th>
                                    <th onClick={() => handleSort('3pt')} style={{ padding: '8px', textDecoration: sortConfig.key === '3pt' ? 'underline' : 'none' }}>3PT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameState.boxScore && getSortedRoster(awayRoster, gameState.awayTeam.id).map(p => {
                                    const stats = gameState.boxScore.awayStats[p.id];
                                    if (!stats) return null;
                                    return (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold' }}>{p.lastName} <small style={{ fontWeight: 'normal' }}>{p.position}</small></td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{Math.floor(stats.minutes)}</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{stats.points}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.rebounds}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.assists}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.turnovers}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.steals}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.blocks}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.personalFouls}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.ftMade}/{stats.ftAttempted}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.fgMade}/{stats.fgAttempted}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>{stats.threeMade}/{stats.threeAttempted}</td>
                                        </tr>
                                    );

                                })}
                                {/* Totals Row */}
                                <tr style={{ borderTop: '2px solid rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                                    <td style={{ textAlign: 'left', padding: '8px' }}>TOTALS</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Math.round(Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.minutes || 0), 0))}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.points || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.rebounds || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.assists || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.turnovers || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.steals || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.blocks || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.personalFouls || 0), 0)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.ftMade || 0), 0)}/{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.ftAttempted || 0), 0)}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.fgMade || 0), 0)}/{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.fgAttempted || 0), 0)}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.threeMade || 0), 0)}/{Object.values(gameState.boxScore.awayStats).reduce((acc, p) => acc + (p.threeAttempted || 0), 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Substitution Modal */}
            {showSubs && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 10001, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Team Management ({showSubs})</h3>
                            <button onClick={() => { setShowSubs(null); setSelectedBench(null); }} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <p style={{ color: 'var(--accent)', marginBottom: '15px' }}>
                            {selectedBench ? 'Now click a player on the COURT to swap.' : 'Click a BENCH player first to substitute.'}
                        </p>

                        <div className="responsive-grid">
                            <div>
                                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>On Court (Strategy & Sub Out)</h4>
                                {(showSubs === 'HOME' ? gameState.homeLineup : gameState.awayLineup).map(p => (
                                    <div key={p.id} style={{ padding: '10px', border: selectedBench ? '2px dashed var(--primary)' : '1px solid var(--border)', marginBottom: '8px', borderRadius: '8px', background: 'var(--surface-light)', cursor: selectedBench ? 'pointer' : 'default' }}
                                        onClick={() => {
                                            if (selectedBench) {
                                                handleSub(showSubs === 'HOME' ? gameState.homeTeam.id : gameState.awayTeam.id, selectedBench, p.id);
                                                setSelectedBench(null);
                                            }
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold' }}>{p.lastName} <small>({p.position})</small></span>
                                            <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>{Math.round(p.fatigue || 100)}% Eng</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }} onClick={e => e.stopPropagation()}>
                                            <StrategyControl playerId={p.id} type="offense" />
                                            <StrategyControl playerId={p.id} type="defense" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>Bench (Click to Sub In)</h4>
                                {(showSubs === 'HOME' ? gameState.homeBench : gameState.awayBench).map(p => (
                                    <div key={p.id} style={{ padding: '10px', border: selectedBench === p.id ? '2px solid var(--primary)' : '1px solid var(--border)', marginBottom: '8px', borderRadius: '8px', opacity: 0.8, cursor: 'pointer', background: selectedBench === p.id ? 'rgba(52, 152, 219, 0.1)' : 'transparent' }}
                                        onClick={() => setSelectedBench(p.id === selectedBench ? null : p.id)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold' }}>{p.lastName} <small>({p.position})</small></span>
                                            <span style={{ fontSize: '0.8rem' }}>{Math.round(p.fatigue || 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button onClick={() => { setShowSubs(null); setSelectedBench(null); }} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'var(--text)' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {gameState.isFinished && (
                <div style={{ position: 'fixed', bottom: '120px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
                    <button onClick={() => onGameEnd(engineRef.current?.getResults())} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        Finish Game
                    </button>
                </div>
            )}

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h2 style={{ marginTop: 0 }}>Exit Live Game?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                            The game is still in progress. Would you like to simulate to the end and save the results before leaving?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={handleSimAndExit}
                                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Simulate to End & Exit
                            </button>
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                Continue Playing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {gameState?.isSimulating && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20000, backdropFilter: 'blur(3px)' }}>
                    <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <h2 style={{ color: 'white', marginTop: '20px' }}>Simulating match...</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>Calculating final scores and stats</p>
                    <button
                        onClick={() => engineRef.current?.stopSimulation()}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            padding: '8px 24px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        Stop
                    </button>
                </div>
            )}
        </div>
    );
};
