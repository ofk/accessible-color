import chroma from 'chroma-js';

// cf. https://github.com/gka/chroma.js/blob/master/src/ops/luminance.js

const calcGrayColorValue = (luminance: number): number => {
  const x =
    luminance <= 0.03928 / 12.92 ? luminance * 12.92 : luminance ** (1 / 2.4) * 1.055 - 0.055;
  return Math.max(0, Math.min(Math.round(x * 255), 255));
};

export const calcGrayColor = (luminance: number, direction = 0): chroma.Color => {
  const v = calcGrayColorValue(luminance);
  const color = chroma(v, v, v);

  if (direction > 0) {
    if (color.luminance() < luminance) {
      return chroma(v + 1, v + 1, v + 1);
    }
  } else if (direction < 0) {
    if (color.luminance() > luminance) {
      return chroma(v - 1, v - 1, v - 1);
    }
  }

  return color;
};
