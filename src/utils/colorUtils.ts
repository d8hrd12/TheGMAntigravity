
/**
 * Ensures a color is vibrant enough for a dark-mode UI by checking HSL lightness.
 * If lightness is below the threshold, it shifts it up.
 */
export const ensureColorVibrancy = (hex: string, minLightness: number = 45): string => {
    // 1. Convert Hex to RGB
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    } else {
        return hex; // Fallback
    }

    // 2. Convert RGB to HSL
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // 3. Check and adjust lightness
    const lightnessPercent = l * 100;
    if (lightnessPercent < minLightness) {
        l = minLightness / 100;
    }

    // 4. Convert HSL back to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let finalR, finalG, finalB;
    if (s === 0) {
        finalR = finalG = finalB = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        finalR = hue2rgb(p, q, h + 1 / 3);
        finalG = hue2rgb(p, q, h);
        finalB = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
        const res = Math.round(x * 255).toString(16);
        return res.length === 1 ? '0' + res : res;
    };

    return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;
};
