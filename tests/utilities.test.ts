import { extendMatchers } from './utils';
import { toColor, toColorString } from '../src';

beforeEach(extendMatchers);

describe('utilities', () => {
  test('toColor', () => {
    expect(toColor('red')).toBeCloseToColor('#ff0000');
    expect(toColor('invalid')).toBeCloseToColor('#000000');
  });

  test('toColorString', () => {
    expect(toColorString('red')).toBe('#ff0000');
    expect(toColorString('rgba(255 0 0 / 0.5)')).toBe('#ff000080');
    expect(toColorString('red', 'hex6')).toBe('#ff0000');
    expect(toColorString('red', 'hex8')).toBe('#ff0000ff');
    expect(toColorString('lab(50 0 0 / 25%)', 'rgb')).toBe('rgba(119, 119, 119, 0.25)');
    expect(toColorString('yellow', 'hsl')).toBe('hsl(60 100% 50%)');
  });
});
