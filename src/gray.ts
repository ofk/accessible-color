import type { Color } from 'culori';
import { clampRgb, wcagLuminance } from 'culori';

// cf. https://github.com/Evercoder/culori/blob/main/src/wcag.js
//     https://github.com/Evercoder/culori/blob/main/src/lrgb/convertRgbToLrgb.js

const calcGrayColorValue = (luminance: number): number => {
  if (Math.abs(luminance * 12.92) <= 0.04045) {
    return luminance * 12.92;
  }
  return (Math.sign(luminance) || 1) * (luminance ** (1 / 2.4) * 1.055 - 0.055);
};

export const calcGrayColor = (luminance: number, direction = 0): Color => {
  const v = calcGrayColorValue(luminance) || 0;
  const color = clampRgb({ mode: 'rgb' as const, r: v, g: v, b: v });

  if (direction > 0) {
    if (wcagLuminance(color) < luminance) {
      const u = v + 1 / 255;
      return clampRgb({ mode: 'rgb' as const, r: u, g: u, b: u });
    }
  } else if (direction < 0) {
    if (wcagLuminance(color) > luminance) {
      const u = v - 1 / 255;
      return clampRgb({ mode: 'rgb' as const, r: u, g: u, b: u });
    }
  }

  return color;
};
