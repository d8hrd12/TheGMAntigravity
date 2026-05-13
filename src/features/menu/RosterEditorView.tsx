import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Save, ArrowLeft, Users, Trophy, Edit2, ChevronRight, Check, X, Filter, Globe, Star } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import type { Player, PlayerAttributes, Position } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';

interface RosterEditorViewProps {
    onBack: () => void;
}

type EditorStep = 'league' | 'team' | 'player';

export const RosterEditorView: React.FC<RosterEditorViewProps> = ({ onBack }) => {
    const { players, teams, updatePlayerAttribute, seedDefaultRosters } = useGame();
    const [step, setStep] = useState<EditorStep>('league');
    const [selectedLeague, setSelectedLeague] = useState<'NBA' | 'EURO' | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<Player> | null>(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        seedDefaultRosters();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [seedDefaultRosters]);

    const filteredTeams = useMemo(() => {
        if (!selectedLeague) return [];
        if (selectedLeague === 'NBA') {
            return teams.filter(t => t.conference === 'West' || t.conference === 'East');
        } else {
            return teams.filter(t => t.conference === 'EuroLeague' || t.conference === 'EuroCup');
        }
    }, [teams, selectedLeague]);

    const filteredPlayers = useMemo(() => {
        if (!selectedTeamId) return [];
        let result = players.filter(p => p.teamId === selectedTeamId);
        if (searchQuery.trim()) {
            const low = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.firstName.toLowerCase().includes(low) || 
                p.lastName.toLowerCase().includes(low)
            );
        }
        return result.sort((a, b) => calculateOverall(b) - calculateOverall(a));
    }, [players, selectedTeamId, searchQuery]);

    const handleBack = () => {
        if (step === 'player') setStep('team');
        else if (step === 'team') setStep('league');
        else onBack();
    };

    const handleStartEdit = (player: Player) => {
        setEditingPlayerId(player.id);
        setEditValues({ ...player });
    };

    const handleSaveEdit = () => {
        if (!editingPlayerId || !editValues) return;
        Object.entries(editValues).forEach(([key, value]) => {
            if (key === 'attributes') {
                Object.entries(value as PlayerAttributes).forEach(([attrKey, attrVal]) => {
                    updatePlayerAttribute(editingPlayerId, `attributes.${attrKey}`, attrVal);
                });
            } else {
                updatePlayerAttribute(editingPlayerId, key, value);
            }
        });
        setEditingPlayerId(null);
        setEditValues(null);
    };

    const handleAttributeChange = (key: keyof PlayerAttributes, val: number) => {
        if (!editValues || !editValues.attributes) return;
        const newVal = Math.max(0, Math.min(99, val));
        setEditValues({
            ...editValues,
            attributes: { ...editValues.attributes, [key]: newVal }
        });
    };

    const currentTeam = teams.find(t => t.id === selectedTeamId);

    return (
        <div style={{
            height: '100dvh',
            width: '100vw',
            background: 'url("/assets/start_career_bg.png") center/cover fixed',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'fixed',
            inset: 0,
            zIndex: 1000
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.98) 100%)', zIndex: 0 }} />

            {/* Cinematic Header */}
            <header style={{
                position: 'relative',
                zIndex: 10,
                padding: isMobile ? '20px' : '40px 60px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '15px' : '30px'
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBack}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        width: isMobile ? '40px' : '50px',
                        height: isMobile ? '40px' : '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={isMobile ? 20 : 24} />
                </motion.button>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.2rem' : '2rem', fontWeight: 950, letterSpacing: '-1px', margin: 0, textTransform: 'uppercase' }}>
                        {step === 'league' ? 'Select League' : step === 'team' ? (selectedLeague === 'NBA' ? 'NBA Teams' : 'Euro Teams') : currentTeam?.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ color: '#FF5F1F', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase' }}>ROSTER EDITOR</span>
                        {step !== 'league' && (
                            <>
                                <ChevronRight size={10} color="rgba(255,255,255,0.2)" />
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>{selectedLeague}</span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', padding: isMobile ? '20px' : '40px 60px' }}>
                <AnimatePresence mode="wait">
                    {step === 'league' && (
                        <motion.div
                            key="league-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', maxWidth: '800px', margin: '0 auto' }}
                        >
                            <LeagueCard 
                                title="NBA" 
                                subtitle="American Basketball" 
                                icon={<Trophy size={40} />} 
                                onClick={() => { setSelectedLeague('NBA'); setStep('team'); }} 
                            />
                            <LeagueCard 
                                title="EURO" 
                                subtitle="International Competition" 
                                icon={<Globe size={40} />} 
                                onClick={() => { setSelectedLeague('EURO'); setStep('team'); }} 
                                color="#3498db"
                            />
                        </motion.div>
                    )}

                    {step === 'team' && (
                        <motion.div
                            key="team-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}
                        >
                            {filteredTeams.map(team => (
                                <TeamCard 
                                    key={team.id} 
                                    team={team} 
                                    onClick={() => { setSelectedTeamId(team.id); setStep('player'); }} 
                                />
                            ))}
                        </motion.div>
                    )}

                    {step === 'player' && (
                        <motion.div
                            key="player-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                        >
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                padding: '12px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <Search size={20} color="rgba(255,255,255,0.3)" />
                                <input
                                    type="text"
                                    placeholder="Search player by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1rem', fontWeight: 600, width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {filteredPlayers.map(player => (
                                    <PlayerItem 
                                        key={player.id} 
                                        player={player} 
                                        onClick={() => handleStartEdit(player)} 
                                        isMobile={isMobile}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingPlayerId && editValues && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '30px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0 }}>{editValues.firstName} {editValues.lastName}</h2>
                                    <span style={{ fontSize: '0.7rem', color: '#FF5F1F', fontWeight: 900 }}>OVR {calculateOverall(editValues as Player)} • {editValues.position}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => { setEditingPlayerId(null); setEditValues(null); }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700 }}>Cancel</button>
                                    <button onClick={handleSaveEdit} style={{ padding: '10px 25px', background: '#FF5F1F', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 900 }}>Save</button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <Section title="Identity & Team">
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <EditField label="First Name" value={editValues.firstName || ''} onChange={(v: string) => setEditValues({ ...editValues, firstName: v })} />
                                        <EditField label="Last Name" value={editValues.lastName || ''} onChange={(v: string) => setEditValues({ ...editValues, lastName: v })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <EditField label="Age" type="number" value={editValues.age || 0} onChange={(v: string) => setEditValues({ ...editValues, age: parseInt(v) })} />
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '5px' }}>Position</label>
                                            <select 
                                                value={editValues.position} 
                                                onChange={(e) => setEditValues({ ...editValues, position: e.target.value as Position })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontWeight: 700 }}
                                            >
                                                {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '5px' }}>Current Team</label>
                                        <select 
                                            value={editValues.teamId} 
                                            onChange={(e) => setEditValues({ ...editValues, teamId: e.target.value })}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontWeight: 700 }}
                                        >
                                            {teams.sort((a,b) => a.name.localeCompare(b.name)).map(t => (
                                                <option key={t.id} value={t.id}>{t.city} {t.name} ({t.conference})</option>
                                            ))}
                                            <option value="">Free Agent</option>
                                        </select>
                                    </div>
                                </Section>

                                <Section title="Offense & Scoring">
                                    <AttributeSlider label="Finishing" value={editValues.attributes?.finishing || 0} onChange={(v: number) => handleAttributeChange('finishing', v)} />
                                    <AttributeSlider label="Mid Range" value={editValues.attributes?.midRange || 0} onChange={(v: number) => handleAttributeChange('midRange', v)} />
                                    <AttributeSlider label="3PT Shot" value={editValues.attributes?.threePointShot || 0} onChange={(v: number) => handleAttributeChange('threePointShot', v)} />
                                    <AttributeSlider label="Free Throw" value={editValues.attributes?.freeThrow || 0} onChange={(v: number) => handleAttributeChange('freeThrow', v)} />
                                </Section>

                                <Section title="Playmaking & IQ">
                                    <AttributeSlider label="Playmaking" value={editValues.attributes?.playmaking || 0} onChange={(v: number) => handleAttributeChange('playmaking', v)} />
                                    <AttributeSlider label="Ball Handling" value={editValues.attributes?.ballHandling || 0} onChange={(v: number) => handleAttributeChange('ballHandling', v)} />
                                    <AttributeSlider label="Basketball IQ" value={editValues.attributes?.basketballIQ || 0} onChange={(v: number) => handleAttributeChange('basketballIQ', v)} />
                                </Section>

                                <Section title="Defense">
                                    <AttributeSlider label="Interior Def" value={editValues.attributes?.interiorDefense || 0} onChange={(v: number) => handleAttributeChange('interiorDefense', v)} />
                                    <AttributeSlider label="Perimeter Def" value={editValues.attributes?.perimeterDefense || 0} onChange={(v: number) => handleAttributeChange('perimeterDefense', v)} />
                                    <AttributeSlider label="Stealing" value={editValues.attributes?.stealing || 0} onChange={(v: number) => handleAttributeChange('stealing', v)} />
                                    <AttributeSlider label="Blocking" value={editValues.attributes?.blocking || 0} onChange={(v: number) => handleAttributeChange('blocking', v)} />
                                </Section>

                                <Section title="Rebounding & Phys">
                                    <AttributeSlider label="Off. Rebound" value={editValues.attributes?.offensiveRebound || 0} onChange={(v: number) => handleAttributeChange('offensiveRebound', v)} />
                                    <AttributeSlider label="Def. Rebound" value={editValues.attributes?.defensiveRebound || 0} onChange={(v: number) => handleAttributeChange('defensiveRebound', v)} />
                                    <AttributeSlider label="Athleticism" value={editValues.attributes?.athleticism || 0} onChange={(v: number) => handleAttributeChange('athleticism', v)} />
                                </Section>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LeagueCard = ({ title, subtitle, icon, onClick, color = '#FF5F1F' }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '30px',
            padding: '50px 30px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
        }}
    >
        <div style={{ color }}>{icon}</div>
        <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 950, margin: 0, color }}>{title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px' }}>{subtitle}</p>
        </div>
    </motion.div>
);

const TeamCard = ({ team, onClick }: any) => (
    <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}
    >
        <div style={{ width: '40px', height: '40px', background: team.colors?.primary, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.7rem' }}>
            {team.abbreviation}
        </div>
        <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>{team.city}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{team.name}</p>
        </div>
    </motion.div>
);

const PlayerItem = ({ player, onClick, isMobile }: any) => (
    <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}
    >
        <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>{player.firstName} {player.lastName}</h4>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '2px' }}>
                {player.position} • AGE {player.age} • OVR {calculateOverall(player)}
            </div>
        </div>
        <Edit2 size={16} color="#FF5F1F" />
    </motion.div>
);

const Section = ({ title, children }: any) => (
    <div>
        <h3 style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>{children}</div>
    </div>
);

const EditField = ({ label, value, onChange, type = "text" }: any) => (
    <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontWeight: 700, outline: 'none' }}
        />
    </div>
);

const AttributeSlider = ({ label, value, onChange }: any) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{label}</label>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: value > 80 ? '#FF5F1F' : '#fff' }}>{Math.round(value)}</span>
        </div>
        <input
            type="range"
            min="0"
            max="99"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#FF5F1F', cursor: 'pointer' }}
        />
    </div>
);
