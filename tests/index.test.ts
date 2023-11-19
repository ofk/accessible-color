import { formatCss, hsl, rgb, wcagContrast } from 'culori';
import type { Color } from 'culori';

import { color, gray, mixColor, toColor, translucent } from '../src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /* eslint-disable @typescript-eslint/method-signature-style */
      toBeCloseToColor(expected: Color | string): R;
      toBeGreaterThanOrEqualContrast(contrast: number, background: Color | string): R;
      toBeCloseToHue(hue: number, tolerance?: number): R;
      /* eslint-enable @typescript-eslint/method-signature-style */
    }
  }
}

beforeEach(() => {
  expect.extend({
    toBeCloseToColor(received: Color | string, expected: Color | string): jest.CustomMatcherResult {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const receivedRgba = rgb(received)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expectedRgba = rgb(expected)!;
      const pass =
        Math.hypot(
          receivedRgba.r - expectedRgba.r,
          receivedRgba.g - expectedRgba.g,
          receivedRgba.b - expectedRgba.b,
          (receivedRgba.alpha ?? 1) - (expectedRgba.alpha ?? 1),
        ) < 2;
      const message = (): string =>
        `expected ${formatCss(received)} ${pass ? '' : 'not '}to be ${formatCss(expected)}`;
      return { pass, message };
    },
    toBeGreaterThanOrEqualContrast(
      received: Color | string,
      contrast: number,
      background: Color | string,
    ): jest.CustomMatcherResult {
      const actualContrast = wcagContrast(received, background);
      const pass = actualContrast >= contrast;
      const message = (): string =>
        `expected contrast ${actualContrast} between ${formatCss(received)} and ${formatCss(
          background,
        )} ${pass ? '' : 'not '}to be greater than or equal contrast ${contrast}`;
      return { pass, message };
    },
    toBeCloseToHue(received: Color | string, hue: number, tolerance = 2): jest.CustomMatcherResult {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const actualHue = hsl(received)!.h!;
      const diffHue = Math.abs(actualHue - hue) % 360;
      const pass = Math.min(diffHue, 360 - diffHue) < tolerance;
      const message = (): string =>
        `expected hue ${actualHue} of ${formatCss(received)} ${pass ? '' : 'not '}to be hue ${hue}`;
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
      expect(gray(background, 1.5, 0.5).alpha).toBeCloseTo(0.5);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(mixColor(rgb(background)!, gray(background, 1.5, 0.5))).toBeGreaterThanOrEqualContrast(
        1.5,
        background,
      );
    });
  });

  test('color', () => {
    ['white', 'black'].forEach((background) => {
      [0, 30, 210].forEach((hue) => {
        [1.5, 4].forEach((contrast) => {
          expect(color(background, contrast, hue)).toBeGreaterThanOrEqualContrast(
            contrast,
            background,
          );
          expect(color(background, contrast, hue)).toBeCloseToHue(hue);
        });
      });
    });
  });
});
