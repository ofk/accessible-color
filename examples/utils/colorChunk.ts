import chroma from 'chroma-js';

export type ColorChunk = {
  type: 'raw';
  args: [string];
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
];

export const getInitialColorChunk = (type: ColorChunk['type']): ColorChunk => {
  switch (type) {
    case 'raw':
      return { type, args: [''] };
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

const toColor = (value: string): chroma.Color => {
  try {
    return chroma(value);
  } catch (e: unknown) {
    return chroma(0, 0, 0);
  }
};

export const toColorsSetFromColorChunk = (colorChunk: ColorChunk): chroma.Color[][] => {
  switch (colorChunk.type) {
    case 'raw':
      return splitWithBreak(colorChunk.args[0]).map((colorsText) =>
        splitWithSpace(colorsText).map(toColor)
      );
    default:
      throw new Error(`Not support type: ${colorChunk.type}`);
  }
};
