import type { Color, Oklch } from 'culori';
import {
  average,
  clampChroma,
  interpolate,
  lab,
  oklab,
  oklch,
  samples,
  wcagLuminance,
} from 'culori';
import type { NonEmptyArray } from 'culori/src/common';

import { calcGrayColor } from './gray';
import { adjustLuminance } from './luminance';
import type { SafeOklch } from './utilities';
import { toSafeOklch } from './utilities';

export const calcBoldColor = (backgroundColor: Color, targetColor: Color): Oklch => ({
  ...oklch(targetColor),
  l: wcagLuminance(backgroundColor) < 0.5 ? 1 : 0,
});

const calcMostLiveColor = (hue: number, count = 20): SafeOklch => {
  const baseColors = interpolate(
    [
      { mode: 'oklch', l: 0, c: 1, h: hue },
      { mode: 'oklch', l: 1, c: 1, h: hue },
    ],
    'oklch',
  );
  return samples(count)
    .map((v) => toSafeOklch(baseColors(v)))
    .reduce((prevColor, color) => (prevColor.c < color.c ? color : prevColor));
};

const adjustChromaByNeighbor = (baseColor: Oklch, hueTolerance: number, count = 20): SafeOklch => {
  const color = toSafeOklch(baseColor);
  const neighborColors = interpolate(
    [
      { ...color, h: color.h - hueTolerance },
      { ...color, h: color.h + hueTolerance },
    ],
    'oklch',
  );
  const averageColor = average(
    samples(count).map((v) => toSafeOklch(neighborColors(v))) as NonEmptyArray<SafeOklch>,
    'oklch',
  );
  return { ...color, c: averageColor.c };
};

export const calcColor = (luminance: number, hue: number, direction = 0): Oklch => {
  const grayColor = calcGrayColor(luminance);
  const liveColor = adjustChromaByNeighbor(calcMostLiveColor(hue), 60);
  const mutedColor = clampChroma({ ...lab(liveColor), l: lab(grayColor).l }, 'lab');
  const resColor = clampChroma({ ...oklab(liveColor), l: oklab(mutedColor).l }, 'oklab');
  const negColor = adjustLuminance(resColor, luminance, -direction);
  const posColor = adjustLuminance(negColor, luminance, direction);
  return posColor;
};
