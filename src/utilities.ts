import type { Color, Mode, Oklch } from 'culori';
import {
  clampChroma,
  converter,
  formatCss,
  formatHex,
  formatHex8,
  formatRgb,
  oklch,
  parse,
} from 'culori';

export interface SafeOklch extends Omit<Oklch, 'h'>, Required<Pick<Oklch, 'h'>> {}

export const toSafeOklch = (color: Color): SafeOklch => {
  const c = clampChroma(oklch(color), 'oklch');
  return { ...c, c: c.c || 0, h: c.h ?? 0 };
};

export type RawColor = string | Color;

export const toColor = (value: RawColor): Color => {
  if (typeof value === 'string') {
    return parse(value) ?? { mode: 'rgb' as const, r: 0, g: 0, b: 0 };
  }
  return value;
};

export type ColorMode = Mode | 'hex6' | 'hex8' | 'hex';

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
