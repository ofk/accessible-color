import chroma from 'chroma-js';

import { gray, toColor } from '../src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /* eslint-disable @typescript-eslint/method-signature-style */
      toBeCloseToColor(expected: chroma.Color | string): R;
      toBeGreaterThanOrEqualContrast(contrast: number, background: chroma.Color | string): R;
      /* eslint-enable @typescript-eslint/method-signature-style */
    }
  }
}

beforeEach(() => {
  expect.extend({
    toBeCloseToColor(
      received: chroma.Color | string,
      expected: chroma.Color | string
    ): jest.CustomMatcherResult {
      const receivedRgba = chroma(received).rgba();
      const expectedRgba = chroma(expected).rgba();
      const pass =
        Math.hypot(
          receivedRgba[0] - expectedRgba[0],
          receivedRgba[1] - expectedRgba[1],
          receivedRgba[2] - expectedRgba[2],
          receivedRgba[3] - expectedRgba[3]
        ) < 2;
      const message = (): string => `expected ${received} ${pass ? '' : 'not '}to be ${expected}`;
      return { pass, message };
    },
    toBeGreaterThanOrEqualContrast(
      received: chroma.Color | string,
      contrast: number,
      background: chroma.Color | string
    ): jest.CustomMatcherResult {
      const actualContrast = chroma.contrast(received, background);
      const pass = actualContrast >= contrast;
      const message = (): string =>
        `expected contrast ${actualContrast} between ${received} and ${background} ${
          pass ? '' : 'not '
        }to be greater than or equal contrast ${contrast}`;
      return { pass, message };
    },
  });
});

describe('functions', () => {
  test('toColor', () => {
    expect(toColor('red')).toBeCloseToColor('#ff0000');
    expect(toColor('invalid')).toBeCloseToColor('#000000');
  });

  test('gray', () => {
    ['white', 'black'].forEach((background) => {
      [1, 1.5, 15].forEach((contrast) => {
        expect(gray(background, contrast)).toBeGreaterThanOrEqualContrast(contrast, background);
      });
      expect(gray(gray(background, 1.5), -1.5)).toBeCloseToColor(background);
      expect(gray(gray(background, 15), 15)).toBeCloseToColor(background);
    });
  });
});
