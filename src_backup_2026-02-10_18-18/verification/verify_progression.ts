
import { generatePlayer } from "../features/player/playerGenerator";
import { calculateProgression } from "../features/training/TrainingLogic";
import { TrainingFocus } from "../models/Training";

function verifyProgression() {
    console.log("=== VERIFY PROGRESSION DATA FLOW ===");

    // 1. Generate a young player with high potential
    const player = generatePlayer(undefined, 'star');
    player.age = 20;
    player.potential = 95;
    player.overall = 75;

    console.log(`Initial OVR: ${player.overall}`);
    console.log(`Initial Finishing: ${player.attributes.finishing}`);

    // 2. Run training
    const { updatedPlayer, report } = calculateProgression(player, TrainingFocus.SHOOTING);

    console.log("\n--- Post-Training ---");
    console.log(`New OVR: ${updatedPlayer.overall}`);
    console.log(`New Finishing: ${updatedPlayer.attributes.finishing}`);
    console.log(`Previous Finishing (Stored): ${updatedPlayer.previousAttributes?.finishing}`);

    // Verification
    if (updatedPlayer.previousAttributes) {
        console.log("✅ SUCCESS: previousAttributes correctly stored after progression.");
    } else {
        console.log("❌ FAILURE: previousAttributes missing.");
    }

    if (updatedPlayer.previousAttributes?.finishing === player.attributes.finishing) {
        console.log("✅ SUCCESS: Value match confirmed.");
    }
}

verifyProgression();
