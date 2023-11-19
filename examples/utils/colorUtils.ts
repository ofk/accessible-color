import {
  converter,
  formatHex,
  formatHex8,
  formatHsl,
  formatRgb,
  getMode,
  round,
  wcagLuminance,
} from 'culori';
import type { Color } from 'culori';

const twoDecimals = round(2);

const format = (color: Color): string =>
  `${color.mode}(${getMode(color.mode)
    .channels.filter((ch) => ch !== 'alpha')
    .map((ch) => twoDecimals((color as unknown as Record<string, number>)[ch] ?? 0))
    .join(', ')})`;

export const toColorString = (color: Color, outputStyle: string): string => {
  switch (outputStyle) {
    case 'luminance':
      return `luminance: ${wcagLuminance(color).toFixed(4)}`;
    case 'rgb':
      return formatRgb(color);
    case 'hsl':
      return formatHsl(color);
    case 'hsv':
    case 'hsi':
    case 'lab':
    case 'lch':
      return format(converter(outputStyle)(color));
    case 'hex':
      return color.alpha && color.alpha > 0 ? formatHex8(color) : formatHex(color);
    default:
      return '';
  }
};
