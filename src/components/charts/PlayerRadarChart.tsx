import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Player } from '../../models/Player';

interface PlayerRadarChartProps {
    player: Player;
}

export const PlayerRadarChart: React.FC<PlayerRadarChartProps> = ({ player }) => {

    // Helper to clamp values 0-99
    const clamp = (val: number) => Math.min(99, Math.max(0, val));

    // 1. OFFENSE: Finishing, Mid, 3PT, FT
    const offense = (
        (player.attributes.finishing +
            player.attributes.midRange +
            player.attributes.threePointShot +
            player.attributes.freeThrow) / 4
    );

    // 2. DEFENSE: Interior, perimeter, stealing, blocking
    const defense = (
        (player.attributes.interiorDefense +
            player.attributes.perimeterDefense +
            player.attributes.stealing +
            player.attributes.blocking) / 4
    );

    // 3. PLAYMAKING: Playmaking, ball handling, IQ
    const playmaking = ((player.attributes.playmaking + player.attributes.ballHandling + player.attributes.basketballIQ) / 3);

    // 4. REBOUNDING: Off, Def
    const rebounding = ((player.attributes.offensiveRebound + player.attributes.defensiveRebound) / 2);

    // 5. ATHLETICISM: Athleticism
    const athleticism = player.attributes.athleticism;

    // 6. IQ: Basketball IQ (Duplicated for visual balance or just use IQ)
    const iq = player.attributes.basketballIQ;

    const data = [
        { subject: 'OFF', A: clamp(offense), fullMark: 100 },
        { subject: 'DEF', A: clamp(defense), fullMark: 100 },
        { subject: 'PLA', A: clamp(playmaking), fullMark: 100 },
        { subject: 'REB', A: clamp(rebounding), fullMark: 100 },
        { subject: 'ATH', A: clamp(athleticism), fullMark: 100 },
        { subject: 'IQ', A: clamp(iq), fullMark: 100 },
    ];

    return (
        <div style={{ 
            width: '100%', 
            height: '320px', 
            margin: '0 auto', 
            pointerEvents: 'none', 
            WebkitTapHighlightColor: 'transparent',
            position: 'relative',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            borderRadius: '50%'
        }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" gridType="polygon" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--text-main)', fontSize: 13, fontWeight: 900, letterSpacing: '1px' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    
                    {/* FIFA style background "Full" hexagon */}
                    <Radar
                        name="Scale"
                        data={(data as any).map((d: any) => ({ ...d, A: 100 }))}
                        stroke="rgba(255, 255, 255, 0.2)"
                        fill="rgba(200, 200, 200, 0.15)"
                        fillOpacity={1}
                        isAnimationActive={false}
                    />

                    {/* FIFA style mid-marks (50%) */}
                    <Radar
                        name="Mid"
                        data={(data as any).map((d: any) => ({ ...d, A: 50 }))}
                        stroke="rgba(255, 255, 255, 0.05)"
                        fill="none"
                        isAnimationActive={false}
                    />

                    {/* Player Skill Shape - Neon Glow */}
                    <Radar
                        name={player.lastName}
                        dataKey="A"
                        stroke="#00f2ff"
                        strokeWidth={2.5}
                        fill="#00f2ff"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                    />
                </RadarChart>
            </ResponsiveContainer>
            
            {/* Center Dot */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                background: '#00f2ff',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px #00f2ff',
                opacity: 0.5
            }} />
        </div>
    );
};
