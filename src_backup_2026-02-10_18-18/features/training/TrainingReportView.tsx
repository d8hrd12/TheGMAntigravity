
import React, { useMemo, useState } from 'react';
import { useGame } from '../../store/GameContext';
import { ChevronLeft, TrendingUp, Target } from 'lucide-react';
import type { AttributeChange } from '../../models/Training';
import { BackButton } from '../ui/BackButton';

// Helper for attribute color coding (Value)
const getAttributeColor = (value: number) => {
    if (value >= 90) return 'text-[#2ecc71] font-extrabold'; // Elite (Green)
    if (value >= 80) return 'text-[#3498db] font-bold'; // Great (Blue)
    if (value >= 70) return 'text-[#f1c40f] font-semibold'; // Good (Yellow)
    if (value >= 60) return 'text-[var(--text)]'; // Average (White)
    return 'text-[var(--danger)]'; // Poor (Red)
};

// Component for a Data Cell (Value + Growth)
const StatCell = ({ label, value, changes, isOvr = false }: { label: string, value: number, changes?: AttributeChange[], isOvr?: boolean }) => {
    // Map label to attribute key
    const map: Record<string, string> = {
        'FIN': 'finishing',
        'MID': 'midRange',
        '3PT': 'threePointShot',
        'FT': 'freeThrow',
        'PLY': 'playmaking',
        'HND': 'ballHandling',
        'IQ': 'basketballIQ',
        'IDEF': 'interiorDefense',
        'PDEF': 'perimeterDefense',
        'STL': 'stealing',
        'BLK': 'blocking',
        'ORB': 'offensiveRebound',
        'DRB': 'defensiveRebound',
        'ATH': 'athleticism'
    };

    let delta = 0;

    if (isOvr) {
        // Parent passes delta for OVR typically
    } else {
        const key = map[label];
        const change = changes?.find(c => c.attributeName === key);
        delta = change ? change.delta : 0;
    }

    return (
        <div className="flex items-center justify-center h-full w-full relative">
            <span className={`text-[0.9rem] ${isOvr ? (value >= 90 ? 'text-[#2ecc71] font-bold' : 'text-[var(--text)] font-bold') : getAttributeColor(value)}`}>
                {value}
            </span>
            {delta !== 0 && (
                <sup className={`ml-0.5 text-[10px] font-bold ${delta > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                </sup>
            )}
        </div>
    );
};

// Specific OVR Cell that takes direct delta
const OvrCellDisplay = ({ value, delta }: { value: number, delta: number }) => {
    const colorStyle = delta > 0 ? { color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.3)' }
        : delta < 0 ? { color: '#ff4444' }
            : undefined;

    const defaultClass = value >= 90 ? 'text-[#2ecc71]' : value >= 80 ? 'text-[#3498db]' : 'text-[var(--text)]';

    return (
        <div className="flex items-center justify-center font-bold">
            <span
                className={`text-[0.95rem] ${!colorStyle ? defaultClass : ''}`}
                style={colorStyle}
            >
                {value}
            </span>
            {delta !== 0 && (
                <sup className="ml-0.5 text-[10px] font-bold" style={{ color: delta > 0 ? '#00ff88' : '#ff4444' }}>
                    {delta > 0 ? '+' : ''}{delta}
                </sup>
            )}
        </div>
    );
};


export const TrainingReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { trainingReport, teams, players, userTeamId, date } = useGame();
    const [selectedFocus, setSelectedFocus] = useState<string>('All');

    const team = teams.find(t => t.id === userTeamId);

    // Determine columns
    const columns = [
        'FIN', 'MID', '3PT', 'FT',
        'PLY', 'HND', 'IQ',
        'IDEF', 'PDEF', 'STL', 'BLK',
        'ORB', 'DRB', 'ATH'
    ];

    const report = useMemo(() => {
        if (!trainingReport) return [];
        let r = [...trainingReport].sort((a, b) => b.overallChange - a.overallChange);
        if (selectedFocus !== 'All') {
            r = r.filter(p => p.focus === selectedFocus);
        }
        return r;
    }, [trainingReport, selectedFocus]);

    if (!trainingReport || trainingReport.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
                <div className="mb-4">No report data available.</div>
                <BackButton onClick={onBack} />
            </div>
        );
    }

    const avgChange = (trainingReport.reduce((acc: number, r: any) => acc + (r.overallChange || 0), 0) / trainingReport.length).toFixed(1);

    const FOCUS_OPTIONS = ['All', 'Balanced', 'Shooting', 'Playmaking', 'Defense', 'Physical'];

    return (
        <div style={{ padding: '20px', minHeight: '100vh', paddingBottom: '80px', background: 'var(--background)' }}>

            {/* Top Bar matching TeamStatsView */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 className="text-xl font-bold tracking-tight">TRAINING REPORT <span className="opacity-50">{date.getFullYear()}</span></h2>
                </div>
            </div>

            {/* Sub-header / Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>
                        {team?.city} {team?.name}
                    </div>
                </div>
                <div className={`font-bold flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 ${Number(avgChange) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    <TrendingUp size={14} className="mr-1.5" />
                    Avg Growth: {Number(avgChange) > 0 ? '+' : ''}{avgChange}
                </div>
            </div>

            {/* Focus Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
                {FOCUS_OPTIONS.map(opt => (
                    <button
                        key={opt}
                        onClick={() => setSelectedFocus(opt)}
                        style={{
                            padding: '6px 16px',
                            background: selectedFocus === opt ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: selectedFocus === opt ? '#fff' : 'var(--text-secondary)',
                            border: `1px solid ${selectedFocus === opt ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* Table Container - matching TeamStatsView glass-panel */}
            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Player</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Pos</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Age</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)' }}>OVR</th>

                            {columns.map(col => (
                                <th key={col} style={{ padding: '12px 4px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', minWidth: '36px' }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((entry, idx) => {
                            const player = players.find(p => p.id === entry.playerId);
                            if (!player) return null;
                            const isEven = idx % 2 === 0;

                            return (
                                <tr
                                    key={entry.playerId}
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        transition: 'background 0.2s',
                                        background: isEven ? 'transparent' : 'rgba(255,255,255,0.02)'
                                    }}
                                    className="hover:bg-white/5"
                                >
                                    {/* Player Name */}
                                    <td style={{ padding: '12px 16px' }}>
                                        <div className="flex flex-col">
                                            <div className="text-[0.95rem] font-bold text-[var(--text)] leading-none">
                                                {player.firstName} {player.lastName}
                                            </div>
                                            <div className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-60 flex items-center">
                                                <Target size={10} className="mr-1" /> {entry.focus}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Pos & Age */}
                                    <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{player.position}</td>
                                    <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.7, fontSize: '0.85rem' }}>{player.age}</td>

                                    {/* OVR Cell */}
                                    <td style={{ padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
                                        <OvrCellDisplay value={player.overall} delta={entry.overallChange} />
                                    </td>

                                    {/* Stats Grid */}
                                    {columns.map(col => (
                                        <td key={col} style={{ padding: '8px 4px', textAlign: 'center' }}>
                                            <StatCell
                                                label={col}
                                                value={(player.attributes as any)[
                                                    col === 'FIN' ? 'finishing' :
                                                        col === 'MID' ? 'midRange' :
                                                            col === '3PT' ? 'threePointShot' :
                                                                col === 'FT' ? 'freeThrow' :
                                                                    col === 'PLY' ? 'playmaking' :
                                                                        col === 'HND' ? 'ballHandling' :
                                                                            col === 'IQ' ? 'basketballIQ' :
                                                                                col === 'IDEF' ? 'interiorDefense' :
                                                                                    col === 'PDEF' ? 'perimeterDefense' :
                                                                                        col === 'STL' ? 'stealing' :
                                                                                            col === 'BLK' ? 'blocking' :
                                                                                                col === 'ORB' ? 'offensiveRebound' :
                                                                                                    col === 'DRB' ? 'defensiveRebound' :
                                                                                                        col === 'ATH' ? 'athleticism' : ''
                                                ]}
                                                changes={entry.changes}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
