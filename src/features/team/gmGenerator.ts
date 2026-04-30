import { generateUUID } from '../../utils/uuid';
import type { AI_GM, GMPhilosophy } from '../../models/AI_GM';

const FIRST_NAMES = [
    'Daryl', 'Sam', 'Masai', 'Pat', 'Jerry', 'Danny', 'Brad', 'Bob', 'Rob', 'Sean',
    'Lawrence', 'James', 'Justin', 'Rafael', 'Monte', 'Arturas', 'Nico', 'Leon', 'Zach', 'Tim'
];

const LAST_NAMES = [
    'Morey', 'Presti', 'Ujiri', 'Riley', 'West', 'Ainge', 'Stevens', 'Myers', 'Pelinka', 'Marks',
    'Frank', 'Jones', 'Zanik', 'Stone', 'McNair', 'Karnisovas', 'Harrison', 'Rose', 'Kleiman', 'Connelly'
];

export function generateGM(overrides?: Partial<AI_GM>): AI_GM {
    const philosophy: GMPhilosophy[] = ['Win Now', 'Youth', 'Financial', 'Balanced'];
    const randomPhilosophy = philosophy[Math.floor(Math.random() * philosophy.length)];
    
    // Skill Distribution (Average around 70)
    const baseSkill = () => 50 + Math.floor(Math.random() * 40);
    
    const gm: AI_GM = {
        id: generateUUID(),
        name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
        age: 35 + Math.floor(Math.random() * 35),
        skills: {
            trading: baseSkill(),
            drafting: baseSkill(),
            negotiation: baseSkill(),
            reputation: baseSkill(),
            financials: baseSkill(),
        },
        philosophy: randomPhilosophy,
        experience: Math.floor(Math.random() * 20),
        history: [],
        tenureStartYear: 2025,
        jobSecurity: 80,
        ...overrides
    };

    // Tailor skills based on philosophy
    if (gm.philosophy === 'Win Now') {
        gm.skills.trading += 10;
        gm.skills.reputation += 10;
        gm.skills.financials -= 10;
    } else if (gm.philosophy === 'Youth') {
        gm.skills.drafting += 15;
        gm.skills.trading += 5;
    } else if (gm.philosophy === 'Financial') {
        gm.skills.financials += 20;
        gm.skills.reputation -= 10;
    }

    // Clamp skills
    Object.keys(gm.skills).forEach(key => {
        const k = key as keyof typeof gm.skills;
        gm.skills[k] = Math.max(0, Math.min(100, gm.skills[k]));
    });

    return gm;
}

export function initializeLeagueGMs(teamIds: string[]): AI_GM[] {
    const gms: AI_GM[] = [];
    
    // 1 GM per team
    teamIds.forEach(teamId => {
        gms.push(generateGM({ teamId, tenureStartYear: 2025 }));
    });
    
    // 5-10 Free Agent GMs
    const faCount = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < faCount; i++) {
        gms.push(generateGM({ teamId: undefined }));
    }
    
    return gms;
}
