import type chroma from 'chroma-js';

import { color, gray, toColor } from '../../src';

export type ColorChunk =
  | {
      type: 'raw';
      args: [string];
    }
  | {
      type: 'gray';
      args: [string];
    }
  | {
      type: 'color';
      args: [string, string];
    };

export const colorChunkTemplates = [
  {
    type: 'raw',
    inputPropsSet: [
      {
        multiple: true,
        placeholder: 'color1 color2 ...',
      },
    ],
  },
  {
    type: 'gray',
    inputPropsSet: [
      {
        placeholder: 'contrast1 contrast2 ...',
      },
    ],
  },
  {
    type: 'color',
    inputPropsSet: [
      {
        placeholder: 'hue1 hue2 ...',
      },
      {
        placeholder: 'contrast1 contrast2 ...',
      },
    ],
  },
];

export const getInitialColorChunk = (type: ColorChunk['type']): ColorChunk => {
  switch (type) {
    case 'raw':
    case 'gray':
      return { type, args: [''] };
    case 'color':
      return { type, args: ['', ''] };
    default:
      throw new Error(`Not support type: ${type}`);
  }
};

export const updateColorChunkArg = <T extends ColorChunk>(
  colorChunk: T,
  index: number,
  arg: string
): T => {
  const args = [...colorChunk.args];
  args[index] = arg;
  return { ...colorChunk, args };
};

const splitWithBreak = (str: string): string[] => {
  const trimedStr = str.trim();
  return trimedStr ? trimedStr.split(/(?:\r\n?|\n)+/) : [];
};

const splitWithSpace = (str: string): string[] => {
  const trimedStr = str.trim();
  return trimedStr ? trimedStr.split(/\s+/) : [];
};

export const toColorsSetFromColorChunk = (
  backgroundColor: chroma.Color,
  colorChunk: ColorChunk
): chroma.Color[][] => {
  switch (colorChunk.type) {
    case 'raw':
      return splitWithBreak(colorChunk.args[0]).map((colorsText) =>
        splitWithSpace(colorsText).map(toColor)
      );
    case 'gray':
      return [splitWithSpace(colorChunk.args[0]).map((s) => gray(backgroundColor, parseFloat(s)))];
    case 'color':
      return splitWithSpace(colorChunk.args[0]).map((sHue) =>
        splitWithSpace(colorChunk.args[1]).map((sContrast) =>
          color(backgroundColor, parseFloat(sContrast), parseFloat(sHue))
        )
      );
    default:
      throw new Error(`Not support type: ${(colorChunk as { type: string }).type}`);
  }
};
