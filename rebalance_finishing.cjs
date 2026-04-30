const fs = require('fs');

const file = fs.readFileSync('src/data/realRosters.ts', 'utf8');

const newFile = file.replace(/("pos":\s*"([^"]+)",[\s\S]*?"finishing":\s*)(\d+)/g, (match, prefix, pos, finishingStr) => {
    let finishing = parseInt(finishingStr);
    
    if (pos === 'C') {
        finishing = Math.round(finishing * 0.85);
    } else if (pos === 'PF') {
        finishing = Math.round(finishing * 0.95);
    } else if (pos === 'SF' || pos === 'SG' || pos === 'PG') {
        finishing = Math.round(finishing * 1.15);
        if (finishing > 99) finishing = 99;
    }
    
    return prefix + finishing;
});

fs.writeFileSync('src/data/realRosters.ts', newFile);
console.log('Rebalanced finishing in realRosters.ts');
