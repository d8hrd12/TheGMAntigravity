import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';

interface SaveMeta {
    teamName: string;
    date: string;
    seasonPh: string;
    timestamp: number;
}

interface SaveLoadViewProps {
    mode: 'save' | 'load';
    onClose: () => void;
}

export function SaveLoadView({ mode, onClose }: SaveLoadViewProps) {
    const { saveGame, loadGame, deleteSave } = useGame();
    const [slots, setSlots] = useState<{ [key: number]: SaveMeta | null }>({ 1: null, 2: null, 3: null });
    const [isLoading, setIsLoading] = useState(false);

    const refreshSlots = () => {
        const newSlots: { [key: number]: SaveMeta | null } = {};
        for (let i = 1; i <= 3; i++) {
            const metaStr = localStorage.getItem(`save_meta_${i}`);
            if (metaStr) {
                newSlots[i] = JSON.parse(metaStr);
            } else {
                newSlots[i] = null;
            }
        }
        setSlots(newSlots);
    };

    useEffect(() => {
        refreshSlots();
    }, []);

    const handleAction = async (slotId: number) => {
        if (mode === 'save' && slots[slotId]) {
            if (!confirm(`Overwrite existing save in Slot ${slotId}?`)) {
                return;
            }
        }

        setIsLoading(true);
        try {
            if (mode === 'save') {
                await saveGame(slotId);
                refreshSlots();
            } else {
                const success = await loadGame(slotId);
                if (success) {
                    onClose(); // Close menu on successful load
                } else {
                    alert("Failed to load save.");
                }
            }
        } catch (e) {
            console.error(e);
            // Alert is handled in GameContext, but we ensure loading stops
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (slotId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete Slot ${slotId}?`)) {
            setIsLoading(true);
            await deleteSave(slotId);
            refreshSlots();
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', zIndex: 2000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--surface)', padding: '30px', borderRadius: '16px',
                width: '90%', maxWidth: '450px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: 'var(--text)'
            }}>
                <h2 style={{ marginTop: 0, color: 'var(--text)' }}>
                    {mode === 'save' ? 'Save Game' : 'Load Game'}
                    {isLoading && <span style={{ fontSize: '0.6em', marginLeft: '10px', opacity: 0.7 }}>(Processing...)</span>}
                </h2>

                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    {[1, 2, 3].map(id => (
                        <div key={id}
                            onClick={() => !isLoading && handleAction(id)}
                            style={{
                                border: '1px solid var(--border)',
                                padding: '15px',
                                borderRadius: '8px',
                                cursor: isLoading ? 'wait' : 'pointer',
                                background: slots[id] ? 'var(--surface-active)' : 'transparent',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.6 : 1
                            }}
                            onMouseEnter={e => !isLoading && (e.currentTarget.style.borderColor = 'var(--primary)')}
                            onMouseLeave={e => !isLoading && (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                            <div style={{ textAlign: 'left', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: slots[id] ? 'var(--primary)' : 'var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                    color: '#fff'
                                }}>
                                    {id}
                                </div>
                                <div style={{ flex: 1 }}>
                                    {slots[id] ? (
                                        <>
                                            <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{slots[id]?.teamName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {slots[id]?.seasonPh} • {slots[id]?.date}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Empty Slot</div>
                                    )}
                                </div>
                            </div>

                            {slots[id] && (
                                <button
                                    onClick={(e) => !isLoading && handleDelete(id, e)}
                                    style={{ background: '#e74c3c', color: '#fff', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={onClose} disabled={isLoading} style={{
                    marginTop: '25px', padding: '12px 24px',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                    opacity: isLoading ? 0.5 : 1
                }}>
                    Close
                </button>
            </div>
        </div>
    );
}
