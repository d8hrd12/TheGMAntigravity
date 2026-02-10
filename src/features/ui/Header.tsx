import React from 'react';
import { Save, LogOut } from 'lucide-react';
import { useGame } from '../../store/GameContext';

interface HeaderProps {
    onSaveTrigger: () => void;
    onSaveExitTrigger: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSaveTrigger, onSaveExitTrigger }) => {
    const { currentSaveSlot, date } = useGame();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px', marginBottom: '10px' }}>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentSaveSlot ? '#2ecc71' : '#e74c3c' }} />
                {currentSaveSlot ? `Slot ${currentSaveSlot} • ${date.getFullYear()}` : 'Unsaved Career'}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={onSaveTrigger}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Save size={16} color="var(--text-secondary)" />
                    Save
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSaveExitTrigger();
                    }}
                    style={{
                        background: 'var(--surface-active)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}
                >
                    <LogOut size={16} color="var(--text-secondary)" />
                    Save & Exit
                </button>
            </div>
        </div>
    );
};
