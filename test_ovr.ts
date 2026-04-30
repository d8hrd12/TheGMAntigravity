const POSITION_WEIGHTS: any = {
    'PG': {
        finishing: 1.5, midRange: 2.0, threePointShot: 3.0, freeThrow: 1.0,
        playmaking: 4.0, ballHandling: 4.0, offensiveRebound: 0.1,
        interiorDefense: 0.2, perimeterDefense: 2.5, stealing: 2.5, blocking: 0.1,
        defensiveRebound: 0.5, athleticism: 3.5, basketballIQ: 3.5
    },
    'SG': {
        finishing: 2.5, midRange: 3.0, threePointShot: 4.0, freeThrow: 1.5,
        playmaking: 2.0, ballHandling: 2.5, offensiveRebound: 0.2,
        interiorDefense: 0.5, perimeterDefense: 3.0, stealing: 2.0, blocking: 0.5,
        defensiveRebound: 1.0, athleticism: 3.5, basketballIQ: 2.0
    },
    'SF': {
        finishing: 3.0, midRange: 2.5, threePointShot: 2.5, freeThrow: 1.5,
        playmaking: 1.5, ballHandling: 2.0, offensiveRebound: 1.5,
        interiorDefense: 2.0, perimeterDefense: 3.5, stealing: 2.0, blocking: 1.5,
        defensiveRebound: 2.0, athleticism: 3.0, basketballIQ: 2.5
    },
    'PF': {
        finishing: 4.0, midRange: 2.0, threePointShot: 1.0, freeThrow: 1.5,
        playmaking: 1.0, ballHandling: 1.0, offensiveRebound: 3.5,
        interiorDefense: 3.5, perimeterDefense: 1.5, stealing: 1.0, blocking: 3.0,
        defensiveRebound: 3.5, athleticism: 2.5, basketballIQ: 2.5
    },
    'C': {
        finishing: 4.5, midRange: 1.0, threePointShot: 0.1, freeThrow: 1.5,
        playmaking: 0.5, ballHandling: 0.5, offensiveRebound: 4.0,
        interiorDefense: 4.0, perimeterDefense: 0.5, stealing: 0.5, blocking: 4.0,
        defensiveRebound: 4.0, athleticism: 2.0, basketballIQ: 2.5
    }
};

const calculateOldOvrWithMax = (attr: any) => {
    let max = 0;
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach(pos => {
        const weights = POSITION_WEIGHTS[pos];
        let totalWeightedScore = 0;
        let totalMaxWeight = 0;
        Object.keys(weights).forEach(key => {
            const weight = weights[key];
            const val = attr[key] || 50;
            totalWeightedScore += val * weight;
            totalMaxWeight += 99 * weight;
        });
        
        let normalized = (totalWeightedScore / totalMaxWeight) * 99;
        let boosted = normalized * 1.1; 
        let final = Math.min(99, Math.round(boosted));
        if (final > max) max = final;
    });
    return max;
};

const tatumAttr = {
    finishing: 67, midRange: 54, threePointShot: 99, freeThrow: 83,
    playmaking: 74, ballHandling: 80, offensiveRebound: 51, defensiveRebound: 95,
    interiorDefense: 52, perimeterDefense: 81, stealing: 77, blocking: 52,
    athleticism: 84, basketballIQ: 62
};

console.log("Max Tatum (Old + Max Position):", calculateOldOvrWithMax(tatumAttr));
