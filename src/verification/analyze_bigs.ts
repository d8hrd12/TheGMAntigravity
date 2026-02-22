import { calculateTendencies } from '../utils/playerUtils';
import { generatePlayer } from '../features/player/playerGenerator';

const createProfile = (name: string, pos: string, ovr: number, shoot: number, pass: number, fin: number, mid: number, thr: number) => {
    const p = generatePlayer(undefined, ovr > 80 ? 'starter' : 'bench');
    p.firstName = name;
    p.position = pos as any;
    p.attributes.playmaking = pass;
    p.attributes.finishing = fin;
    p.attributes.midRange = mid;
    p.attributes.threePointShot = thr;
    p.overall = ovr;
    return p;
};

const giannis = createProfile('Giannis (Versatile PF)', 'PF', 90, 85, 86, 91, 84, 52);
const rudy = createProfile('Rudy G (Strict C)', 'C', 85, 70, 40, 95, 30, 25);
const jokic = createProfile('Jokic (Pass C)', 'C', 95, 95, 98, 90, 95, 80);
const embiid = createProfile('Embiid (Score C)', 'C', 94, 94, 65, 94, 96, 75);

console.log("--- TENDENCIES FOR BIG MEN (36 Mins) ---");
console.log(`${giannis.firstName}:`, calculateTendencies(giannis, 36, []));
console.log(`${rudy.firstName}:`, calculateTendencies(rudy, 36, []));
console.log(`${jokic.firstName}:`, calculateTendencies(jokic, 36, []));
console.log(`${embiid.firstName}:`, calculateTendencies(embiid, 36, []));

