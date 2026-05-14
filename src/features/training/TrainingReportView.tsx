
import React, { useMemo, useState } from 'react';
import { useGame } from '../../store/GameContext';
import { ChevronLeft, TrendingUp, Target, Award, User, Users, Zap } from 'lucide-react';
import type { AttributeChange, ProgressionResult } from '../../models/Training';
import { BackButton } from '../ui/BackButton';
import { PageHeader } from '../ui/PageHeader';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';

// Helper for attribute color coding (Value)
const getAttributeColor = (value: number) => {
    if (value >= 90) return '#2ecc71'; // Elite (Green)
    if (value >= 80) return '#3498db'; // Great (Blue)
    if (value >= 70) return '#f1c40f'; // Good (Yellow)
    if (value >= 60) return 'var(--text)'; // Average (White)
    return 'var(--danger)'; // Poor (Red)
};

// Component for a Data Cell (Value + Growth)
const StatCell = ({ label, value, changes, isOvr = false }: { label: string, value: number, changes?: AttributeChange[], isOvr?: boolean }) => {
    const map: Record<string, string> = {
        'FIN': 'finishing', 'MID': 'midRange', '3PT': 'threePointShot', 'FT': 'freeThrow',
        'PLY': 'playmaking', 'HND': 'ballHandling', 'IQ': 'basketballIQ',
        'IDEF': 'interiorDefense', 'PDEF': 'perimeterDefense', 'STL': 'stealing', 'BLK': 'blocking',
        'ORB': 'offensiveRebound', 'DRB': 'defensiveRebound', 'ATH': 'athleticism'
    };

    let delta = 0;
    if (!isOvr) {
        const key = map[label];
        const change = changes?.find(c => c.attributeName === key);
        delta = change ? change.delta : 0;
    }

    const valueStyle = delta > 0 ? { color: '#2ecc71', fontWeight: 700 } : 
                       delta < 0 ? { color: '#e74c3c', fontWeight: 700 } : 
                       { color: getAttributeColor(value) };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
            <span style={{ fontSize: '0.85rem', ...valueStyle }}>
                {value}
            </span>
            {delta !== 0 && (
                <sup style={{ marginLeft: '1px', fontSize: '9px', fontWeight: 800, color: delta > 0 ? '#2ecc71' : '#e74c3c' }}>
                    {delta > 0 ? '+' : ''}{delta}
                </sup>
            )}
        </div>
    );
};

const StarCellDisplay = ({ player, delta, baseline }: { player: any, delta: number, baseline: number }) => {
    const currentOvr = calculateOverall(player);
    const oldOvr = currentOvr - delta;
    const currentStars = calculateStars(currentOvr, baseline);
    const oldStars = calculateStars(oldOvr, baseline);
    const starDelta = currentStars - oldStars;
    const deltaColor = starDelta > 0 ? '#2ecc71' : starDelta < 0 ? '#ff4444' : 'var(--text-secondary)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <StarRating stars={currentStars} size={14} />
            </div>
            {starDelta !== 0 && (
                <div style={{ fontSize: '0.7rem', color: deltaColor, fontWeight: 'bold', marginTop: '2px' }}>
                    {starDelta > 0 ? '+' : ''}{starDelta} Stars
                </div>
            )}
        </div>
    );
};

const SummaryCard = ({ icon: Icon, title, value, subtitle, color }: { icon: any, title: string, value: string | number, subtitle?: string, color: string }) => (
    <div className="modern-card" style={{ flex: 1, minWidth: '160px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
            <Icon size={14} style={{ color }} />
            {title}
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>{subtitle}</div>}
    </div>
);

export const TrainingReportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { trainingReport, teams, players, userTeamId, date } = useGame();
    const [selectedFocus, setSelectedFocus] = useState<string>('All');
    const [teamFilter, setTeamFilter] = useState<'MyTeam' | 'AllTeams'>('MyTeam');

    const columns = ['FIN', 'MID', '3PT', 'FT', 'PLY', 'HND', 'IQ', 'IDEF', 'PDEF', 'STL', 'BLK', 'ORB', 'DRB', 'ATH'];

    const filteredReport = useMemo(() => {
        if (!trainingReport) return [];
        let r = [...trainingReport].sort((a, b) => b.overallChange - a.overallChange);
        if (teamFilter === 'MyTeam') {
            r = r.filter(entry => players.find(p => p.id === entry.playerId)?.teamId === userTeamId);
        }
        if (selectedFocus !== 'All') {
            r = r.filter(p => p.focus === selectedFocus);
        }
        return r;
    }, [trainingReport, selectedFocus, teamFilter, players, userTeamId]);

    const stats = useMemo(() => {
        if (!trainingReport) return null;
        const myReport = trainingReport.filter(entry => players.find(p => p.id === entry.playerId)?.teamId === userTeamId);
        const avg = (myReport.reduce((acc, r) => acc + r.overallChange, 0) / (myReport.length || 1)).toFixed(1);
        const top = [...myReport].sort((a, b) => b.overallChange - a.overallChange)[0];
        const improvedCount = myReport.filter(r => r.overallChange > 0).length;
        return { avg, top, improvedCount };
    }, [trainingReport, players, userTeamId]);

    if (!trainingReport || trainingReport.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>No report data available.</div>
                <BackButton onClick={onBack} />
            </div>
        );
    }

    const FOCUS_OPTIONS = ['All', 'Balanced', 'Natural', 'Shooting', 'Playmaking', 'Defense', 'Physical'];

    return (
        <div style={{ padding: '16px', height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflowY: 'auto', paddingBottom: '90px' }}>
            <PageHeader 
                title={`Training Report ${date.getFullYear()}`} 
                onBack={onBack} 
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            {/* Top Dashboard Summary */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <SummaryCard 
                    icon={TrendingUp} 
                    title="Avg Growth" 
                    value={`${Number(stats?.avg) > 0 ? '+' : ''}${stats?.avg}`} 
                    subtitle="Points per player"
                    color={Number(stats?.avg) >= 0 ? '#2ecc71' : '#e74c3c'} 
                />
                <SummaryCard 
                    icon={Award} 
                    title="Top Prospect" 
                    value={stats?.top ? stats.top.name.split(' ').pop()! : 'N/A'} 
                    subtitle={stats?.top ? `+${(stats.top.overallChange / 8).toFixed(1)} Stars gain` : 'No gains'}
                    color="var(--text-main)" 
                />
                <SummaryCard 
                    icon={Users} 
                    title="Improved" 
                    value={`${stats?.improvedCount}/5`} 
                    subtitle="Players showing progress"
                    color="#3498db" 
                />
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                <div className="modern-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
                    <button
                        onClick={() => setTeamFilter('MyTeam')}
                        style={{ padding: '6px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, background: teamFilter === 'MyTeam' ? 'var(--text-main)' : 'transparent', color: teamFilter === 'MyTeam' ? '#fff' : 'var(--text-secondary)' }}
                    >
                        My Team
                    </button>
                    <button
                        onClick={() => setTeamFilter('AllTeams')}
                        style={{ padding: '6px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, background: teamFilter === 'AllTeams' ? 'var(--text-main)' : 'transparent', color: teamFilter === 'AllTeams' ? '#fff' : 'var(--text-secondary)' }}
                    >
                        League
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: 'calc(100vw - 40px)' }}>
                    {FOCUS_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setSelectedFocus(opt)}
                            style={{ 
                                padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)', whiteSpace: 'nowrap',
                                background: selectedFocus === opt ? 'var(--surface)' : 'var(--bg-card-hover)', 
                                color: selectedFocus === opt ? 'var(--text-main)' : 'var(--text-secondary)' 
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table */}
            <div className="modern-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '16px', flex: 1 }}>
                <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                            <th style={{ padding: '14px 16px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Player</th>
                            <th style={{ padding: '14px 4px', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center', color: 'var(--text-secondary)' }}>Pos</th>
                            <th style={{ padding: '14px 4px', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center', color: 'var(--text-secondary)' }}>Age</th>
                            <th style={{ padding: '14px 4px', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center', color: 'var(--text-main)' }}>Stars</th>
                            {columns.map(col => (
                                <th key={col} style={{ padding: '14px 4px', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'center', color: 'var(--text-secondary)', minWidth: '40px' }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReport.map((entry, idx) => {
                            const player = players.find(p => p.id === entry.playerId);
                            if (!player) return null;
                            const isUserPlayer = player.teamId === userTeamId;
                            
                            return (
                                <tr key={entry.playerId} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isUserPlayer ? 'var(--text)' : 'var(--text-secondary)' }}>
                                                {player.firstName} {player.lastName}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                <Target size={10} style={{ color: 'var(--text-main)', opacity: 0.7 }} />
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.6 }}>{entry.focus}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{player.position}</td>
                                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.7, fontSize: '0.8rem' }}>{player.age}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <StarCellDisplay 
                                            player={player} 
                                            delta={entry.overallChange} 
                                            baseline={calculateTeamBaseline(players.filter(p => p.teamId === player.teamId))} 
                                        />
                                    </td>
                                    {columns.map(col => (
                                        <td key={col} style={{ padding: '8px 4px' }}>
                                            <StatCell 
                                                label={col} 
                                                value={(player.attributes as any)[mapAttribute(col)]} 
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

// Internal Helper for Mapping
const mapAttribute = (label: string): string => {
    const map: Record<string, string> = {
        'FIN': 'finishing', 'MID': 'midRange', '3PT': 'threePointShot', 'FT': 'freeThrow',
        'PLY': 'playmaking', 'HND': 'ballHandling', 'IQ': 'basketballIQ',
        'IDEF': 'interiorDefense', 'PDEF': 'perimeterDefense', 'STL': 'stealing', 'BLK': 'blocking',
        'ORB': 'offensiveRebound', 'DRB': 'defensiveRebound', 'ATH': 'athleticism'
    };
    return map[label];
};
