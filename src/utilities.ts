import type { Color } from 'culori';
import { parse } from 'culori';

// Color argument type
export type RawColor = string | Color;

// Convert to Color, defaults to black if an invalid color value is passed
export const toColor = (value: RawColor): Color => {
  if (typeof value === 'string') {
    return parse(value) ?? { mode: 'rgb' as const, r: 0, g: 0, b: 0 };
  }
  return value;
};
