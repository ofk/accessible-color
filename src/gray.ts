import type { Oklch } from 'culori';

import { adjustLuminance } from './luminance';

// cf. https://github.com/Evercoder/culori/blob/main/src/wcag.js
//     https://github.com/Evercoder/culori/blob/main/src/lrgb/convertRgbToLrgb.js

const calcGrayColorValue = (luminance: number): number => {
  if (Math.abs(luminance * 12.92) <= 0.04045) {
    return luminance * 12.92;
  }
  return (Math.sign(luminance) || 1) * (luminance ** (1 / 2.4) * 1.055 - 0.055);
};

export const calcGrayColor = (luminance: number, direction = 0): Oklch => {
  const v = calcGrayColorValue(luminance) || 0;
  return adjustLuminance({ mode: 'rgb', r: v, g: v, b: v }, luminance, direction);
};
