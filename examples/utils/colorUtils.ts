import {
  blend,
  converter,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  formatHex,
  formatHex8,
  formatRgb,
  getMode,
  round,
  wcagContrast,
  wcagLuminance,
} from 'culori';
import type { Color } from 'culori';

const twoDecimals = round(2);

const formatColor = (color: Color): string => {
  const alpha = color.alpha ?? 1;
  return `${color.mode}(${getMode(color.mode)
    .channels.filter((ch) => ch !== 'alpha')
    .map((ch) => twoDecimals((color as unknown as Record<string, number>)[ch] ?? 0))
    .join(' ')}${alpha < 1 ? ` / ${alpha.toFixed(2)}` : ''})`;
};

export const toColorString = (outputStyle: string, color: Color): string => {
  switch (outputStyle) {
    case 'luminance':
      return `luminance: ${wcagLuminance(color).toFixed(4)}`;
    case 'rgb':
      return formatRgb(color);
    case 'hsl':
    case 'hsv':
    case 'hsi':
    case 'lab':
    case 'lch':
    case 'oklab':
    case 'oklch':
      return formatColor(converter(outputStyle)(color));
    case 'hex':
      return (color.alpha ?? 1) < 1 ? formatHex8(color) : formatHex(color);
    default:
      throw new Error(`Not support outputStyle = ${outputStyle}`);
  }
};

export const simulateColor = (color: Color, style: string): Color => {
  switch (style) {
    case 'protanopia':
      return filterDeficiencyProt(1)(color);
    case 'deuteranopia':
      return filterDeficiencyDeuter(1)(color);
    case 'tritanopia':
      return filterDeficiencyTrit(1)(color);
    case 'achromatopsia':
      return filterGrayscale()(color);
    default:
      return color;
  }
};

export const calcContrast = (color: Color, bgColor: Color): number => {
  const opaqueBgColor = blend(['white', bgColor]);
  const opaqueColor = blend([opaqueBgColor, color]);
  return wcagContrast(opaqueBgColor, opaqueColor);
};

export const toStringFromColorStrings = (colors: string[][]): string =>
  colors.map((color) => color.join(' ')).join('\n');
