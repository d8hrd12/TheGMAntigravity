import React from 'react';
import type { AI_GM } from '../../models/AI_GM';
import type { Team } from '../../models/Team';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { StarRating } from '../../components/StarRating';
import { BackButton } from '../ui/BackButton';
import { PageHeader } from '../ui/PageHeader';
import { Briefcase, TrendingUp, DollarSign, Users, Award, ArrowLeftRight } from 'lucide-react';

export const GMListView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const { aiGms, teams, players } = useGame();

    if (!aiGms || aiGms.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                <Briefcase size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3>No Executives Found</h3>
                <p>The league office is currently empty. Try initializing a new game.</p>
            </div>
        );
    }

    const getTeamForGM = (gm: AI_GM) => {
        return teams.find(t => t.gmId === gm.id || t.id === gm.teamId);
    };

    const getTeamCategory = (team: Team) => {
        return team.strategy?.direction || 'Retooling';
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Contender': return '#f1c40f';
            case 'PlayoffTeam': return '#2ecc71';
            case 'Young_Developing': return '#3498db';
            case 'Rebuilding': return '#e74c3c';
            default: return 'var(--text-dim)';
        }
    };

    return (
        <div style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100%', maxWidth: '500px', margin: '0 auto' }}>
            {onBack && <PageHeader title="League Executives" onBack={onBack} />}
            {!onBack && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px', textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>LEAGUE EXECUTIVES</h1>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>{aiGms.length} GMs</div>
                </div>
            )}

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '16px'
            }}>
                {aiGms.map(gm => {
                    const team = getTeamForGM(gm);
                    const category = team ? getTeamCategory(team) : 'Free Agent';
                    const categoryColor = getCategoryColor(category);

                    return (
                        <div key={gm.id} className="glass-panel" style={{
                            padding: '20px',
                            borderRadius: '20px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            transition: 'transform 0.2s, border-color 0.2s',
                            cursor: 'default'
                        }}>
                            {/* Header: Name and Team */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: team?.colors?.primary || 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }}>
                                        {team?.logo ? (
                                            <img src={team.logo} alt="" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                                        ) : (
                                            <Briefcase size={28} color="#fff" />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{gm.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {team ? `${team.city} ${team.name}` : 'Free Agent'}
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                            {gm.age} Years Old
                                        </div>
                                    </div>
                                </div>
                                <div style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    background: `${categoryColor}15`, 
                                    border: `1px solid ${categoryColor}40`,
                                    color: categoryColor,
                                    fontSize: '0.7rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    {category}
                                </div>
                            </div>

                            {/* Skills Grid */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '12px',
                                background: 'var(--bg-card-hover, rgba(0,0,0,0.04))',
                                padding: '12px',
                                borderRadius: '12px'
                            }}>
                                <SkillItem label="TRADE" value={gm.skills.trading} icon={<ArrowLeftRight size={12} />} />
                                <SkillItem label="DRAFT" value={gm.skills.drafting} icon={<TrendingUp size={12} />} />
                                <SkillItem label="NEGOT" value={gm.skills.negotiation} icon={<DollarSign size={12} />} />
                                <SkillItem label="FINAN" value={gm.skills.financials} icon={<Briefcase size={12} />} />
                                <SkillItem label="REPUT" value={gm.skills.reputation} icon={<Award size={12} />} />
                                <SkillItem label="SECURE" value={gm.jobSecurity} icon={<Users size={12} />} />
                            </div>

                            {/* Philosophy */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>PHILOSOPHY:</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{gm.philosophy}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SkillItem: React.FC<{ label: string, value: number, icon: any }> = ({ label, value, icon }) => {
    const getColor = (val: number) => {
        if (val >= 85) return '#2ecc71';
        if (val >= 70) return '#3498db';
        if (val >= 50) return '#f1c40f';
        return '#e74c3c';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: getColor(value) }}>
                {value}
            </div>
        </div>
    );
};


