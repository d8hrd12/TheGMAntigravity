import React from 'react';
import type { AI_GM } from '../../models/AI_GM';

interface GMProfileProps {
    gm: AI_GM;
    onClose?: () => void;
}

export const GMProfile: React.FC<GMProfileProps> = ({ gm, onClose }) => {
    const renderSkillBar = (label: string, value: number, color: string) => (
        <div className="gm-skill-row">
            <div className="gm-skill-label">{label}</div>
            <div className="gm-skill-bar-bg">
                <div 
                    className="gm-skill-bar-fill" 
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
            <div className="gm-skill-value">{value}</div>
        </div>
    );

    const getPhilosophyColor = (p: string) => {
        switch (p) {
            case 'Win Now': return '#f44336';
            case 'Youth': return '#4caf50';
            case 'Financial': return '#ff9800';
            default: return '#2196f3';
        }
    };

    return (
        <div className="gm-profile-container">
            <div className="gm-profile-card">
                <div className="gm-header">
                    <div className="gm-avatar-placeholder">
                        {gm.name.charAt(0)}
                    </div>
                    <div className="gm-basic-info">
                        <h2>{gm.name}</h2>
                        <div 
                            className="gm-philosophy-badge"
                            style={{ borderColor: getPhilosophyColor(gm.philosophy), color: getPhilosophyColor(gm.philosophy) }}
                        >
                            {gm.philosophy}
                        </div>
                    </div>
                    {onClose && (
                        <button className="gm-close-btn" onClick={onClose}>×</button>
                    )}
                </div>

                <div className="gm-experience">
                    <span>Exp: {gm.experience} Years</span>
                    <span>Reputation: {gm.skills.reputation}/100</span>
                </div>

                <div className="gm-skills-section">
                    <h3>Executive Skills</h3>
                    {renderSkillBar('Trading', gm.skills.trading, '#673ab7')}
                    {renderSkillBar('Drafting', gm.skills.drafting, '#3f51b5')}
                    {renderSkillBar('Negotiation', gm.skills.negotiation, '#009688')}
                    {renderSkillBar('Financials', gm.skills.financials, '#8bc34a')}
                </div>

                <div className="gm-history">
                    <h3>Current Tenure</h3>
                    <div className="gm-stat-grid">
                        <div className="gm-stat-item">
                            <span className="label">Job Security</span>
                            <span className="value" style={{ color: gm.jobSecurity > 70 ? '#4caf50' : (gm.jobSecurity > 40 ? '#ffeb3b' : '#f44336') }}>
                                {gm.jobSecurity}%
                            </span>
                        </div>
                        <div className="gm-stat-item">
                            <span className="label">Performance</span>
                            <span className="value">{(gm.skills.reputation / 10).toFixed(1)} / 10</span>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .gm-profile-container {
                    padding: 20px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                }
                .gm-profile-card {
                    background: rgba(30, 35, 45, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    max-width: 400px;
                    margin: 0 auto;
                }
                .gm-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                    position: relative;
                }
                .gm-avatar-placeholder {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #303f9f, #1976d2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: bold;
                    border: 2px solid rgba(255,255,255,0.2);
                }
                .gm-basic-info h2 {
                    margin: 0;
                    font-size: 1.4rem;
                }
                .gm-philosophy-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border: 1px solid;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    margin-top: 4px;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                }
                .gm-close-btn {
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.5);
                    font-size: 24px;
                    cursor: pointer;
                }
                .gm-experience {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 24px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                }
                .gm-skills-section h3, .gm-history h3 {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.9);
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .gm-skill-row {
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .gm-skill-label {
                    width: 90px;
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.7);
                }
                .gm-skill-bar-bg {
                    flex: 1;
                    height: 6px;
                    background: var(--border-color);
                    border-radius: 3px;
                    overflow: hidden;
                }
                .gm-skill-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.5s ease-out;
                }
                .gm-skill-value {
                    width: 24px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    text-align: right;
                }
                .gm-history {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                .gm-stat-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .gm-stat-item {
                    background: rgba(0,0,0,0.2);
                    padding: 12px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .gm-stat-item .label {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 4px;
                }
                .gm-stat-item .value {
                    font-size: 1.1rem;
                    font-weight: bold;
                }
            `}} />
        </div>
    );
};
