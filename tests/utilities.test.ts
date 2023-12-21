import { extendMatchers } from './utils';
import { toColor } from '../src';

beforeEach(extendMatchers);

describe('utilities', () => {
  test('toColor', () => {
    expect(toColor('red')).toBeCloseToColor('#ff0000');
    expect(toColor('invalid')).toBeCloseToColor('#000000');
  });
});
