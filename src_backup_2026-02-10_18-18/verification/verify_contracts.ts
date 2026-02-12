
import { calculateFairSalary } from "../utils/playerUtils";

function verifyContracts() {
    console.log("=== VERIFY CONTRACT SCALING ===");

    const testTiers = [
        { name: "Scrub", ovr: 50 },
        { name: "Minimum", ovr: 65 },
        { name: "Bottom Bench", ovr: 70 },
        { name: "Solid Bench", ovr: 75 },
        { name: "Starter", ovr: 80 },
        { name: "All-Star", ovr: 85 },
        { name: "Superstar", ovr: 90 },
        { name: "MVP", ovr: 95 },
        { name: "GOAT", ovr: 99 }
    ];

    testTiers.forEach(tier => {
        const salary = calculateFairSalary(tier.ovr);
        console.log(`${tier.name} (OVR ${tier.ovr}): $${(salary / 1000000).toFixed(2)}M`);
    });

    console.log("\n--- Edge Cases ---");
    console.log(`Below Min (OVR 40): $${(calculateFairSalary(40) / 1000000).toFixed(2)}M`);
    console.log(`Cap (OVR 99): $${(calculateFairSalary(99) / 1000000).toFixed(2)}M`);
}

verifyContracts();
