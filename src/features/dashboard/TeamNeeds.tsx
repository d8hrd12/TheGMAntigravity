import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { Target, Shield, Zap, TrendingUp } from 'lucide-react';

export const TeamNeeds: React.FC = () => {
    const { players, userTeamId } = useGame();
    
    const needs = useMemo(() => {
        const userRoster = players.filter(p => p.teamId === userTeamId);
        if (userRoster.length === 0) return [];

        const starters = [...userRoster]
            .sort((a, b) => (b.minutes || 0) - (a.minutes || 0))
            .slice(0, 5);

        const posMap = {
            'PG': starters.find(p => p.position === 'PG'),
            'SG': starters.find(p => p.position === 'SG'),
            'SF': starters.find(p => p.position === 'SF'),
            'PF': starters.find(p => p.position === 'PF'),
            'C': starters.find(p => p.position === 'C'),
        };

        const result = [];

        const missingPos = (Object.keys(posMap) as Array<keyof typeof posMap>).filter(pos => !posMap[pos]);
        missingPos.forEach(pos => {
            result.push({
                type: 'position',
                label: `Needs a starting ${pos}`,
                icon: Target,
                color: 'var(--danger)'
            });
        });

        const avgShooting = starters.length > 0 ? (starters.reduce((acc, p) => acc + p.attributes.threePointShot, 0) / starters.length + starters.reduce((acc, p) => acc + p.attributes.midRange, 0) / starters.length) / 2 : 0;
        const avgDefense = starters.length > 0 ? (starters.reduce((acc, p) => acc + p.attributes.perimeterDefense, 0) / starters.length + starters.reduce((acc, p) => acc + p.attributes.interiorDefense, 0) / starters.length) / 2 : 0;
        const avgRebounding = starters.length > 0 ? (starters.reduce((acc, p) => acc + p.attributes.offensiveRebound, 0) / starters.length + starters.reduce((acc, p) => acc + p.attributes.defensiveRebound, 0) / starters.length) / 2 : 0;

        if (starters.length > 0 && avgShooting < 70) {
            result.push({
                type: 'skill',
                label: 'Need Perimeter Scoring',
                icon: Zap,
                color: 'var(--warning)',
                desc: 'Team lacks outside threats.'
            });
        }
        if (starters.length > 0 && avgDefense < 72) {
            result.push({
                type: 'skill',
                label: 'Need Defensive Anchor',
                icon: Shield,
                color: 'var(--text-main)',
                desc: 'Opponents score too easily.'
            });
        }
        if (starters.length > 0 && avgRebounding < 70) {
            result.push({
                type: 'skill',
                label: 'Need Rebounding',
                icon: TrendingUp,
                color: 'var(--accent)',
                desc: 'Missing second chance points.'
            });
        }
        
        if (userRoster.length < 10) {
            result.push({
                type: 'depth',
                label: 'Bench is thin',
                icon: Zap,
                color: 'var(--secondary)',
                desc: 'Fatigue will be an issue.'
            });
        }

        return result.slice(0, 3);
    }, [players, userTeamId]);

    if (needs.length === 0) {
        return (
            <DashboardCard title="Team Status" icon={<Target size={16} />} variant="primary">
                <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                    Roster looks balanced. No major needs identified.
                </div>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Team Needs" icon={<Target size={16} />} variant="primary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {needs.map((need, idx) => {
                    const Icon = need.icon;
                    return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card-hover)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ background: `var(--bg-card-hover)`, padding: '8px', borderRadius: '8px', color: need.color }}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{need.label}</div>
                                {need.desc && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{need.desc}</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardCard>
    );
};
