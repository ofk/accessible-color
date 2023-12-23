import type { Rgb } from 'culori';
import { rgb, wcagLuminance } from 'culori';

import { calcBoldColor, calcColor } from './color';
import { calcGrayColor } from './gray';
import { calcLuminance } from './luminance';
import { adjustTranslucentColor, adjustTransparency } from './translucent';
import type { RawColor } from './utilities';
import { toColor } from './utilities';

// Calculates a translucent color close to the target color with the passed background and foreground colors
export const translucent = (
  backgroundRawColor: RawColor,
  foregroundRawColor: RawColor,
  targetRawColor?: RawColor,
): Rgb => {
  const backgroundColor = toColor(backgroundRawColor);
  const targetColor = toColor(targetRawColor ?? foregroundRawColor);
  const foregroundColor = targetRawColor
    ? toColor(foregroundRawColor)
    : calcBoldColor(backgroundColor, targetColor);
  const resultColor = adjustTransparency(backgroundColor, foregroundColor, targetColor);
  return rgb(resultColor);
};

// Calculates a color with a certain contrast to the passed background color
export const color = (
  backgroundRawColor: RawColor,
  signedContrast: number,
  hue: number,
  alpha = 1,
): Rgb => {
  const backgroundColor = toColor(backgroundRawColor);
  const backgroundLuminance = wcagLuminance(backgroundColor);
  const targetLuminance = calcLuminance(backgroundLuminance, signedContrast);
  const direction = targetLuminance - backgroundLuminance;
  const resultColor = adjustTranslucentColor(
    backgroundColor,
    Number.isFinite(hue)
      ? calcColor(targetLuminance, hue, direction)
      : calcGrayColor(targetLuminance, direction),
    alpha,
  );
  return rgb(resultColor);
};

// Calculates a gray color with a certain contrast to the passed background color
export const gray = (backgroundRawColor: RawColor, signedContrast: number, alpha = 1): Rgb =>
  color(backgroundRawColor, signedContrast, 0 / 0, alpha);
