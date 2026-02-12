
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {posts.map((post) => (
                <div key={post.id} style={{
                    background: 'var(--surface)',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                    transition: 'background 0.2s',
                    cursor: 'default'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #1d428a, #c8102e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <User size={20} color="white" />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{post.displayName}</span>
                            {post.isVerified && <Verified size={14} color="#1d9bf0" fill="#1d9bf0" style={{ flexShrink: 0 }} />}
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{post.handle}</span>
                        </div>

                        <p style={{ margin: '4px 0 12px 0', fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text)', wordBreak: 'break-word' }}>
                            {post.content}
                        </p>

                        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
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
            ))}
        </div>
    );
};
