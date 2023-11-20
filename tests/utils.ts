import { differenceCiede2000, differenceHueNaive, formatCss, hsl, wcagContrast } from 'culori';
import type { Color } from 'culori';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /* eslint-disable @typescript-eslint/method-signature-style */
      toBeCloseToColor(expected: Color | string): R;
      toBeCloseToContrast(contrast: number, background: Color | string): R;
      toBeCloseToHue(hue: number, tolerance?: number): R;
      /* eslint-enable @typescript-eslint/method-signature-style */
    }
  }
}

export const extendMatchers = (): void => {
  expect.extend({
    toBeCloseToColor(received: Color | string, expected: Color | string): jest.CustomMatcherResult {
      const pass = differenceCiede2000()(received, expected) < 0.2;
      const message = (): string =>
        `expected ${formatCss(received)} ${pass ? '' : 'not '}to be ${formatCss(expected)}`;
      return { pass, message };
    },
    toBeCloseToContrast(
      received: Color | string,
      contrast: number,
      background: Color | string,
    ): jest.CustomMatcherResult {
      const actualContrast = wcagContrast(received, background);
      const pass = actualContrast >= contrast && actualContrast < contrast * 1.2;
      const message = (): string =>
        `expected contrast ${actualContrast} between ${formatCss(received)} and ${formatCss(
          background,
        )} ${pass ? '' : 'not '}to be equal contrast ${contrast}`;
      return { pass, message };
    },
    toBeCloseToHue(
      received: Color | string,
      hue: number,
      tolerance = 35,
    ): jest.CustomMatcherResult {
      const actualHue = hsl(received)?.h ?? 0;
      const pass = Math.abs(differenceHueNaive({ h: actualHue }, { h: hue })) < tolerance;
      const message = (): string =>
        `expected hue ${actualHue} of ${formatCss(received)} ${pass ? '' : 'not '}to be hue ${hue}`;
      return { pass, message };
    },
  });
};
