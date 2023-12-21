import {
  blend,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  round,
  wcagContrast,
} from 'culori';
import type { Color } from 'culori';

import { toColorString } from '../../src';

const twoDecimals = round(2);

export const outputColor = (color: Color, mode: string): string => {
  switch (mode) {
    case 'hex':
      return toColorString(color, mode);
    case 'rgb':
    case 'hsl':
    case 'hsv':
    case 'hsi':
    case 'hwb':
    case 'lab':
    case 'lch':
    case 'oklab':
    case 'oklch':
      return toColorString(color, mode)
        .replace(/^color\((?:--)?(\w+)\s*/, '$1(')
        .replace(/[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, (x) =>
          String(twoDecimals(Number.parseFloat(x))),
        )
        .replace(/(?<=^rgba\(.*?,.*?,.*?)\s*,\s*/g, ' / ')
        .replace(/\s*,\s*/g, ' ')
        .replace(/%/g, '');
    default:
      throw new Error(`Not support mode = ${mode}`);
  }
};

export const simulateColor = (color: Color, style: string): Color => {
  switch (style) {
    case 'protanopia':
      return filterDeficiencyProt(1)(color);
    case 'deuteranopia':
      return filterDeficiencyDeuter(1)(color);
    case 'tritanopia':
      return filterDeficiencyTrit(1)(color);
    case 'achromatopsia':
      return filterGrayscale()(color);
    default:
      return color;
  }
};

export const calcContrast = (color: Color, bgColor: Color): number => {
  const opaqueBgColor = blend(['white', bgColor]);
  const opaqueColor = blend([opaqueBgColor, color]);
  return wcagContrast(opaqueBgColor, opaqueColor);
};

export const toStringFromColorStrings = (colors: string[][]): string =>
  colors.map((color) => color.join(' ')).join('\n');
