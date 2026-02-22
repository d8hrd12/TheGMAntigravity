import { calculateTendencies } from '../utils/playerUtils';
import { generatePlayer } from '../features/player/playerGenerator';

const p = generatePlayer(undefined, 'starter');
p.firstName = 'Giannis';
p.position = 'PF';
p.overall = 90;
p.attributes.finishing = 91;
p.attributes.midRange = 84;
p.attributes.threePointShot = 52;
p.attributes.freeThrow = 60;
p.attributes.playmaking = 86;
p.attributes.basketballIQ = 96;
p.attributes.ballHandling = 84;
p.attributes.athleticism = 89;

console.log('Giannis Baseline Tendencies (38 mins):');
console.log(calculateTendencies(p, 38, []));
