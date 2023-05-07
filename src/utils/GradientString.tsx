import PaletteColor from "./PaletteColor";

export default function getGradientString(palette: PaletteColor[]) {
    if (palette.length === 0) return '#000';
  
    if (palette.length === 1) return `rgb(${palette[0].r}, ${palette[0].g}, ${palette[0].b})`;
  
    let gradientString = 'linear-gradient(to bottom right';
    for (let i = 0; i < palette.length; i++) {
      gradientString += `,rgb(
        ${palette[i].r},
        ${palette[i].g},
        ${palette[i].b}
      )`;
    }
    gradientString += ')';
    return gradientString;
}