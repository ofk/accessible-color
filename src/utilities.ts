import type { Color, Mode } from 'culori';
import { converter, formatCss, formatHex, formatHex8, formatRgb, parse } from 'culori';

// Color argument type
export type RawColor = string | Color;

// Convert to Color, defaults to black if an invalid color value is passed
export const toColor = (value: RawColor): Color => {
  if (typeof value === 'string') {
    return parse(value) ?? { mode: 'rgb' as const, r: 0, g: 0, b: 0 };
  }
  return value;
};

// Color output mode
export type ColorMode = Mode | 'hex6' | 'hex8' | 'hex';

// Convert to color string
export const toColorString = (value: RawColor, mode: ColorMode = 'hex'): string => {
  const color = toColor(value);
  switch (mode) {
    case 'hex6':
      return formatHex(color);
    case 'hex8':
      return formatHex8(color);
    case 'hex':
      return (color.alpha ?? 1) < 1 ? formatHex8(color) : formatHex(color);
    case 'rgb':
      return formatRgb(color);
    default:
      return formatCss(converter(mode)(color));
  }
};
