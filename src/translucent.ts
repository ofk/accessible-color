import type { Color } from 'culori';
import { blend, hsv, lch, rgb, wcagLuminance } from 'culori';

export const calcBoldColor = (backgroundColor: Color, targetColor: Color): Color => ({
  ...lch(targetColor),
  l: wcagLuminance(backgroundColor) < 0.5 ? 100 : 0,
});

export const calcAlphaValue = (
  backgroundValue: number,
  foregroundValue: number,
  targetValue: number,
): number => {
  const rawAlpha = (targetValue - backgroundValue) / (foregroundValue - backgroundValue);
  return Math.round(rawAlpha * 1000) / 1000;
};

export const calcTranslucentColor = (
  backgroundColor: Color,
  foregroundColor: Color,
  targetColor: Color,
): Color => {
  const baseValue = hsv(foregroundColor).v;
  const targetValue = hsv(targetColor).v;
  const backgroundValue = hsv(backgroundColor).v;
  return { ...foregroundColor, alpha: calcAlphaValue(backgroundValue, baseValue, targetValue) };
};

export const isolateColor = (backgroundColor: Color, targetColor: Color, alpha: number): Color => {
  if (alpha < 1) {
    const backgroundRgb = { ...rgb(backgroundColor), alpha: 1 };
    const targetRgb = { ...rgb(targetColor), alpha: 1 };
    return { ...blend([backgroundRgb, targetRgb], (b, s) => (s - b) / alpha + b), alpha };
  }
  return targetColor;
};
