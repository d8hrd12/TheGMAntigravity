import React, { useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe';

interface NewGameSetupViewProps {
    onNext: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
    onBack: () => void;
}

export const NewGameSetupView: React.FC<NewGameSetupViewProps> = ({ onNext, onBack }) => {
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

    const handleNext = () => {
        onNext(difficulty);
    };

    // Swipe handlers
    const cycleDifficulty = (direction: -1 | 1) => {
        const levels = ['Easy', 'Medium', 'Hard'] as const;
        const idx = levels.indexOf(difficulty);
        const newIdx = (idx + direction + levels.length) % levels.length;
        setDifficulty(levels[newIdx]);
    };

    useSwipe({
        onSwipeLeft: () => cycleDifficulty(1),
        onSwipeRight: () => cycleDifficulty(-1)
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center', background: 'var(--background)', minHeight: '100vh', color: 'var(--text)' }}>
            <h1 style={{ marginBottom: '10px' }}>Career Settings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '50px' }}>Customize your basketball universe.</p>

            {/* Difficulty Carousel */}
            <div style={{ marginBottom: '40px', background: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' }}>
                <h3 style={{ marginBottom: '20px' }}>Difficulty Level</h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        onClick={() => {
                            const levels = ['Easy', 'Medium', 'Hard'] as const;
                            const idx = levels.indexOf(difficulty);
                            const newIdx = (idx - 1 + levels.length) % levels.length;
                            setDifficulty(levels[newIdx]);
                        }}
                        style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                    >
                        &larr;
                    </button>

                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div
                            style={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '2px solid var(--primary)',
                                background: 'var(--primary-light)',
                                transition: 'all 0.2s',
                                minHeight: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>{difficulty}</div>
                            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                {difficulty === 'Easy' && '+$20M Cash'}
                                {difficulty === 'Medium' && 'Standard Cash'}
                                {difficulty === 'Hard' && '-$15M Cash'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const levels = ['Easy', 'Medium', 'Hard'] as const;
                            const idx = levels.indexOf(difficulty);
                            const newIdx = (idx + 1) % levels.length;
                            setDifficulty(levels[newIdx]);
                        }}
                        style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                    >
                        &rarr;
                    </button>
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
                    {['Easy', 'Medium', 'Hard'].map((l) => (
                        <div key={l} style={{ width: '8px', height: '8px', borderRadius: '50%', background: difficulty === l ? 'var(--primary)' : 'var(--text-secondary)', opacity: difficulty === l ? 1 : 0.3 }} />
                    ))}
                </div>
            </div>

            {/* Toggles - Removed Love For The Game as per request */}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1rem',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '50px',
                        cursor: 'pointer'
                    }}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px var(--primary-glow)',
                        fontWeight: 'bold'
                    }}
                >
                    Select Team &rarr;
                </button>
            </div>
        </div>
    );
};
