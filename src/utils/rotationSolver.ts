import type { Player, Position } from '../models/Player';

const posNum: Record<Position, number> = { 'PG': 1, 'SG': 2, 'SF': 3, 'PF': 4, 'C': 5 };

/**
 * Checks if a player can play a specific target position.
 * Logic: Natural position, secondary position, or adjacent position (diff <= 1).
 */
export function canPlayPosition(player: Player, targetPos: Position): boolean {
    if (player.position === targetPos) return true;
    if (player.secondaryPosition === targetPos) return true;
    
    // Tightened: Only allow adjacent if it's within 1 slot.
    // This allows PG to play SG, C to play PF, etc.
    const diff = Math.abs(posNum[player.position] - posNum[targetPos]);
    return diff <= 1;
}

/**
 * Validates if a group of 5 players can cover all 5 standard basketball positions.
 * Returns the valid assignment if found.
 */
export function validateLineup(players: Player[]): { valid: boolean; assignment: Player[] | null; missing: Position[] } {
    if (players.length !== 5) return { valid: false, assignment: null, missing: [] };
    
    const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const assignment = new Array(5).fill(null);
    const used = new Array(5).fill(false);

    function canAssign(idx: number): boolean {
        if (idx === 5) return true;
        
        for (let i = 0; i < 5; i++) {
            if (!used[i] && canPlayPosition(players[idx], positions[i])) {
                used[i] = true;
                assignment[i] = players[idx];
                if (canAssign(idx + 1)) return true;
                used[i] = false;
                assignment[i] = null;
            }
        }
        return false;
    }

    const valid = canAssign(0);
    if (!valid) {
        return { valid: false, assignment: null, missing: positions };
    }

    return { valid: true, assignment, missing: [] };
}

/**
 * Finds the best 5 players that can form a valid starting lineup (PG, SG, SF, PF, C).
 * Returns the players in that specific order.
 */
export function findValidStartingLineup(playersWithOvr: any[]): any[] {
    const validPositions = ['PG', 'SG', 'SF', 'PF', 'C'] as Position[];
    
    function getAssignment(group: any[]): any[] | null {
        const assignment = new Array(5).fill(null);
        const used = new Array(5).fill(false);

        function backtrack(idx: number): boolean {
            if (idx === 5) return true;
            const player = group[idx];
            for (let i = 0; i < 5; i++) {
                if (!used[i] && canPlayPosition(player, validPositions[i])) {
                    used[i] = true;
                    assignment[i] = player;
                    if (backtrack(idx + 1)) return true;
                    used[i] = false;
                    assignment[i] = null;
                }
            }
            return false;
        }

        if (backtrack(0)) return assignment;
        return null;
    }

    let bestAssignment: any[] | null = null;
    let bestOvr = -1;

    // 1. Try top 5 first
    if (playersWithOvr.length >= 5) {
        const top5 = playersWithOvr.slice(0, 5);
        const assignment = getAssignment(top5);
        if (assignment) return assignment;
    }

    // 2. Search combinations in top 12 for best OVR (widen pool slightly for flexibility)
    const searchPool = playersWithOvr.slice(0, 12);
    const combos = getCombinations(searchPool, 5);
    
    for (const combo of combos) {
        const assignment = getAssignment(combo);
        if (assignment) {
            const totalOvr = combo.reduce((sum, p) => sum + (p.calculatedOvr || p.overall), 0);
            if (totalOvr > bestOvr) {
                bestOvr = totalOvr;
                bestAssignment = assignment;
            }
        }
    }

    // 3. Fallback: pick best per position strictly
    if (!bestAssignment) {
        const fallback = new Array(5).fill(null);
        const usedIds = new Set();
        
        validPositions.forEach((pos, i) => {
            let p = playersWithOvr.find(p => p.position === pos && !usedIds.has(p.id));
            if (!p) p = playersWithOvr.find(p => p.secondaryPosition === pos && !usedIds.has(p.id));
            if (!p) p = playersWithOvr.find(p => canPlayPosition(p, pos) && !usedIds.has(p.id));
            if (!p) p = playersWithOvr.find(p => !usedIds.has(p.id));
            
            if (p) {
                fallback[i] = p;
                usedIds.add(p.id);
            }
        });
        return fallback.filter(p => p !== null);
    }

    return bestAssignment;
}

function getCombinations(arr: any[], k: number): any[][] {
    const results: any[][] = [];
    function helper(start: number, combo: any[]) {
        if (combo.length === k) {
            results.push([...combo]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            helper(i + 1, combo);
            combo.pop();
        }
    }
    helper(0, []);
    return results;
}

