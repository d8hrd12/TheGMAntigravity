import type { Coach, PlayingStyle } from '../../models/Coach';
import type { TeamStrategy } from '../simulation/TacticsTypes';
import { generateUUID } from '../../utils/uuid';

const FIRST_NAMES = [
    'Gregg', 'Erik', 'Steve', 'Doc', 'Tyronn', 'Mike', 'Nick', 'Joe', 'Monty', 'Jason',
    'Ime', 'Chris', 'Rick', 'Will', 'Mark', 'Taylor', 'Quin', 'Darvin', 'Charles', 'Jamahl',
    'Frank', 'Billy', 'Tom', 'JB', 'Wes', 'Adrian', 'Darko', 'Kevin', 'Chauncey', 'Michael',
    'Becky', 'Kenny', 'Steve', 'Jacque', 'Willie', 'Sam', 'Stephen', 'Rick', 'Luke', 'Alvin',
    'Dwane', 'Terry', 'Dave', 'Brett', 'Scott', 'Stan', 'Jeff', 'David', 'Lloyd', 'James'
];

const LAST_NAMES = [
    'Popovich', 'Spoelstra', 'Kerr', 'Rivers', 'Lue', 'Brown', 'Nurse', 'Mazzulla', 'Williams', 'Kidd',
    'Udoka', 'Finch', 'Carlisle', 'Hardy', 'Daigneault', 'Jenkins', 'Snyder', 'Ham', 'Lee', 'Mosley',
    'Vogel', 'Donovan', 'Thibodeau', 'Bickerstaff', 'Unseld', 'Griffin', 'Rajakovic', 'Young', 'Billups', 'Malone',
    'Hammon', 'Atkinson', 'Silas', 'Vaughn', 'Green', 'Cassell', 'Silas', 'Gentry', 'Walton', 'Casey',
    'Stotts', 'Joerger', 'Brown', 'Brooks', 'Van Gundy', 'Hornacek', 'Blatt', 'Pierce', 'Borrego', 'Borrego'
];

const STYLES: PlayingStyle[] = [
    'Pace and Space',
    'Grit and Grind',
    'Triangle',
    'Dribble Drive',
    'Seven Seconds',
    'Princeton',
    'Defensive Wall'
];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCoach(teamId: string | null = null): Coach {
    // Determine Rating Tier
    const rand = Math.random();
    let minRating = 60;
    let maxRating = 85;

    if (rand > 0.90) { // Elite Coach
        minRating = 85;
        maxRating = 98;
    } else if (rand > 0.60) { // High Quality
        minRating = 75;
        maxRating = 88;
    }

    return {
        id: generateUUID(),
        firstName: FIRST_NAMES[randomInt(0, FIRST_NAMES.length - 1)],
        lastName: LAST_NAMES[randomInt(0, LAST_NAMES.length - 1)],
        rating: {
            offense: randomInt(minRating, maxRating),
            defense: randomInt(minRating, maxRating),
            talentDevelopment: randomInt(minRating, maxRating)
        },
        style: STYLES[randomInt(0, STYLES.length - 1)],
        teamId,
        contract: {
            salary: randomInt(3, 12) * 1000000,
            yearsRemaining: teamId ? randomInt(1, 5) : 0 // Free agents start with 0 years remaining? Or maybe 1?
        }
    };
}

export function generateInitialCoachPool(teamsCount: number, surplus: number = 20): Coach[] {
    const coaches: Coach[] = [];
    // Generate one for each team initially
    // Actually, startNewGame handles assigning them, so we just need a pool.
    for (let i = 0; i < teamsCount + surplus; i++) {
        coaches.push(generateCoach());
    }
    return coaches;
}

export function getTacticsForStyle(style: PlayingStyle): TeamStrategy {
    switch (style) {
        case 'Pace and Space':
            return { pace: 'Fast', offensiveFocus: 'Perimeter', defense: 'Switch' };
        case 'Grit and Grind':
            return { pace: 'Slow', offensiveFocus: 'Inside', defense: 'Zone 2-3' };
        case 'Triangle':
            return { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' };
        case 'Dribble Drive':
            return { pace: 'Fast', offensiveFocus: 'Inside', defense: 'Man-to-Man' };
        case 'Seven Seconds':
            return { pace: 'Seven Seconds', offensiveFocus: 'Perimeter', defense: 'Switch' };
        case 'Princeton':
            return { pace: 'Normal', offensiveFocus: 'PickAndRoll', defense: 'Zone 3-2' };
        case 'Defensive Wall':
            return { pace: 'Very Slow', offensiveFocus: 'Balanced', defense: 'Drop' };
        default:
            return { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' };
    }
}
