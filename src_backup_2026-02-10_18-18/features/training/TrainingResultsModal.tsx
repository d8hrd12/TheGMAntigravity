import React from 'react';
import type { ProgressionResult } from '../../models/Training';

interface TrainingResultsModalProps {
    results: ProgressionResult[];
    onClose: () => void;
}

export const TrainingResultsModal: React.FC<TrainingResultsModalProps> = ({ results, onClose }) => {
    // Filter out results with no significant changes to reduce noise, if desired. 
    // For now, show all user players who improved or regressed meaningfully? 
    // Or just show all. User might want to see "+0" to know nothing happened.
    // Let's show all.

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000,
            padding: '20px'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '500px',
                maxHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                background: '#1a1a1a', // Darker background for contrast
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>Training Camp Results</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    {results.map((result, index) => (
                        <div key={result.playerId} style={{
                            padding: '16px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{result.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Focus: {result.focus}</span>
                                </div>
                                <div style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: result.overallChange > 0 ? '#2ecc71' : result.overallChange < 0 ? '#e74c3c' : '#bdc3c7'
                                }}>
                                    {result.overallChange > 0 ? '+' : ''}{result.overallChange} OVR
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {result.changes.length > 0 ? (
                                    result.changes.map(change => (
                                        <span key={change.attributeName} style={{
                                            fontSize: '0.85rem',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: change.delta > 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                            color: change.delta > 0 ? '#2ecc71' : '#e74c3c',
                                            border: `1px solid ${change.delta > 0 ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}`
                                        }}>
                                            {change.attributeName}: {change.delta > 0 ? '+' : ''}{change.delta}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>No significant attribute changes</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {results.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            No progression data available.
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                    <button
                        onClick={onClose}
                        className="btn-primary"
                        style={{ padding: '10px 24px', fontSize: '1rem' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
