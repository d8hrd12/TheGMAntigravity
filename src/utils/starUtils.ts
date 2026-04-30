import type { Player } from '../models/Player';

export const calculateTeamBaseline = (teamPlayers: Player[]): number => {
    if (!teamPlayers || teamPlayers.length === 0) return 75; // Fallback baseline

    // Sort by overall descending
    // Note: p.overall is populated by calculateOverall in many places, 
    // but we should ensure we use the dynamic calculation if overall is missing.
    const sorted = [...teamPlayers].sort((a, b) => (b.overall || 75) - (a.overall || 75));
    
    // Take the top 8 players (core rotation) to establish the team's true quality
    const core = sorted.slice(0, 8);
    const sum = core.reduce((acc, p) => acc + (p.overall || 75), 0);
    
    return sum / core.length;
};

export const calculateStars = (playerOverall: number, teamBaseline: number): number => {
    const diff = playerOverall - teamBaseline;
    
    // 3.0 stars is an "average" player for this specific team's core rotation.
    // Every 8 OVR difference equals 1.0 star (4 OVR = 0.5 stars)
    const starShift = diff / 8.0; 
    let stars = 3.0 + starShift;

    // Clamp between 0.5 and 5.0
    stars = Math.max(0.5, Math.min(5.0, stars));

    // Round to nearest 0.5
    return Math.round(stars * 2) / 2;
};

// Formatting helper for generic use if needed
export const getStarString = (stars: number): string => {
    const full = Math.floor(stars);
    const hasHalf = stars % 1 !== 0;
    const starStr = '★'.repeat(full) + (hasHalf ? '½' : '');
    return starStr || '½'; // Fallback for 0 stars
};
