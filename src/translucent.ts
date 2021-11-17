import chroma from 'chroma-js';

export const calcBoldColor = (
  backgroundColor: chroma.Color,
  targetColor: chroma.Color
): chroma.Color => {
  const targetLch = targetColor.lch();
  return chroma(backgroundColor.luminance() < 0.5 ? 100 : 0, targetLch[1], targetLch[2], 'lch');
};

export const calcAlphaValue = (
  backgroundValue: number,
  foregroundValue: number,
  targetValue: number
): number => {
  const rawAlpha = (targetValue - backgroundValue) / (foregroundValue - backgroundValue);
  return Math.round(rawAlpha * 1000) / 1000;
};

export const calcTranslucentColor = (
  backgroundColor: chroma.Color,
  foregroundColor: chroma.Color,
  targetColor: chroma.Color
): chroma.Color => {
  const baseValue = foregroundColor.hsv()[2];
  const targetValue = targetColor.hsv()[2];
  const backgroundValue = backgroundColor.hsv()[2];
  return foregroundColor.alpha(calcAlphaValue(backgroundValue, baseValue, targetValue));
};
