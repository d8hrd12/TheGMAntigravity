import React from 'react';
import { useGame } from '../../store/GameContext';
import { BackButton } from '../ui/BackButton';

interface RetiredPlayersSummaryViewProps {
    onSelectPlayer?: (id: string) => void;
}

export const RetiredPlayersSummaryView: React.FC<RetiredPlayersSummaryViewProps> = ({ onSelectPlayer }) => {
    const { retiredPlayersHistory, continueFromRetirements, date } = useGame();

    // Get latest year
    const currentYear = date.getFullYear();
    const latestRetirements = retiredPlayersHistory.find((h: any) => h.year === currentYear);
    const retiredList = latestRetirements ? [...latestRetirements.players] : [];

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Retirement Ceremony</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Bid farewell to the class of {currentYear}</p>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {retiredList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '12px' }}>
                        No notable retirements this year.
                    </div>
                ) : (
                    retiredList.map((p: any) => (
                        <div key={p.id}
                            onClick={() => onSelectPlayer && onSelectPlayer(p.id)}
                            style={{
                                background: 'var(--surface)',
                                padding: '15px 20px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>
                                    {p.position}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{p.firstName} {p.lastName}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Retired at Age {p.ageAtRetirement}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={continueFromRetirements}
                    className="btn-primary"
                    style={{ padding: '15px 40px', fontSize: '1.2rem' }}
                >
                    Proceed to Resigning Period &rarr;
                </button>
            </div>
        </div>
    );
};
