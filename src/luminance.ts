// cf. https://github.com/Evercoder/culori/blob/main/src/wcag.js

import type { Color, Oklch } from 'culori';
import { clampChroma, oklch, wcagLuminance } from 'culori';

const calcBrightLuminance = (backgroundLuminance: number, contrast: number): number =>
  (backgroundLuminance + 0.05) * contrast - 0.05;

const calcDarkLuminance = (backgroundLuminance: number, contrast: number): number =>
  (backgroundLuminance + 0.05) / contrast - 0.05;

export const calcLuminance = (backgroundLuminance: number, signedContrast: number): number => {
  if (backgroundLuminance > 0.5) {
    if (signedContrast > 0) return calcDarkLuminance(backgroundLuminance, signedContrast);
    return calcBrightLuminance(backgroundLuminance, -signedContrast);
  }
  if (signedContrast > 0) return calcBrightLuminance(backgroundLuminance, signedContrast);
  return calcDarkLuminance(backgroundLuminance, -signedContrast);
};

export const adjustLuminance = (
  baseColor: Color,
  luminance: number,
  direction = 0,
  range = 1,
  steps = 1000,
): Oklch => {
  const baseOklch = oklch(baseColor);
  let color = clampChroma(baseOklch, 'oklch');
  if (direction > 0) {
    for (let i = 0; i < range * steps && wcagLuminance(color) < luminance; i += 1) {
      color = clampChroma({ ...baseOklch, l: baseOklch.l + i / steps }, 'oklch');
    }
  } else if (direction < 0) {
    for (let i = 0; i < range * steps && wcagLuminance(color) > luminance; i += 1) {
      color = clampChroma({ ...baseOklch, l: baseOklch.l - i / steps }, 'oklch');
    }
  }
  return color;
};
