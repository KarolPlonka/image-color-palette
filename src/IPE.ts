interface BaseColor {
    r: number;
    g: number;
    b: number;
    count: number;
}

export function getImagePalette(
    imgData: Uint8ClampedArray,
    acceleration: number,
    colorsAmount = 3
): BaseColor[] {
    if (colorsAmount <= 0) {
        throw new Error("colorsAmount must be at least 1");
    }

    let baseColors: BaseColor[] = [];
    if (colorsAmount === 1) {
        baseColors.push({ r: 128, g: 128, b: 128, count: 0 });
    } else {
        const colorStep = 255 / (colorsAmount - 1);
        for (let i = 0; i < colorsAmount; i++) {
            const colorValue = Math.round(colorStep * i);
            baseColors.push({ r: colorValue, g: colorValue, b: colorValue, count: 0 });
        }
    }

    let totalPixels = 0;
    for (let i = 0; i < imgData.length; i += 4) {
        if (imgData[i + 3] !== 0) totalPixels++;
    }

    totalPixels /= acceleration;

    for (let i = 0; i < imgData.length; i += 4 * acceleration) {
        if (imgData[i + 3] === 0) continue; //skip transparent pixels

        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];

        const distBiased = baseColors.map((baseColor) => {
            const dr = r - baseColor.r;
            const dg = g - baseColor.g;
            const db = b - baseColor.b;
            return (dr * dr + dg * dg + db * db) * (baseColor.count / totalPixels);
        });

        let closestIndex = 0;
        for (let j = 1; j < distBiased.length; j++) {
            if (distBiased[j] < distBiased[closestIndex]) {
                closestIndex = j;
            }
        }

        const closestColor = baseColors[closestIndex];

        baseColors[closestIndex] = {
            r: (closestColor.r * closestColor.count + r) / (closestColor.count + 1),
            g: (closestColor.g * closestColor.count + g) / (closestColor.count + 1),
            b: (closestColor.b * closestColor.count + b) / (closestColor.count + 1),
            count: closestColor.count + 1,
        };
    }

    baseColors = baseColors.map((color) => {
        return {
            r: Math.round(color.r),
            g: Math.round(color.g),
            b: Math.round(color.b),
            count: color.count,
        };
    });

    return baseColors;
}