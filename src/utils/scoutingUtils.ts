
// src/utils/scoutingUtils.ts

/**
 * Returns a fuzzy potential grade based on scouting points invested.
 * 0 pts: "??"
 * 1-3 pts: Broad Range (e.g. "C - A")
 * 4-9 pts: Narrow Range (e.g. "B+ - A-")
 * 10 pts: Exact Grade ("A")
 */
export const getFuzzyPotential = (potential: number, points: number): string => {
    if (points >= 10) return getPotentialGrade(potential);

    const actualGrade = getPotentialGrade(potential); // e.g., "B+"
    const grades = ['F', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S'];
    const actualIndex = grades.indexOf(actualGrade);

    if (points < 4) {
        // Broad Range (+/- 2 or 3 steps) - visible even at 0 points
        const minIndex = Math.max(0, actualIndex - 3);
        const maxIndex = Math.min(grades.length - 1, actualIndex + 3);
        return `${grades[minIndex]} - ${grades[maxIndex]}`;
    } else {
        // Narrow Range (+/- 1 step)
        const minIndex = Math.max(0, actualIndex - 1);
        const maxIndex = Math.min(grades.length - 1, actualIndex + 1);
        return `${grades[minIndex]} - ${grades[maxIndex]}`;
    }
};

/**
 * Returns a fuzzy attribute value range.
 * 0-5 pts: Wide Range (+/- 20)
 * 6-9 pts: Narrow Range (+/- 5)
 * 10 pts: Exact Value
 */
export const getFuzzyAttribute = (value: number | undefined, points: number): string => {
    if (value === undefined || value === null) return "??";
    if (points >= 10) return value.toString();

    if (points < 6) {
        // Wide Range
        const min = Math.max(0, value - 20);
        const max = Math.min(99, value + 20);
        return `${min}-${max}`;
    } else {
        // Narrow Range
        const min = Math.max(0, value - 5);
        const max = Math.min(99, value + 5);
        return `${min}-${max}`;
    }
};

// Helper for potential grades (duplicated/imported from playerUtils or defined here)
export const getPotentialGrade = (potential: number): string => {
    if (potential >= 95) return 'S';
    if (potential >= 90) return 'A+';
    if (potential >= 85) return 'A';
    if (potential >= 80) return 'B+';
    if (potential >= 75) return 'B';
    if (potential >= 70) return 'C+';
    if (potential >= 65) return 'C';
    if (potential >= 60) return 'D+';
    if (potential >= 50) return 'D';
    return 'F';
};
