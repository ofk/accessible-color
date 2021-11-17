import chroma from 'chroma-js';

import { calcGrayColor } from './gray';
import { calcLuminance } from './luminance';

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

// Calculates a gray color with a certain contrast to the passed background color
export const gray = (backgroundRawColor: RawColor, signedContrast: number): chroma.Color => {
  const backgroundLuminance = toColor(backgroundRawColor).luminance();
  const targetLuminance = calcLuminance(backgroundLuminance, signedContrast);
  return calcGrayColor(targetLuminance, targetLuminance - backgroundLuminance);
};
