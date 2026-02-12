import React, { useEffect, useState, useRef } from 'react';
import type { MatchResult } from '../simulation/SimulationTypes';
import type { GameEvent } from '../simulation/SimulationTypes';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';

interface MatchViewProps {
    matchResult: MatchResult;
    homeTeam: Team;
    awayTeam: Team;
    players: Player[];
    onClose: () => void;
}

export const MatchView: React.FC<MatchViewProps> = ({ matchResult, homeTeam, awayTeam, players, onClose }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [currentText, setCurrentText] = useState('');

    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const lastFrameTime = useRef<number>(0);

    const fullGameDuration = 2880; // 48 mins

    // Starters (First 5 by Overall for now)
    const homeStarters = players.filter(p => p.teamId === homeTeam.id).sort((a, b) => b.overall - a.overall).slice(0, 5);
    const awayStarters = players.filter(p => p.teamId === awayTeam.id).sort((a, b) => b.overall - a.overall).slice(0, 5);

    // Helpers for interpolation
    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

    // Helper: Get elapsed time from GameEvent
    const getElapsed = (e: GameEvent) => fullGameDuration - e.gameTime;

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) {
            cancelAnimationFrame(animationRef.current);
            return;
        }

        const animate = (time: number) => {
            if (!lastFrameTime.current) lastFrameTime.current = time;
            const delta = (time - lastFrameTime.current) / 1000;
            lastFrameTime.current = time;

            setCurrentTime(prev => {
                const nextTime = prev + (delta * 5 * speed);
                if (nextTime >= fullGameDuration) {
                    setIsPlaying(false);
                    return fullGameDuration;
                }
                return nextTime;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, speed]);


    // Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Court
        drawCourt(ctx, canvas.width, canvas.height);

        // 2. Update Game State
        updateGameState(currentTime);

        // 3. Calculate & Draw Players
        drawPlayersAndBall(ctx, canvas.width, canvas.height);

    }, [currentTime, matchResult]);


    const updateGameState = (time: number) => {
        // Score
        let h = 0, a = 0;
        const eventsSoFar = matchResult.events.filter(e => getElapsed(e) <= time);

        eventsSoFar.forEach(e => {
            // Count score
            if (e.type === 'shot_made' || e.type === 'free_throw_made') {
                if (e.score) {
                    if (e.teamId === homeTeam.id) h += e.score;
                    else a += e.score;
                } else if (e.type === 'free_throw_made') {
                    // Assume 1pt if not specified
                    if (e.teamId === homeTeam.id) h += 1;
                    else a += 1;
                }
            }
        });
        setHomeScore(h);
        setAwayScore(a);

        // Text
        const recentEvent = eventsSoFar[eventsSoFar.length - 1];
        if (recentEvent && recentEvent.text) setCurrentText(`${recentEvent.text}`);
    };

    const drawPlayersAndBall = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Find current Ball Carrier location
        const interpolated = interpolateBallPosition(currentTime, matchResult.events);

        if (!interpolated) return;

        const ballX = interpolated.x;
        const ballY = interpolated.y;
        const ballZ = interpolated.z;
        const event = interpolated.event;
        const possessionTeamId = event?.teamId || homeTeam.id;

        // --- OFFENSE ---
        const offenseColor = possessionTeamId === homeTeam.id ? (homeTeam.colors?.primary || '#fff') : (awayTeam.colors?.primary || '#000');
        const defenseColor = possessionTeamId === homeTeam.id ? (awayTeam.colors?.primary || '#000') : (homeTeam.colors?.primary || '#fff');

        const starters = possessionTeamId === homeTeam.id ? homeStarters : awayStarters;
        const defenders = possessionTeamId === homeTeam.id ? awayStarters : homeStarters;

        const isBallInFlight = event?.type === 'action' && event.subType === 'pass' || event?.type === 'shot_made' || event?.type === 'shot_miss';

        // Render Offense
        starters.forEach((p, i) => {
            // If P1 (Ball Handler)
            if (p.id === event?.playerId && !isBallInFlight) {
                // He is ball handler -> At Ball Pos
                drawDot(ctx, ballX, ballY, offenseColor, p.position, w, h, true);
            } else {
                // Spacing logic (simplified 4-out)
                const relX = possessionTeamId === homeTeam.id ? ballX - 20 : ballX + 20;
                // Prevent off court
                const px = Math.max(5, Math.min(95, relX + (i % 2 === 0 ? 0 : (possessionTeamId === homeTeam.id ? 10 : -10))));
                const py = Math.max(5, Math.min(45, 10 + i * 10));

                drawDot(ctx, px, py, offenseColor, p.position, w, h);
            }
        });

        // Render Defense
        defenders.forEach((p, i) => {
            // Placeholder defense logic
        });


        // DRAW BALL
        const ballScreenX = (ballX / 100) * w;
        const ballScreenY = (ballY / 50) * h - (ballZ * 2);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        const shadowScale = Math.max(0.2, 1 - (ballZ / 25));
        ctx.ellipse((ballX / 100) * w, (ballY / 50) * h + 4, 6 * shadowScale, 3 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ball
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(ballScreenX, ballScreenY, 5 + (ballZ / 8), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string, w: number, h: number, isBallHandler = false) => {
        const cx = (x / 100) * w;
        const cy = (y / 50) * h;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Player Dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, isBallHandler ? 9 : 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = isBallHandler ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label?.[0] || '', cx, cy);
    };

    const interpolateBallPosition = (time: number, events: GameEvent[]): { x: number, y: number, z: number, event: GameEvent } | null => {
        const pastEvents = events.filter(e => getElapsed(e) <= time);
        const futureEvents = events.filter(e => getElapsed(e) > time);
        const last = pastEvents[pastEvents.length - 1];
        const next = futureEvents[0];

        if (!last) return null;

        const lastX = 50; // events don't have location yet in GameEvent?
        const lastY = 25;

        // Default: Holding ball
        if (!next) {
            return { x: lastX, y: lastY, z: 0, event: last };
        }

        // Action: Pass or Shot
        const duration = getElapsed(next) - getElapsed(last);
        const progress = Math.min(1, Math.max(0, (time - getElapsed(last)) / duration));

        const nextX = 50;
        const nextY = 25;

        // Interpolate X/Y
        const x = lerp(lastX, nextX, progress);
        const y = lerp(lastY, nextY, progress);
        let z = 0;

        return { x, y, z, event: last };
    };

    const drawCourt = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Colors
        const WOOD = '#d8c295';
        const WOOD_DARK = '#cfb480';
        const LINE = '#ffffff';

        // Background
        ctx.fillStyle = WOOD;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = LINE;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Helper: Convert court % coordinates to pixels
        const X = (pct: number) => (pct / 100) * w;
        const Y = (pct: number) => (pct / 50) * h;

        // --- Boundaries ---
        ctx.strokeRect(X(0), Y(0), X(100), Y(50));

        // --- Center Court ---
        ctx.beginPath();
        ctx.moveTo(X(50), Y(0));
        ctx.lineTo(X(50), Y(50));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(X(50), Y(25), X(6), 0, Math.PI * 2);
        ctx.stroke();

        // --- Key & 3PT (Left Side) ---
        drawHalfCourt(ctx, X, Y, false);

        // --- Key & 3PT (Right Side) ---
        drawHalfCourt(ctx, X, Y, true);
    };

    const drawHalfCourt = (ctx: CanvasRenderingContext2D, X: any, Y: any, isRight: boolean) => {
        const rimX = isRight ? 95 : 5;
        const baselineX = isRight ? 100 : 0;
        const dir = isRight ? -1 : 1;
        const LINE = '#ffffff';

        ctx.fillStyle = 'rgba(200, 50, 50, 0.2)';
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(isRight ? X(100 - 19) : X(0), Y(17), X(19), Y(16));
        ctx.strokeRect(isRight ? X(100 - 19) : X(0), Y(17), X(19), Y(16));

        // Free Throw Circle
        ctx.beginPath();
        ctx.arc(isRight ? X(100 - 19) : X(19), Y(25), X(6), 0, Math.PI * 2);
        ctx.stroke();

        const hoopX = isRight ? 94.7 : 5.3;
        const startAngle = isRight ? Math.PI * 0.5 : -Math.PI * 0.5;
        const endAngle = isRight ? Math.PI * 1.5 : Math.PI * 0.5;

        // 3 Point Line
        ctx.beginPath();
        ctx.moveTo(isRight ? X(100) : X(0), Y(5));
        ctx.lineTo(isRight ? X(100 - 14) : X(14), Y(5));
        ctx.ellipse(X(hoopX), Y(25), X(24), Y(24) * 2, 0, startAngle + 0.3, endAngle - 0.3);
        ctx.moveTo(isRight ? X(100 - 14) : X(14), Y(45));
        ctx.lineTo(isRight ? X(100) : X(0), Y(45));
        ctx.stroke();

        // Hoop
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(isRight ? X(96) : X(4), Y(22));
        ctx.lineTo(isRight ? X(96) : X(4), Y(28));
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.arc(X(hoopX), Y(25), X(0.8), 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = LINE;
    }

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(10,10,12,0.95)', backdropFilter: 'blur(10px)',
            zIndex: 100, color: '#fff', display: 'flex', flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ padding: '0 40px', height: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    {/* Home Team */}
                    <div style={{ textAlign: 'center', opacity: homeScore > awayScore ? 1 : 0.7 }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: homeTeam.colors?.primary }}>{homeScore}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '1px' }}>{homeTeam.abbreviation}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{homeStarters[0]?.lastName} +4</div>
                    </div>

                    <div style={{ fontSize: '1.2rem', fontWeight: 200, opacity: 0.5 }}>VS</div>

                    {/* Away Team */}
                    <div style={{ textAlign: 'center', opacity: awayScore > homeScore ? 1 : 0.7 }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: awayTeam.colors?.primary }}>{awayScore}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '1px' }}>{awayTeam.abbreviation}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{awayStarters[0]?.lastName} +4</div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isPlaying ? '#e74c3c' : '#666', boxShadow: isPlaying ? '0 0 10px #e74c3c' : 'none' }}></div>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1 }}>{formatTime(currentTime)}</div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>Q4 - REGULAR SEASON</div>
                </div>
            </div>

            {/* Main Stage */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', aspectRatio: '2/1', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden' }}>
                    <canvas
                        ref={canvasRef}
                        width={1000}
                        height={500}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                </div>
            </div>

            {/* Play-by-Play Footer */}
            <div style={{ padding: '24px 40px', background: '#111', borderTop: '1px solid #333', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff', fontWeight: 500 }}>{currentText}</div>
                    <input
                        type="range"
                        min={0}
                        max={fullGameDuration}
                        value={currentTime}
                        onChange={(e) => setCurrentTime(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', background: '#222', padding: '4px', borderRadius: '8px' }}>
                    {[1, 5, 20].map(s => (
                        <button
                            key={s}
                            onClick={() => setSpeed(s)}
                            style={{
                                padding: '8px 16px',
                                background: speed === s ? '#444' : 'transparent',
                                color: speed === s ? '#fff' : '#888',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 700
                            }}
                        >
                            {s}x
                        </button>
                    ))}
                </div>

                <button onClick={onClose} style={{ padding: '12px 24px', background: '#d00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginLeft: '20px' }}>
                    EXIT
                </button>
            </div>
        </div>
    );
};
