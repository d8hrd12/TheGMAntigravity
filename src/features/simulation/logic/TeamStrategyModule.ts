import type { Team } from '../../../models/Team';
import type { Player } from '../../../models/Player';
import type { Contract } from '../../../models/Contract';
import { calculateOverall } from '../../../utils/playerUtils';
import { calculateTeamCapSpace } from '../../../utils/contractUtils';

// ----------------------------------------------------------------------------
// 1. TEAM IDENTITY & DIRECTION
// ----------------------------------------------------------------------------

export type TeamDirection = 'Contender' | 'PlayoffTeam' | 'RisingCore' | 'Rebuilding';

export const getTeamDirection = (team: Team, roster: Player[]): TeamDirection => {
    const totalGames = (team.wins || 0) + (team.losses || 0);
    const winPct = totalGames > 20 ? (team.wins || 0) / totalGames : 0.5; // Need sample size for strict win%

    // 1. Identify Core
    const top3 = roster.sort((a, b) => (b.overall || 0) - (a.overall || 0)).slice(0, 3);
    const avgAgeTop3 = top3.length > 0 ? top3.reduce((sum, p) => sum + p.age, 0) / top3.length : 25;
    const hasSuperstar = top3.some(p => (p.overall || 0) >= 90);
    const hasYoungStar = top3.some(p => (p.overall || 0) >= 85 && p.age <= 24);

    // 2. Classification Logic

    // CONTENDER: Winning now + Star Power
    if ((winPct >= 0.60 && hasSuperstar) || (winPct > 0.65)) return 'Contender';

    // RISING CORE: Young talent, decent performance
    if (avgAgeTop3 < 25 && hasYoungStar) return 'RisingCore';

    // PLAYOFF TEAM: Competent but maybe capped ceiling or older
    if (winPct >= 0.45 || (top3.length > 0 && calculateOverall(top3[0]) > 85)) return 'PlayoffTeam';

    // Default: Rebuilding
    return 'Rebuilding';
};

// ----------------------------------------------------------------------------
// 2. ROSTER ECOSYSTEM ANALYSIS
// ----------------------------------------------------------------------------

export interface RosterNeeds {
    primaryNeed: string;
    secondaryNeed: string;
    description: string;
    positionalGaps: string[];
}

export const analyzeRosterEcosystem = (roster: Player[]): RosterNeeds => {
    const depthChart: Record<string, Player[]> = { 'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': [] };
    roster.forEach(p => { if (depthChart[p.position]) depthChart[p.position].push(p); });

    // Sort by overall
    Object.keys(depthChart).forEach(pos => {
        depthChart[pos].sort((a, b) => calculateOverall(b) - calculateOverall(a));
    });

    const gaps: string[] = [];
    if (depthChart['PG'].length < 2) gaps.push('Point Guard Depth');
    if (depthChart['C'].length < 2) gaps.push('Center Depth');

    // Check Starter Quality
    let weakLink = '';
    let lowestStarterOvr = 100;

    Object.keys(depthChart).forEach(pos => {
        const starter = depthChart[pos][0];
        if (!starter || calculateOverall(starter) < 75) {
            gaps.push(`Starting ${pos}`);
            if (!starter || calculateOverall(starter) < lowestStarterOvr) {
                lowestStarterOvr = starter ? calculateOverall(starter) : 0;
                weakLink = pos;
            }
        }
    });

    // Archetype Analysis (Simplified)
    // Use attributes for shooting ability
    const shooters = roster.filter(p => (p.attributes.threePointShot || 0) > 75);
    // Need real stats. For now using position heuristic
    const bigs = [...depthChart['PF'], ...depthChart['C']];
    const ballHandlers = [...depthChart['PG'], ...depthChart['SG']];

    let primary = '';
    if (gaps.length > 0) primary = gaps[0];
    else primary = 'Talent Upgrade';

    return {
        primaryNeed: primary,
        secondaryNeed: gaps.length > 1 ? gaps[1] : 'Bench Depth',
        description: `Team lacks ${primary}.`,
        positionalGaps: gaps
    };
};


// ----------------------------------------------------------------------------
// 3. CAP TIMELINE & PLANNING
// ----------------------------------------------------------------------------

export interface CapOutlook {
    currentSpace: number;
    projectedSpaceNextYear: number;
    badContracts: Contract[];
    expiringCore: Player[];
}

export const getCapOutlook = (
    team: Team,
    roster: Player[],
    contracts: Contract[],
    salaryCap: number,
    currentYear: number
): CapOutlook => {
    const teamContracts = contracts.filter(c => c.teamId === team.id);
    const currentSpace = calculateTeamCapSpace(team, contracts, salaryCap);

    // Simple Projection: Add up contracts that exceed current year
    const nextYearCommitted = teamContracts
        .filter(c => c.yearsLeft > 1)
        .reduce((sum, c) => sum + c.amount, 0); // simplistic, usually amount changes but we use flat for now

    const projectedSpace = salaryCap - nextYearCommitted;

    // Bad Contracts: High cost, long term, low production (simplistic OVR check)
    const badContracts = teamContracts.filter(c => {
        const p = roster.find(x => x.id === c.playerId);
        if (!p) return false;
        return c.amount > 20000000 && c.yearsLeft >= 2 && calculateOverall(p) < 78;
    });

    // Expiring Core: Good players expiring this year
    const expiringCore = roster.filter(p => {
        const c = teamContracts.find(con => con.playerId === p.id);
        return c && c.yearsLeft === 1 && calculateOverall(p) > 80;
    });

    return {
        currentSpace,
        projectedSpaceNextYear: projectedSpace,
        badContracts,
        expiringCore
    };
};
