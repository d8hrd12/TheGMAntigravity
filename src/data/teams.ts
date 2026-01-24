import type { Team } from '../models/Team';

const RAW_TEAMS: Omit<Team, 'logo'>[] = [
    // WESTERN CONFERENCE
    {
        id: '1', name: 'Lakers', city: 'Los Angeles', abbreviation: 'LAL', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#552583', secondary: '#FDB927' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.8, ownerPatience: 40, marketSize: 'Large', rivalIds: ['16', '4', '2'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '2', name: 'Warriors', city: 'Golden State', abbreviation: 'GSW', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#1D428A', secondary: '#FFC72C' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.6, ownerPatience: 45, marketSize: 'Large', rivalIds: ['1', '14'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '3', name: 'Suns', city: 'Phoenix', abbreviation: 'PHX', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#1D1160', secondary: '#E56020' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.2, ownerPatience: 30, marketSize: 'Medium', rivalIds: ['1', '6'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '4', name: 'Clippers', city: 'Los Angeles', abbreviation: 'LAC', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#C8102E', secondary: '#1D428A' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.1, ownerPatience: 80, marketSize: 'Large', rivalIds: ['1'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '5', name: 'Kings', city: 'Sacramento', abbreviation: 'SAC', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#5A2D81', secondary: '#63727A' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.2, ownerPatience: 60, marketSize: 'Small', rivalIds: ['2'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '6', name: 'Mavericks', city: 'Dallas', abbreviation: 'DAL', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#00538C', secondary: '#B8C4CA' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.3, ownerPatience: 50, marketSize: 'Medium', rivalIds: ['15', '14'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '7', name: 'Grizzlies', city: 'Memphis', abbreviation: 'MEM', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#5D76A9', secondary: '#12173F' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.0, ownerPatience: 70, marketSize: 'Small', rivalIds: ['2'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '8', name: 'Nuggets', city: 'Denver', abbreviation: 'DEN', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#0E2240', secondary: '#FEC524' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.4, ownerPatience: 65, marketSize: 'Medium', rivalIds: ['9', '1'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '9', name: 'Timberwolves', city: 'Minnesota', abbreviation: 'MIN', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#0C2340', secondary: '#236192' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.1, ownerPatience: 55, marketSize: 'Medium', rivalIds: ['8'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '10', name: 'Pelicans', city: 'New Orleans', abbreviation: 'NOP', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#0C2340', secondary: '#85714D' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.0, ownerPatience: 60, marketSize: 'Small', rivalIds: ['11'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '11', name: 'Thunder', city: 'Oklahoma City', abbreviation: 'OKC', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#007AC1', secondary: '#EF3B24' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.2, ownerPatience: 85, marketSize: 'Small', rivalIds: ['12'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '12', name: 'Trail Blazers', city: 'Portland', abbreviation: 'POR', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#E03A3E', secondary: '#000000' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.0, ownerPatience: 60, marketSize: 'Medium', rivalIds: ['11'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '13', name: 'Jazz', city: 'Utah', abbreviation: 'UTA', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#002B5C', secondary: '#F9A01B' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.0, ownerPatience: 75, marketSize: 'Small', rivalIds: ['21', '14'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '14', name: 'Spurs', city: 'San Antonio', abbreviation: 'SAS', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#000000', secondary: '#C4CED4' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.3, ownerPatience: 90, marketSize: 'Medium', rivalIds: ['6', '15', '2'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '15', name: 'Rockets', city: 'Houston', abbreviation: 'HOU', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'West', colors: { primary: '#CE1141', secondary: '#000000' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.1, ownerPatience: 50, marketSize: 'Large', rivalIds: ['6', '14'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },

    // EASTERN CONFERENCE
    {
        id: '16', name: 'Celtics', city: 'Boston', abbreviation: 'BOS', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#007A33', secondary: '#BA9653' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.7, ownerPatience: 45, marketSize: 'Large', rivalIds: ['1', '19', '21'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '17', name: 'Bulls', city: 'Chicago', abbreviation: 'CHI', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#CE1141', secondary: '#000000' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.5, ownerPatience: 50, marketSize: 'Large', rivalIds: ['30', '21', '22'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '18', name: 'Bucks', city: 'Milwaukee', abbreviation: 'MIL', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#00471B', secondary: '#EEE1C6' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.4, ownerPatience: 60, marketSize: 'Medium', rivalIds: ['22', '16'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '19', name: '76ers', city: 'Philadelphia', abbreviation: 'PHI', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#006BB6', secondary: '#ED174C' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.5, ownerPatience: 35, marketSize: 'Large', rivalIds: ['16', '17', '21'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '20', name: 'Cavaliers', city: 'Cleveland', abbreviation: 'CLE', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#860038', secondary: '#FDBB30' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.1, ownerPatience: 60, marketSize: 'Medium', rivalIds: ['2', '1'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '21', name: 'Knicks', city: 'New York', abbreviation: 'NYK', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#006BB6', secondary: '#F58426' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.9, ownerPatience: 30, marketSize: 'Large', rivalIds: ['25', '19', '17', '16', '22'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '22', name: 'Heat', city: 'Miami', abbreviation: 'MIA', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#98002E', secondary: '#F9A01B' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.5, ownerPatience: 40, marketSize: 'Large', rivalIds: ['21', '17', '24'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '23', name: 'Hawks', city: 'Atlanta', abbreviation: 'ATL', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#C1D32F', secondary: '#26282A' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.1, ownerPatience: 55, marketSize: 'Medium', rivalIds: [],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '24', name: 'Raptors', city: 'Toronto', abbreviation: 'TOR', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#CE1141', secondary: '#000000' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.3, ownerPatience: 65, marketSize: 'Large', rivalIds: ['21', '19'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '25', name: 'Nets', city: 'Brooklyn', abbreviation: 'BKN', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#000000', secondary: '#FFFFFF' }, draftPicks: [], history: [],
        cash: 80000000, debt: 0, fanInterest: 1.2, ownerPatience: 50, marketSize: 'Large', rivalIds: ['21'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '26', name: 'Pacers', city: 'Indiana', abbreviation: 'IND', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#002D62', secondary: '#FDBB30' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.0, ownerPatience: 70, marketSize: 'Medium', rivalIds: ['20', '17'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '27', name: 'Wizards', city: 'Washington', abbreviation: 'WAS', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#E31837', secondary: '#002B5C' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.0, ownerPatience: 55, marketSize: 'Medium', rivalIds: [],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '28', name: 'Magic', city: 'Orlando', abbreviation: 'ORL', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#0077C0', secondary: '#C4CED4' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.0, ownerPatience: 75, marketSize: 'Medium', rivalIds: ['22'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '29', name: 'Hornets', city: 'Charlotte', abbreviation: 'CHA', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#00788C', secondary: '#1D1160' }, draftPicks: [], history: [],
        cash: 30000000, debt: 0, fanInterest: 1.0, ownerPatience: 50, marketSize: 'Medium', rivalIds: [],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
    {
        id: '30', name: 'Pistons', city: 'Detroit', abbreviation: 'DET', salaryCapSpace: 0, rosterIds: [], wins: 0, losses: 0, conference: 'East', colors: { primary: '#C8102E', secondary: '#1D428A' }, draftPicks: [], history: [],
        cash: 50000000, debt: 0, fanInterest: 1.1, ownerPatience: 45, marketSize: 'Medium', rivalIds: ['17'],
        financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
    },
];

// Helper to get official NBA logos from ESPN CDN
const getTeamLogo = (abbreviation: string) => {
    const abbrMap: Record<string, string> = {
        'LAL': 'lal', 'GSW': 'gs', 'PHX': 'phx', 'LAC': 'lac', 'SAC': 'sac',
        'DAL': 'dal', 'MEM': 'mem', 'DEN': 'den', 'MIN': 'min', 'NOP': 'no',
        'OKC': 'okc', 'POR': 'por', 'UTA': 'utah', 'SAS': 'sa', 'HOU': 'hou',
        'BOS': 'bos', 'CHI': 'chi', 'MIL': 'mil', 'PHI': 'phi', 'CLE': 'cle',
        'NYK': 'ny', 'MIA': 'mia', 'ATL': 'atl', 'TOR': 'tor', 'BKN': 'bkn',
        'IND': 'ind', 'WAS': 'wsh', 'ORL': 'orl', 'CHA': 'cha', 'DET': 'det'
    };
    const code = abbrMap[abbreviation] || abbreviation.toLowerCase();
    return `https://a.espncdn.com/i/teamlogos/nba/500/${code}.png`;
};

// Export teams with active logos
export const NBA_TEAMS: Team[] = RAW_TEAMS.map(t => ({
    ...t,
    logo: getTeamLogo(t.abbreviation)
}));
