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
        <div style={{ width: '100%', height: '300px', margin: '0 auto', pointerEvents: 'none', WebkitTapHighlightColor: 'transparent' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name={player.lastName}
                        dataKey="A"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fill="var(--primary)"
                        fillOpacity={0.4}
                        isAnimationActive={true}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
