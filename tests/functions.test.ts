import { blend } from 'culori';

import { extendMatchers } from './utils';
import { color, gray, translucent } from '../src';

beforeEach(extendMatchers);

describe('functions', () => {
  test('translucent', () => {
    expect(translucent('white', 'black', '#999')).toBeCloseToColor('#00000066');
    expect(translucent('black', 'white', '#999')).toBeCloseToColor('#ffffff99');
    expect(translucent('white', '#999')).toBeCloseToColor('#00000066');
    expect(translucent('black', '#999')).toBeCloseToColor('#ffffff99');
  });

  test('gray', () => {
    ['white', 'black'].forEach((background) => {
      [1, 1.5, 15].forEach((contrast) => {
        expect(gray(background, contrast)).toBeCloseToContrast(contrast, background);
      });
      expect(gray(gray(background, 1.5), -1.5)).toBeCloseToColor(background);
      expect(gray(gray(background, 15), 15)).toBeCloseToColor(background);
      expect(gray(background, 1.5, 0.5).alpha).toBeCloseTo(0.5);
      expect(blend([background, gray(background, 1.5, 0.5)])).toBeCloseToContrast(1.5, background);
    });
  });

  test('color', () => {
    ['white', 'black'].forEach((background) => {
      [0, 30, 210].forEach((hue) => {
        [1.5, 4].forEach((contrast) => {
          expect(color(background, contrast, hue)).toBeCloseToContrast(contrast, background);
          expect(color(background, contrast, hue)).toBeCloseToHue(hue);
        });
      });
    });
  });
});
