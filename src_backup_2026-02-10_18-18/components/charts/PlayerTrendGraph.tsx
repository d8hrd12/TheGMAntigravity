import React from 'react';
import type { Player } from '../../models/Player';

interface PlayerTrendGraphProps {
    player: Player;
    width?: number;
    height?: number;
}

export const PlayerTrendGraph: React.FC<PlayerTrendGraphProps> = ({
    player,
    width = 300,
    height = 200
}) => {
    // Collect data points: (CareerStats OVRs)
    const history = player.careerStats
        .filter(s => !s.isPlayoffs) // Only regular season for consistency
        .map(s => ({
            year: s.season,
            ovr: s.overall || 70 // Fallback for legacy data
        }));

    // Sort by year
    const dataPoints = [...history].sort((a, b) => a.year - b.year);

    // If we have at least one career stat, a graph makes sense.
    // If not, we just show "No historical data"
    if (dataPoints.length < 2) {
        return (
            <div style={{
                width: '100%',
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                textAlign: 'center',
                padding: '20px'
            }}>
                Not enough historical data to show development trend.<br />
                Play a few seasons to see improvements!
            </div>
        );
    }

    const minOvrTotal = Math.min(...dataPoints.map(d => d.ovr));
    const maxOvrTotal = Math.max(...dataPoints.map(d => d.ovr));

    const minOvr = Math.max(50, minOvrTotal - 5);
    const maxOvr = Math.min(99, maxOvrTotal + 5);
    const range = maxOvr - minOvr;

    const paddingX = 40;
    const paddingY = 40;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const getX = (index: number) => paddingX + (index * (chartWidth / (dataPoints.length - 1)));
    const getY = (ovr: number) => height - paddingY - ((ovr - minOvr) / (range || 1)) * chartHeight;

    const points = dataPoints.map((d, i) => `${getX(i)},${getY(d.ovr)}`).join(' ');

    return (
        <div style={{ width: '100%', height, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <svg width={width} height={height}>
                {/* Horizontal Guide Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(p => (
                    <line
                        key={p}
                        x1={paddingX}
                        y1={paddingY + p * chartHeight}
                        x2={width - paddingX}
                        y2={paddingY + p * chartHeight}
                        stroke="var(--border)"
                        strokeWidth="1"
                        strokeDasharray="4"
                        opacity="0.2"
                    />
                ))}

                {/* The Line */}
                <polyline
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />

                {/* Data Points */}
                {dataPoints.map((d, i) => (
                    <g key={i}>
                        <circle
                            cx={getX(i)}
                            cy={getY(d.ovr)}
                            r="5"
                            fill="var(--surface-active)"
                            stroke="var(--primary)"
                            strokeWidth="2"
                        />
                        <text
                            x={getX(i)}
                            y={getY(d.ovr) - 12}
                            textAnchor="middle"
                            fill="var(--text)"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            {d.ovr}
                        </text>
                        <text
                            x={getX(i)}
                            y={height - 15}
                            textAnchor="middle"
                            fill="var(--text-secondary)"
                            fontSize="10"
                        >
                            {d.year}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};
