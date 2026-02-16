
import React from 'react';
import type { SocialMediaPost } from '../../models/SocialMediaPost';
import { Heart, MessageSquare, Repeat, Verified, User } from 'lucide-react';

interface PulseFeedProps {
    posts: SocialMediaPost[];
    onSelectPlayer?: (playerId: string) => void;
    onSelectTeam?: (teamId: string) => void;
}

export const PulseFeed: React.FC<PulseFeedProps> = ({ posts, onSelectPlayer, onSelectTeam }) => {
    if (posts.length === 0) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No signal on the pulse yet. Check back after some games!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-glass)', backdropFilter: 'blur(10px)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>

            {/* Sticky Header */}
            <div style={{
                padding: '12px 16px',
                background: 'rgba(29, 66, 138, 0.9)', // NBA Blue-ish
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <MessageSquare size={18} color="white" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>The Pulse</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                {posts.map((post) => {
                    // Avatar Color based on type
                    let avatarGradient = 'linear-gradient(45deg, #6b7280, #9ca3af)';
                    if (post.type === 'INSIDER') avatarGradient = 'linear-gradient(45deg, #7c3aed, #4f46e5)'; // Purple
                    if (post.type === 'PLAYER') avatarGradient = 'linear-gradient(45deg, #ea580c, #c2410c)'; // Orange
                    if (post.type === 'ANALYST') avatarGradient = 'linear-gradient(45deg, #059669, #047857)'; // Green

                    return (
                        <div key={post.id} style={{
                            background: 'var(--surface)',
                            padding: '15px',
                            display: 'flex',
                            gap: '12px',
                            transition: 'background 0.2s',
                            cursor: 'default',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                background: avatarGradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>
                                <User size={20} color="white" />
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', color: 'var(--text)' }}>{post.displayName}</span>
                                    {post.isVerified && <Verified size={15} color="#1d9bf0" fill="#1d9bf0" style={{ flexShrink: 0 }} />}
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{post.handle}</span>

                                    {/* Type Badge */}
                                    {post.type !== 'FAN' && (
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--text-secondary)',
                                            marginLeft: 'auto',
                                            fontWeight: 600
                                        }}>
                                            {post.type}
                                        </span>
                                    )}
                                </div>

                                <p style={{ margin: '4px 0 12px 0', fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                                    {post.content}
                                </p>

                                <div style={{ display: 'flex', gap: '24px', color: '#6b7280' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                        <MessageSquare size={16} />
                                        {Math.floor(post.retweets / 2)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                        <Repeat size={16} />
                                        {post.retweets}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                        <Heart size={16} />
                                        {post.likes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
                    End of Feed
                </div>
            </div>
        </div>
    );
};
