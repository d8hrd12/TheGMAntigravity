import { calculateTendencies } from '../utils/playerUtils';
import { generatePlayer } from '../features/player/playerGenerator';

const jokic = generatePlayer(undefined, 'starter');
jokic.firstName = 'Jokic';
jokic.position = 'C';
jokic.attributes.playmaking = 96;
jokic.attributes.midRange = 98;
jokic.attributes.finishing = 89;
jokic.attributes.threePointShot = 86;
jokic.attributes.basketballIQ = 89;
jokic.attributes.ballHandling = 70;
jokic.overall = 95;

const tendencies = calculateTendencies(jokic, 36, []);
console.log('Jokic Tendencies:', tendencies);
