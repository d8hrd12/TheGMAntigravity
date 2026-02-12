import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, Shield, Upload, AlertCircle } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { BackButton } from '../ui/BackButton';

interface CreateTeamViewProps {
    onBack: () => void;
}

// Check for color extraction support
// Helper to extract dominant color from image
const extractDominantColor = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve('#e74c3c'); // Default fallback
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0, count = 0;

            // Simple average for now (can be improved to k-means if needed)
            // Sampling every 10th pixel for performance
            for (let i = 0; i < data.length; i += 40) {
                const alpha = data[i + 3];
                if (alpha > 200) { // Ignore transparent pixels
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }

            if (count > 0) {
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                // Convert RGB to Hex
                const toHex = (c: number) => {
                    const hex = c.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                };
                const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                resolve(hexColor);
            } else {
                resolve('#e74c3c'); // Fallback
            }
        };
        img.onerror = () => resolve('#e74c3c');
    });
};

export const CreateTeamView: React.FC<CreateTeamViewProps> = ({ onBack }) => {
    const { startCustomGame } = useGame();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [division, setDivision] = useState<string>('Atlantic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [extractedColor, setExtractedColor] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const divisions = [
        'Atlantic', 'Central', 'Southeast',
        'Northwest', 'Pacific', 'Southwest'
    ];

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                setError("Image too large. Please use an image under 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result as string;
                setLogo(result);
                setError(null);

                // Extract color
                try {
                    const color = await extractDominantColor(result);
                    setExtractedColor(color);
                } catch (e) {
                    console.warn("Color extraction failed", e);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name || !city) return;

        setIsSubmitting(true);

        try {
            // Run in timeout to allow UI to update to "Creating..."
            setTimeout(() => {
                try {
                    startCustomGame(city, name, division, logo || undefined, extractedColor || undefined);
                    // Verify success? Logic should redirect or we should manually call onBack?
                    // Actually, startCustomGame usually sets state that triggers a re-render in App root.
                    // But if MainMenu is still mounted, we might need to close it.
                    // However, Context updates typically trigger the App to switch views.
                } catch (err) {
                    console.error("Failed to create team:", err);
                    setError("Failed to create team. Please try again. " + err);
                    setIsSubmitting(false);
                }
            }, 100);
        } catch (err) {
            setError("An unexpected error occurred.");
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto',
            color: 'var(--text)',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <BackButton onClick={onBack} />
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Create Expansion Team</h1>
            </div>

            <form onSubmit={handleSubmit} style={{
                background: 'var(--surface)',
                padding: '25px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100px', height: '100px', background: 'var(--surface-active)',
                            borderRadius: '50%', margin: '0 auto 10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px dashed var(--text-secondary)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                        {logo ? (
                            <img src={logo} alt="Team Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <Upload size={24} color="var(--text-secondary)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Upload Logo</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleLogoUpload}
                        />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                        Welcome to the League, Owner. <br />
                        You will be the 31st franchise.
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(231, 76, 60, 0.2)',
                        border: '1px solid #e74c3c',
                        borderRadius: '8px',
                        padding: '10px',
                        color: '#ff6b6b',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Athens"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'var(--surface-active)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Team Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Spartans"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'var(--surface-active)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Conference / Division</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {divisions.map(div => (
                            <button
                                key={div}
                                type="button"
                                onClick={() => setDivision(div)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: division === div ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: division === div ? 'var(--primary)' : 'var(--surface-active)',
                                    color: division === div ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: division === div ? 600 : 400,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {div}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!name || !city || isSubmitting}
                    style={{
                        marginTop: '10px',
                        padding: '16px',
                        background: (!name || !city || isSubmitting) ? 'var(--surface-active)' : 'linear-gradient(135deg, var(--primary) 0%, #2980b9 100%)',
                        color: (!name || !city) ? 'var(--text-secondary)' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: (!name || !city || isSubmitting) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: (!name || !city) ? 'none' : '0 4px 15px rgba(52, 152, 219, 0.4)'
                    }}
                >
                    {isSubmitting ? 'Initializing Expansion...' : (
                        <>
                            <CheckCircle size={20} /> Create Franchise
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
