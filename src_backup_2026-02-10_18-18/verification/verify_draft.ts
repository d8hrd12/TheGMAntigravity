
import { generatePlayer } from "../features/player/playerGenerator";

function verifyDraft() {
    console.log("\n=== VERIFY DRAFT CLASS OVR DISTRIBUTION ===");

    const draftTiers = ['star', 'starter', 'bench', 'prospect'] as const;
    const distributions: Record<string, number[]> = {
        star: [],
        starter: [],
        bench: [],
        prospect: []
    };

    // Sample 50 players per tier
    draftTiers.forEach(tier => {
        for (let i = 0; i < 50; i++) {
            const p = generatePlayer(undefined, tier);
            distributions[tier].push(p.overall);
        }
    });

    console.log("\nTier      | Avg OVR | Min OVR | Max OVR | Potential Avg");
    console.log("----------------------------------------------------------");

    draftTiers.forEach(tier => {
        const ovrs = distributions[tier];
        const avg = ovrs.reduce((a, b) => a + b, 0) / ovrs.length;
        const min = Math.min(...ovrs);
        const max = Math.max(...ovrs);

        // Potential check for one sample
        const p = generatePlayer(undefined, tier);

        console.log(`${tier.padEnd(9)} | ${avg.toFixed(1).padStart(7)} | ${min.toString().padStart(7)} | ${max.toString().padStart(7)} | ${p.potential.toFixed(0).padStart(13)}`);
    });

    console.log("\nVerification Targets:");
    console.log("- Star: ~78-82 OVR (Ready but not 90+)");
    console.log("- Starter: ~70-74 OVR (Rotation player)");
    console.log("- Prospect: ~60-65 OVR (Raw project)");

    const starAvg = distributions['star'].reduce((a, b) => a + b, 0) / 50;
    const prospectAvg = distributions['prospect'].reduce((a, b) => a + b, 0) / 50;

    if (starAvg < 85 && prospectAvg < 68) {
        console.log("\n✅ SUCCESS: Rookie OVR floor has been successfully lowered.");
    } else {
        console.log("\n❌ FAILURE: Rookies are still too strong.");
    }
}

verifyDraft();
