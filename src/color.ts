import type { Color } from 'culori';
import { hsl, lch, wcagLuminance } from 'culori';

import { calcGrayColor } from './gray';

const calcLiveColor = (luminance: number, hue: number, saturation: number): Color => {
  const grayColor = calcGrayColor(luminance);
  const grayLch = lch(grayColor);
  const targetColor = { mode: 'hsl' as const, h: hue, s: saturation, l: hsl(grayColor).l };
  const targetLch = lch(targetColor);
  const resColor = { ...lch({ ...hsl({ ...targetLch, l: grayLch.l }), h: hue }), l: grayLch.l };
  return resColor;
};

const calcChromaMean = (luminance: number, saturation: number, step = 15): number => {
  const values: number[] = [];
  for (let hue = 0; hue < 360; hue += step) {
    const color = calcLiveColor(luminance, hue, saturation);
    values.push(lch(color).c);
  }
  return values.reduce((a, e) => a + e, 0) / values.length;
};

const calcLiveColorWithChroma = (
  luminance: number,
  hue: number,
  saturation: number,
  chromaValue: number,
): Color => {
  const tmpColor = { ...lch(calcLiveColor(luminance, hue, saturation)), c: chromaValue };
  const resColor = calcLiveColor(luminance, hue, hsl(tmpColor).s);
  return resColor;
};

export const calcColor = (
  luminance: number,
  hue: number,
  saturation: number,
  direction = 0,
): Color => {
  const chromaValue = calcChromaMean(luminance, saturation);
  const resColor = calcLiveColorWithChroma(luminance, hue, saturation, chromaValue);

  if (direction > 0) {
    const unit = luminance - wcagLuminance(resColor);
    let tmpColor = resColor;
    for (let i = 1; i < 100 && wcagLuminance(tmpColor) < luminance; i += 1) {
      tmpColor = calcColor(luminance + unit * i, hue, saturation);
    }
    return tmpColor;
  }
  if (direction < 0) {
    const unit = wcagLuminance(resColor) - luminance;
    let tmpColor = resColor;
    for (let i = 1; i < 100 && wcagLuminance(tmpColor) > luminance; i += 1) {
      tmpColor = calcColor(luminance - unit * i, hue, saturation);
    }
    return tmpColor;
  }

  return resColor;
};
