import React, { useEffect, useState } from 'react';
import { useGame } from '../../store/GameContext';

interface SaveMeta {
    teamName: string;
    date: string;
    seasonPh: string;
    timestamp: number;
}

interface SaveExitModalProps {
    onClose: () => void;
    onSaveAndExit: (slotId: number) => void;
}

export const SaveExitModal: React.FC<SaveExitModalProps> = ({ onClose, onSaveAndExit }) => {
    const [slots, setSlots] = useState<{ id: number, meta: SaveMeta | null }[]>([]);

    useEffect(() => {
        const loadedSlots = [1, 2, 3].map(id => {
            const metaStr = localStorage.getItem(`save_meta_${id}`);
            return {
                id,
                meta: metaStr ? JSON.parse(metaStr) : null
            };
        });
        setSlots(loadedSlots);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--surface)',
                padding: '30px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '500px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '10px', color: 'var(--text)' }}>Save & Exit</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Your career slots are full (or unassigned). Please choose a slot to overwrite.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {slots.map(slot => (
                        <button
                            key={slot.id}
                            onClick={() => onSaveAndExit(slot.id)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                background: 'var(--surface-active)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'var(--text)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>
                                    {slot.id}
                                </div>
                                <div>
                                    {slot.meta ? (
                                        <>
                                            <div style={{ fontWeight: 'bold' }}>{slot.meta.teamName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {slot.meta.seasonPh} • {slot.meta.date}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Empty Slot</div>
                                    )}
                                </div>
                            </div>

                            {slot.meta && (
                                <div style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 'bold' }}>
                                    OVERWRITE
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
