import type { Color } from 'culori';
import { blend, hsv, rgb } from 'culori';

export const adjustTransparency = (
  backgroundColor: Color,
  foregroundColor: Color,
  targetColor: Color,
): Color => {
  const foregroundValue = hsv(foregroundColor).v;
  const targetValue = hsv(targetColor).v;
  const backgroundValue = hsv(backgroundColor).v;
  return {
    ...foregroundColor,
    alpha: (targetValue - backgroundValue) / (foregroundValue - backgroundValue),
  };
};

export const adjustTranslucentColor = (
  backgroundColor: Color,
  targetColor: Color,
  alpha: number,
): Color => {
  if (alpha < 1) {
    return {
      ...blend(
        [
          { ...rgb(backgroundColor), alpha: 1 },
          { ...rgb(targetColor), alpha: 1 },
        ],
        (b, s) => (s - b) / alpha + b,
      ),
      alpha,
    };
  }
  return targetColor;
};
