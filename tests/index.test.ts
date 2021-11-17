import chroma from 'chroma-js';

import { color, gray, toColor, translucent } from '../src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /* eslint-disable @typescript-eslint/method-signature-style */
      toBeCloseToColor(expected: chroma.Color | string): R;
      toBeGreaterThanOrEqualContrast(contrast: number, background: chroma.Color | string): R;
      toBeCloseToHue(hue: number, tolerance?: number): R;
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
    toBeCloseToHue(
      received: chroma.Color | string,
      hue: number,
      tolerance = 2
    ): jest.CustomMatcherResult {
      const actualHue = chroma(received).hsl()[0];
      const diffHue = Math.abs(actualHue - hue) % 360;
      const pass = Math.min(diffHue, 360 - diffHue) < tolerance;
      const message = (): string =>
        `expected hue ${actualHue} of ${received} ${pass ? '' : 'not '}to be hue ${hue}`;
      return { pass, message };
    },
  });
});

describe('functions', () => {
  test('toColor', () => {
    expect(toColor('red')).toBeCloseToColor('#ff0000');
    expect(toColor('invalid')).toBeCloseToColor('#000000');
  });

  test('translucent', () => {
    expect(translucent('white', 'black', '#999')).toBeCloseToColor('#00000066');
    expect(translucent('black', 'white', '#999')).toBeCloseToColor('#ffffff99');
    expect(translucent('white', '#999')).toBeCloseToColor('#00000066');
    expect(translucent('black', '#999')).toBeCloseToColor('#ffffff99');
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

  test('color', () => {
    ['white', 'black'].forEach((background) => {
      [0, 30, 210].forEach((hue) => {
        [1.5, 4].forEach((contrast) => {
          expect(color(background, contrast, hue)).toBeGreaterThanOrEqualContrast(
            contrast,
            background
          );
          expect(color(background, contrast, hue)).toBeCloseToHue(hue);
        });
      });
    });
  });
});
