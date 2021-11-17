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

export const mixColor = (
  backgroundColor: chroma.Color,
  foregroundColor: chroma.Color
): chroma.Color =>
  chroma.mix(backgroundColor, foregroundColor.alpha(1), foregroundColor.alpha(), 'rgb');

export const isolateColor = (
  backgroundColor: chroma.Color,
  targetColor: chroma.Color,
  alpha: number
): chroma.Color => {
  if (alpha < 1) {
    const backgroundRgb = backgroundColor.rgb();
    const targetRgb = targetColor.rgb();
    return chroma(
      (targetRgb[0] - backgroundRgb[0]) / alpha + backgroundRgb[0],
      (targetRgb[1] - backgroundRgb[1]) / alpha + backgroundRgb[1],
      (targetRgb[2] - backgroundRgb[2]) / alpha + backgroundRgb[2],
      alpha
    );
  }
  return targetColor;
};
