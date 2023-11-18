import chroma from 'chroma-js';

import { calcGrayColor } from './gray';

const calcLiveColor = (luminance: number, hue: number, saturation: number): chroma.Color => {
  const grayColor = calcGrayColor(luminance);
  const grayLch = grayColor.lch();
  const targetColor = chroma(hue, saturation, grayColor.hsl()[2], 'hsl');
  const targetLch = targetColor.lch();
  const resColor = chroma(grayLch[0], targetLch[1], targetLch[2], 'lch')
    .set('hsl.h', hue)
    .set('lch.l', grayLch[0]);
  return resColor;
};

const calcChromaMean = (luminance: number, saturation: number, step = 15): number => {
  const values: number[] = [];
  for (let hue = 0; hue < 360; hue += step) {
    const color = calcLiveColor(luminance, hue, saturation);
    values.push(color.lch()[1]);
  }
  return values.reduce((a, e) => a + e, 0) / values.length;
};

const calcLiveColorWithChroma = (
  luminance: number,
  hue: number,
  saturation: number,
  chromaValue: number,
): chroma.Color => {
  const tmpColor = calcLiveColor(luminance, hue, saturation).set('lch.c', chromaValue);
  const resColor = calcLiveColor(luminance, hue, tmpColor.hsl()[1]);
  return resColor;
};

export const calcColor = (
  luminance: number,
  hue: number,
  saturation: number,
  direction = 0,
): chroma.Color => {
  const chromaValue = calcChromaMean(luminance, saturation);
  const resColor = calcLiveColorWithChroma(luminance, hue, saturation, chromaValue);

  if (direction > 0) {
    const unit = luminance - resColor.luminance();
    let tmpColor = resColor;
    for (let i = 1; i < 100 && tmpColor.luminance() < luminance; i += 1) {
      tmpColor = calcColor(luminance + unit * i, hue, saturation);
    }
    return tmpColor;
  }
  if (direction < 0) {
    const unit = resColor.luminance() - luminance;
    let tmpColor = resColor;
    for (let i = 1; i < 100 && tmpColor.luminance() > luminance; i += 1) {
      tmpColor = calcColor(luminance - unit * i, hue, saturation);
    }
    return tmpColor;
  }

  return resColor;
};
