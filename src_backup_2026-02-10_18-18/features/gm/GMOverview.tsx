import React from 'react';
import { useGame } from '../../store/GameContext';
import { Award, Target, TrendingUp, Zap, Briefcase } from 'lucide-react';
import { calculateProgression } from '../training/TrainingLogic'; // Just for types potentially? No.

export const GMOverview: React.FC = () => {
    const { gmProfile, teams, userTeamId } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    // Calculate XP Progress
    const xpForNextLevel = 1000; // Fixed for now as per logic
    const currentLevelXp = gmProfile.trustPoints % 1000; // Rough approximation if level = total / 1000
    // Actually detailed logic:
    // We store 'totalTrustEarned' and 'trustPoints' (currency).
    // Level is based on total trust earned? Or XP?
    // In GMLogic we did: level = 1 + floor(totalTrustEarned / 1000)
    // So progress is (totalTrustEarned % 1000) / 1000.

    const progressPercent = ((gmProfile.totalTrustEarned % 1000) / 1000) * 100;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text)' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={32} />
                Front Office
            </h1>

            {/* Top Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* Level Card */}
                <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>GM Level</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{gmProfile.level}</div>
                    <div style={{ marginTop: '10px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px', textAlign: 'right' }}>
                        {gmProfile.totalTrustEarned % 1000} / 1000 XP
                    </div>
                </div>

                {/* Trust Points (Currency) */}
                <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Trust Points</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f1c40f' }}>{gmProfile.trustPoints}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                        Spend on Perks
                    </div>
                </div>

                {/* Job Security */}
                <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Job Security</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: userTeam?.ownerPatience && userTeam.ownerPatience > 50 ? '#2ecc71' : '#e74c3c' }}>
                        {userTeam?.ownerPatience ?? 100}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                        Owner Patience
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Active Goals Column */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                        <Target /> Season Goals
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {gmProfile.currentGoals.length === 0 ? (
                            <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No active goals. Wait for season start.</div>
                        ) : (
                            gmProfile.currentGoals.map(goal => (
                                <div key={goal.id} style={{
                                    background: 'var(--surface-glass)',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    opacity: goal.isCompleted ? 0.7 : 1
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <div style={{ fontWeight: 'bold', textDecoration: goal.isCompleted ? 'line-through' : 'none' }}>
                                            {goal.description}
                                        </div>
                                        <div style={{ color: '#f1c40f', fontWeight: 'bold' }}>
                                            +{goal.rewardTrust} TP
                                        </div>
                                    </div>

                                    {/* Progress Bar (if applicable) */}
                                    {goal.targetValue > 1 && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                                                <span>Progress</span>
                                                <span>{goal.currentValue} / {goal.targetValue}</span>
                                            </div>
                                            <div style={{ height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%`, height: '100%', background: goal.isCompleted ? '#2ecc71' : 'var(--primary)' }} />
                                            </div>
                                        </div>
                                    )}

                                    {goal.isCompleted && (
                                        <div style={{ marginTop: '10px', color: '#2ecc71', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Award size={16} /> Completed
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Perks / Skill Tree Preview */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                        <Zap /> Active Perks
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {gmProfile.unlockedPerks.length === 0 ? (
                            <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No perks unlocked. Earn Trust Points to unlock skills!</div>
                        ) : (
                            gmProfile.unlockedPerks.map(perkId => (
                                <div key={perkId} style={{
                                    background: 'rgba(52, 152, 219, 0.2)',
                                    color: '#3498db',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    border: '1px solid rgba(52, 152, 219, 0.4)'
                                }}>
                                    {perkId} {/* TODO: Map to Name */}
                                </div>
                            ))
                        )}
                    </div>

                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                        Open Skill Tree (Winning Logic)
                    </button>
                </div>
            </div>
        </div>
    );
};
