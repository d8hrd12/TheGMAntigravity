import React from 'react';
import type { Coach } from '../../models/Coach';
import { STYLE_DESCRIPTIONS } from '../../models/Coach';
import { User, Target, Shield, Zap } from 'lucide-react';

interface CoachPreviewProps {
    coach: Coach;
}

export const CoachPreview: React.FC<CoachPreviewProps> = ({ coach }) => {
    return (
        <div style={{
            background: 'var(--surface-light)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--primary)'
                }}>
                    <User size={24} color="var(--primary)" />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{coach.firstName} {coach.lastName}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Head Coach • {coach.style}
                    </div>
                </div>
            </div>

            {/* Ratings Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>OFFENSE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3498db' }}>{coach.rating.offense}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>DEFENSE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e74c3c' }}>{coach.rating.defense}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>DEV</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f1c40f' }}>{coach.rating.talentDevelopment}</div>
                </div>
            </div>

            {/* Style Description */}
            <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
            }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} /> Playing Style
                </div>
                {STYLE_DESCRIPTIONS[coach.style]}
            </div>

            {/* Contract Info */}
            <div style={{
                marginTop: '4px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
            }}>
                <span style={{ color: 'var(--text-secondary)' }}>Salary</span>
                <span style={{ fontWeight: 'bold' }}>${(coach.contract.salary / 1000000).toFixed(1)}M /yr</span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
            }}>
                <span style={{ color: 'var(--text-secondary)' }}>Term</span>
                <span style={{ fontWeight: 'bold' }}>{coach.contract.yearsRemaining} years</span>
            </div>
        </div>
    );
};
