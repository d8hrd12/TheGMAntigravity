import type { Player, Position } from '../models/Player';

const posNum: Record<Position, number> = { 'PG': 1, 'SG': 2, 'SF': 3, 'PF': 4, 'C': 5 };

export function canPlayPosition(naturalPos: Position, targetPos: Position): boolean {
    const diff = Math.abs(posNum[naturalPos] - posNum[targetPos]);
    return diff <= 1;
}

export function findValidStartingLineup(playersWithOvr: any[]): any[] {
    // playersWithOvr is sorted by OVR descending
    // We want to find the highest total OVR lineup of 5 players that can fill PG, SG, SF, PF, C
    
    // We can use a simple recursive search. Since we want highest OVR, we try picking the best players first.
    // Actually, just loop through all combinations of 5 players? N choose 5 is large if N=15. 15C5 = 3003 combinations.
    // That's tiny! We can just generate all combinations, filter valid ones, and take the one with max OVR.
    
    const validPositions = ['PG', 'SG', 'SF', 'PF', 'C'] as Position[];
    
    // Check if a group of 5 players can cover all 5 positions
    function canCover(group: any[]): boolean {
        const used = [false, false, false, false, false]; // PG, SG, SF, PF, C
        
        function backtrack(idx: number): boolean {
            if (idx === 5) return true;
            const player = group[idx];
            for (let i = 0; i < 5; i++) {
                if (!used[i] && canPlayPosition(player.position, validPositions[i])) {
                    used[i] = true;
                    if (backtrack(idx + 1)) return true;
                    used[i] = false;
                }
            }
            return false;
        }
        return backtrack(0);
    }

    let bestLineup: any[] = [];
    let bestOvr = -1;

    // Fast check: Can the top 5 cover it?
    if (playersWithOvr.length >= 5 && canCover(playersWithOvr.slice(0, 5))) {
        return playersWithOvr.slice(0, 5);
    }

    // Generate combinations of 5 from the top 10 (usually enough to find a valid lineup)
    // to keep it fast. If we can't find in top 10, try all 15.
    const searchPool = playersWithOvr.slice(0, 12);
    
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

    const combos = getCombinations(searchPool, 5);
    for (const combo of combos) {
        if (canCover(combo)) {
            const totalOvr = combo.reduce((sum, p) => sum + p.calculatedOvr, 0);
            if (totalOvr > bestOvr) {
                bestOvr = totalOvr;
                bestLineup = combo;
            }
        }
    }

    // Fallback if no valid combo found (extremely rare, e.g. team has 12 centers)
    if (bestLineup.length === 0) {
        // Just take the best player per position rigidly
        const fallback: any[] = [];
        const usedIds = new Set();
        for (const pos of validPositions) {
            let p = playersWithOvr.find(p => p.position === pos && !usedIds.has(p.id));
            if (!p) p = playersWithOvr.find(p => !usedIds.has(p.id)); // absolute fallback
            if (p) {
                fallback.push(p);
                usedIds.add(p.id);
            }
        }
        return fallback;
    }

    return bestLineup;
}
