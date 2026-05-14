import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, Shield, Upload, AlertCircle } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { motion } from 'framer-motion';

interface CreateTeamViewProps {
    onBack: () => void;
}

const extractDominantColor = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve('#FF5F1F'); 
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 40) {
                const alpha = data[i + 3];
                if (alpha > 200) {
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
                const toHex = (c: number) => {
                    const hex = c.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                };
                resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
            } else {
                resolve('#FF5F1F');
            }
        };
        img.onerror = () => resolve('#FF5F1F');
    });
};

export const CreateTeamView: React.FC<CreateTeamViewProps> = ({ onBack }) => {
    const { startNewGame } = useGame();
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
            if (file.size > 1000000) { 
                setError("Image too large. Please use an image under 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result as string;
                setLogo(result);
                setError(null);
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
        setTimeout(() => {
            try {
                startNewGame('31', 'Medium', {
                    city, name, division,
                    logo: logo || undefined,
                    primaryColor: extractedColor || undefined
                });
            } catch (err) {
                setError("Failed to create team. Please try again.");
                setIsSubmitting(false);
            }
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100dvh',
            width: '100vw',
            position: 'relative',
            backgroundColor: '#000',
            backgroundImage: 'url("/assets/start_career_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 20px',
            overflowX: 'hidden'
        }}>
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95))',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px' }}>
                <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    style={{
                        background: 'var(--bg-card-hover)',
                        border: '1px solid var(--border-color)',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '40px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    <ArrowLeft size={18} /> Back
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-2px', textTransform: 'uppercase', margin: 0 }}>
                        Create Your <span style={{ color: extractedColor || '#FF5F1F' }}>Legacy</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px', fontWeight: 500 }}>
                        Define your franchise identity and join the elite.
                    </p>
                </motion.div>

                <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        padding: '40px',
                        borderRadius: '30px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '120px', height: '120px', 
                                background: 'var(--bg-card-hover)',
                                borderRadius: '30px', margin: '0 auto 15px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px dashed rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}>
                            {logo ? (
                                <img src={logo} alt="Team Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <Upload size={28} color="rgba(255,255,255,0.4)" />
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>Upload Logo</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />
                        </motion.div>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '12px', padding: '12px', color: '#FF3B30', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Athens" style={{ width: '100%', padding: '14px 18px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>Team Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spartans" style={{ width: '100%', padding: '14px 18px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>Conference / Division</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {divisions.map(div => (
                                <button
                                    key={div}
                                    type="button"
                                    onClick={() => setDivision(div)}
                                    style={{
                                        padding: '12px 5px',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: division === div ? (extractedColor || '#FF5F1F') : 'var(--border-color)',
                                        background: division === div ? (extractedColor || '#FF5F1F') : 'rgba(255,255,255,0.03)',
                                        color: division === div ? 'white' : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        transition: 'all 0.2s',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {div}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!name || !city || isSubmitting}
                        style={{
                            marginTop: '20px',
                            padding: '18px',
                            background: (!name || !city || isSubmitting) ? 'var(--bg-card-hover)' : `linear-gradient(135deg, ${extractedColor || '#FF5F1F'} 0%, #E64A19 100%)`,
                            color: (!name || !city) ? 'rgba(255,255,255,0.2)' : 'white',
                            border: 'none',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            cursor: (!name || !city || isSubmitting) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: (!name || !city) ? 'none' : `0 10px 30px ${extractedColor ? extractedColor + '44' : 'rgba(255, 95, 31, 0.3)'}`
                        }}
                    >
                        {isSubmitting ? 'Initializing...' : (
                            <>
                                <CheckCircle size={22} /> Create Franchise
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};
