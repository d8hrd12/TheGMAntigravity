import React from 'react';

interface ConfirmationModalProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title = 'Confirm Action',
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', zIndex: 4000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInOverlay 0.3s ease-out'
        }} onClick={onCancel}>
            <div style={{
                background: '#ffffff', 
                padding: '40px', 
                borderRadius: '32px',
                width: '90%', 
                maxWidth: '440px',
                border: '1px solid #eeeeee',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                color: '#111111',
                textAlign: 'center',
                animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>

                <h3 style={{ 
                    marginTop: 0, 
                    marginBottom: '16px', 
                    fontSize: '1.75rem', 
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: '#111111' 
                }}>
                    {title}
                </h3>

                <p style={{ 
                    color: '#8e8e93', 
                    marginBottom: '40px', 
                    lineHeight: '1.6',
                    fontSize: '1.1rem',
                    fontWeight: 500
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '16px 24px',
                            background: '#f2f2f7',
                            border: 'none',
                            color: '#111111',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 800,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '16px 24px',
                            background: isDestructive ? '#ff3b30' : '#111111',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 800,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};
