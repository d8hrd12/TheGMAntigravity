import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { TrendingUp, TrendingDown, Activity, Zap, Shield, Target } from 'lucide-react';

export const TeamAdvancedStats: React.FC = () => {
    const { teams, userTeamId, games } = useGame();
    
    const analysis = useMemo(() => {
        if (!userTeamId) return null;

        const stats = teams.map(t => {
            const teamGames = games.filter(g => g.homeScore !== undefined && (g.homeTeamId === t.id || g.awayTeamId === t.id));
            const gp = teamGames.length || 1;
            
            let pts = 0, oppPts = 0;
            teamGames.forEach(g => {
                const isHome = g.homeTeamId === t.id;
                pts += isHome ? g.homeScore! : g.awayScore!;
                oppPts += isHome ? g.awayScore! : g.homeScore!;
            });

            return { id: t.id, ppg: pts / gp, oppPpg: oppPts / gp };
        });

        const avgPpg = stats.reduce((acc, s) => acc + s.ppg, 0) / teams.length;
        const avgOppPpg = stats.reduce((acc, s) => acc + s.oppPpg, 0) / teams.length;

        const userStats = stats.find(s => s.id === userTeamId) || { ppg: 0, oppPpg: 0 };
        
        const metrics = [
            { label: 'Scoring', value: userStats.ppg, avg: avgPpg, higherIsBetter: true, icon: Target, goodDesc: 'Elite Offense', badDesc: 'Struggling to Score' },
            { label: 'Defense', value: userStats.oppPpg, avg: avgOppPpg, higherIsBetter: false, icon: Shield, goodDesc: 'Lockdown Defense', badDesc: 'Leaky Defense' },
        ];

        const userTeam = teams.find(t => t.id === userTeamId);
        if (userTeam) {
            const winPct = userTeam.wins / (userTeam.wins + userTeam.losses || 1);
            metrics.push({ 
                label: 'Clutch', 
                value: winPct, 
                avg: 0.5, 
                higherIsBetter: true, 
                icon: Zap, 
                goodDesc: 'Winning Close Games', 
                badDesc: 'Failing in Clutch' 
            });
        }

        const sorted = metrics.map(m => {
            const diff = m.higherIsBetter ? (m.value - m.avg) : (m.avg - m.value);
            return { ...m, diff };
        }).sort((a, b) => b.diff - a.diff);

        return {
            strengths: sorted.slice(0, 2),
            weaknesses: [...sorted].reverse().slice(0, 2)
        };
    }, [teams, userTeamId, games]);

    if (!analysis) return null;

    const StatItem = ({ item, isStrength }: any) => {
        const Icon = item.icon;
        const color = isStrength ? 'var(--accent)' : 'var(--danger)';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card-hover)', padding: '10px 12px', borderRadius: '12px', border: `1px solid var(--border-color)` }}>
                <div style={{ color }}>
                    <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{isStrength ? item.goodDesc : item.badDesc}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</div>
                </div>
                <div style={{ color }}>
                    {isStrength ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
            </div>
        );
    };

    return (
        <DashboardCard title="Advanced Scouting" icon={<Activity size={16} />} variant="primary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strengths</div>
                    {analysis.strengths.map((s, i) => <StatItem key={i} item={s} isStrength={true} />)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weaknesses</div>
                    {analysis.weaknesses.map((w, i) => <StatItem key={i} item={w} isStrength={false} />)}
                </div>
            </div>
        </DashboardCard>
    );
};
