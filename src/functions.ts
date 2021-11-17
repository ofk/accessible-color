import chroma from 'chroma-js';

import { calcColor } from './color';
import { calcGrayColor } from './gray';
import { calcLuminance } from './luminance';
import { calcBoldColor, calcTranslucentColor } from './translucent';

// chroma.Color argument type
export type RawColor = string | number | chroma.Color;

// Convert to chroma.Color, defaults to black if an invalid color value is passed
export const toColor = (value: RawColor): chroma.Color => {
  try {
    return chroma(value);
  } catch (e) {
    return chroma(0, 0, 0);
  }
};

// Calculates a color with a certain contrast to the passed background color
export const color = (
  backgroundRawColor: RawColor,
  signedContrast: number,
  hue: number
): chroma.Color => {
  const backgroundLuminance = toColor(backgroundRawColor).luminance();
  const targetLuminance = calcLuminance(backgroundLuminance, signedContrast);
  const direction = targetLuminance - backgroundLuminance;
  return Number.isFinite(hue)
    ? calcColor(targetLuminance, hue, 1, direction)
    : calcGrayColor(targetLuminance, direction);
};

// Calculates a translucent color close to the target color with the passed background and foreground colors
export const translucent = (
  backgroundRawColor: RawColor,
  foregroundRawColor: RawColor,
  targetRawColor?: RawColor
): chroma.Color => {
  const backgroundColor = toColor(backgroundRawColor);
  const targetColor = toColor(targetRawColor || foregroundRawColor);
  const foregroundColor = targetRawColor
    ? toColor(foregroundRawColor)
    : calcBoldColor(backgroundColor, targetColor);
  return calcTranslucentColor(backgroundColor, foregroundColor, targetColor);
};

// Calculates a gray color with a certain contrast to the passed background color
export const gray = (backgroundRawColor: RawColor, signedContrast: number): chroma.Color =>
  color(backgroundRawColor, signedContrast, 0 / 0);
