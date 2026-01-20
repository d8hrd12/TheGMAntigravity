import type { Player } from '../../models/Player';
import { EventType } from './SimulationTypes';

export interface CommentaryContext {
    isThree?: boolean;
    isDunk?: boolean;
    isLayup?: boolean;
    distance?: 'RIM' | 'MID' | 'DEEP';
    timeRemaining?: number;
    scoreMargin?: number;
    quarter?: number;
}

export const CommentaryEngine = {
    generateCommentary: (type: EventType, player: Player, secondaryPlayer?: Player, ctx: CommentaryContext = {}): string => {
        const pName = player.lastName;
        const sName = secondaryPlayer ? secondaryPlayer.lastName : '';
        const isStar = player.overall > 88;
        const isClutch = (ctx.timeRemaining || 999) < 120 && Math.abs(ctx.scoreMargin || 10) < 5; // Last 2 mins, close game

        // HELPER: Select from array
        const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

        switch (type) {
            case EventType.POSSESSION_START:
                if (isClutch) return pick([
                    `Crunch time! ${pName} brings it up slowly.`,
                    `${pName} has the ball. Game on the line.`,
                    `Big possession here. ${pName} directing traffic.`
                ]);
                if (isStar) return pick([
                    `${pName} demands the ball and brings it up.`,
                    `The offense runs through ${pName}.`,
                    `${pName} looking to make something happen.`
                ]);
                return pick([
                    `${pName} brings the ball up.`,
                    `${pName} initiates the offense.`,
                    `${pName} crossing half court.`,
                    `${pName} sets up the play.`
                ]);

            case EventType.PASS:
                return pick([
                    `${pName} swings it to ${sName}.`,
                    `${pName} finds ${sName}.`,
                    `Ball movement to ${sName}.`,
                    `Nice pass by ${pName} to ${sName}.`,
                    `${pName} kicks it out to ${sName}.`
                ]);

            case EventType.DRIVE: // Custom type for action logs
                if (isStar) return pick([
                    `${pName} explodes to the rim!`,
                    `${pName} uses the screen and drives hard!`,
                    `${pName} decides to take it himself!`
                ]);
                return pick([
                    `${pName} drives to the basket.`,
                    `${pName} attacks the paint.`,
                    `${pName} puts the ball on the floor.`
                ]);

            case EventType.SCORE: // Make
                const suffix = sName ? `(Ast: ${sName})` : '';

                if (ctx.isThree) {
                    if (isClutch) return `${pName} FOR THE LEAD... BANG!! ${suffix}`;
                    if (isStar) return pick([
                        `${pName} from way downtown... YES!`,
                        `${pName} simply cannot miss! Three points!`,
                        `Hand down, man down! ${pName} hits the triple!`
                    ]) + " " + suffix;
                    return pick([
                        `${pName} for three... Got it!`,
                        `${pName} connects from deep.`,
                        `${pName} splashes the three.`,
                        `${pName} from the corner... Gold!`
                    ]) + " " + suffix;
                }
                if (ctx.isDunk) return pick([
                    `${pName} with the MONSTER JAM!`,
                    `${pName} tears the rim down!`,
                    `${pName} rises up and throws it down!`
                ]) + " " + suffix;

                return pick([
                    `${pName} hits the jumper.`,
                    `${pName} gets the bucket.`,
                    `${pName} scores inside.`,
                    `${pName} finds the bottom of the net.`
                ]) + " " + suffix;

            case EventType.MISS:
                if (ctx.isThree) return pick([
                    `${pName} misses from deep.`,
                    `${pName} clanks the three.`,
                    `${pName} is short on the triple.`,
                    `In and out for ${pName}.`
                ]);
                return pick([
                    `${pName} misses the shot.`,
                    `${pName} can't get it to fall.`,
                    `${pName}'s shot rims out.`,
                    `Good defense forces the miss from ${pName}.`
                ]);

            case EventType.BLOCK:
                return pick([
                    `BLOCKED BY ${pName}!`,
                    `${pName} SAYS NO!`,
                    `${pName} with the rejection!`,
                    `Get that out of here! ${pName} with the block.`
                ]);

            case EventType.TURNOVER:
                return pick([
                    `${pName} loses the ball!`,
                    `${pName} throws it away.`,
                    `Careless turnover by ${pName}.`,
                    `${pName} stripped!`
                ]);

            default:
                return `${pName} makes a play.`;
        }
    }
};
