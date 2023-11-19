import { wcagLuminance } from 'culori';

import { calcLuminance } from '../src/luminance';

describe('luminance', () => {
  test('calcLuminance', () => {
    expect(calcLuminance(wcagLuminance('white'), 1)).toBe(1);
    expect(calcLuminance(1, 1.25)).toBeCloseTo(0.79);
    expect(calcLuminance(0.79, -1.25)).toBeCloseTo(1);

    expect(calcLuminance(wcagLuminance('black'), 1)).toBe(0);
    expect(calcLuminance(0, 1.5)).toBeCloseTo(0.025);
    expect(calcLuminance(0.025, -1.5)).toBeCloseTo(0);
  });
});
