import { readFileSync } from 'fs';
// We don't have the user's localStorage, but we can look at the default roters if we need to.
// Actually, I can use the same import strategy with MatchEngineII to just analyze the BASE_SUCCESS logic.
import { BASE_SUCCESS, calculateAdvantageMargin, calculateShotQuality, calculateFinalMakeProb } from '../features/simulation/PossessionEngine';

console.log('Rim 99:', BASE_SUCCESS.RIM(99));
console.log('Rim 50:', BASE_SUCCESS.RIM(50));
console.log('Three 99:', BASE_SUCCESS.THREE(99));
console.log('Three 50:', BASE_SUCCESS.THREE(50));
console.log('Three 80:', BASE_SUCCESS.THREE(80));

