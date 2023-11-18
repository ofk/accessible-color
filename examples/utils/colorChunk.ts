import type chroma from 'chroma-js';

import { color, gray, toColor, translucent } from '../../src';

export type ColorChunk =
  | {
      type: 'raw';
      args: [string];
    }
  | {
      type: 'gray';
      args: [string, string];
    }
  | {
      type: 'translucent-gray';
      args: [string];
    }
  | {
      type: 'color';
      args: [string, string, string];
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
      {
        placeholder: 'alpha',
      },
    ],
  },
  {
    type: 'translucent-gray',
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
      {
        placeholder: 'alpha',
      },
    ],
  },
];

export const getInitialColorChunk = (type: ColorChunk['type']): ColorChunk => {
  switch (type) {
    case 'raw':
    case 'translucent-gray':
      return { type, args: [''] };
    case 'gray':
      return { type, args: ['', ''] };
    case 'color':
      return { type, args: ['', '', ''] };
    default:
      throw new Error(`Not support type: ${type as string}`);
  }
};

export const updateColorChunkArg = <T extends ColorChunk>(
  colorChunk: T,
  index: number,
  arg: string,
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
  colorChunk: ColorChunk,
): chroma.Color[][] => {
  switch (colorChunk.type) {
    case 'raw':
      return splitWithBreak(colorChunk.args[0]).map((colorsText) =>
        splitWithSpace(colorsText).map(toColor),
      );
    case 'gray':
      return [
        splitWithSpace(colorChunk.args[0]).map((s) =>
          gray(backgroundColor, parseFloat(s), parseFloat(colorChunk.args[1]) || 1),
        ),
      ];
    case 'translucent-gray':
      return [
        splitWithSpace(colorChunk.args[0]).map((s) =>
          translucent(backgroundColor, gray(backgroundColor, parseFloat(s))),
        ),
      ];
    case 'color':
      return splitWithSpace(colorChunk.args[0]).map((sHue) =>
        splitWithSpace(colorChunk.args[1]).map((sContrast) =>
          color(
            backgroundColor,
            parseFloat(sContrast),
            parseFloat(sHue),
            parseFloat(colorChunk.args[2]) || 1,
          ),
        ),
      );
    default:
      throw new Error(`Not support type: ${(colorChunk as { type: string }).type}`);
  }
};
