import React from 'react';

interface MessageModalProps {
    title?: string;
    message: string;
    onClose: () => void;
    type?: 'info' | 'error' | 'success';
}

export const MessageModal: React.FC<MessageModalProps> = ({ title, message, onClose, type = 'info' }) => {
    const isError = type === 'error';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', zIndex: 4000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }} onClick={(e) => {
            // Optional: Close on backdrop click
            // onClose();
        }}>
            <div style={{
                background: 'var(--surface)', padding: '30px', borderRadius: '16px',
                width: '90%', maxWidth: '400px',
                border: isError ? '1px solid #e74c3c' : '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: 'var(--text)',
                textAlign: 'center',
                animation: 'fadeIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>

                <h3 style={{ marginTop: 0, marginBottom: '15px', color: isError ? '#e74c3c' : 'var(--text)' }}>
                    {title || (isError ? 'Error' : 'Notice')}
                </h3>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.5' }}>
                    {message}
                </p>

                <button
                    onClick={onClose}
                    style={{
                        padding: '12px 30px',
                        background: isError ? '#e74c3c' : 'var(--primary)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                >
                    OK
                </button>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};
