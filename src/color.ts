import type { Color, Oklch } from 'culori';
import { clampChroma, interpolate, lab, oklab, oklch, samples, wcagLuminance } from 'culori';

import { calcGrayColor } from './gray';
import { adjustLuminance } from './luminance';

export const calcBoldColor = (backgroundColor: Color, targetColor: Color): Oklch => ({
  ...oklch(targetColor),
  l: wcagLuminance(backgroundColor) < 0.5 ? 1 : 0,
});

const calcMostLiveColor = (hue: number, count = 20): Oklch => {
  const baseColors = interpolate(
    [
      { mode: 'oklch', l: 0, c: 1, h: hue },
      { mode: 'oklch', l: 1, c: 1, h: hue },
    ],
    'oklch',
  );
  return samples(count)
    .map((v) => clampChroma(baseColors(v), 'oklch'))
    .reduce((prevColor, color) => ((prevColor.c || 0) < (color.c || 0) ? color : prevColor));
};

export const calcColor = (luminance: number, hue: number, direction = 0): Oklch => {
  const grayColor = calcGrayColor(luminance);
  const liveColor = calcMostLiveColor(hue);
  const mutedColor = clampChroma({ ...lab(liveColor), l: lab(grayColor).l }, 'lab');
  const resColor = clampChroma({ ...oklab(liveColor), l: oklab(mutedColor).l }, 'oklab');
  const negColor = adjustLuminance(resColor, luminance, -direction);
  const posColor = adjustLuminance(negColor, luminance, direction);
  return posColor;
};
