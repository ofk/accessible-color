import { converter, formatHex, formatHex8, formatRgb, getMode, round, wcagLuminance } from 'culori';
import type { Color } from 'culori';

const twoDecimals = round(2);

const format = (color: Color): string => {
  const alpha = color.alpha ?? 1;
  return `${color.mode}(${getMode(color.mode)
    .channels.filter((ch) => ch !== 'alpha')
    .map((ch) => twoDecimals((color as unknown as Record<string, number>)[ch] ?? 0))
    .join(' ')}${alpha < 1 ? ` / ${alpha.toFixed(2)}` : ''})`;
};

export const toColorString = (color: Color, outputStyle: string): string => {
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
      return format(converter(outputStyle)(color));
    case 'hex':
      return (color.alpha ?? 1) < 1 ? formatHex8(color) : formatHex(color);
    default:
      return '';
  }
};
