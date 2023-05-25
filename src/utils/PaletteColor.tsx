export default interface PaletteColor {
    r: number;
    g: number;
    b: number;
    count: number;
}

export const PaletteColorToRGB = (color: PaletteColor) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export const PaletteColorToHex = (color: PaletteColor) => {
    return `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;
}