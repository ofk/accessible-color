export const toColorString = (color: chroma.Color, outputStyle: string): string => {
  const rnd = (num: number): number => Math.round(num * 100) / 100;

  const tos = (nums: number[], types: string[]): string =>
    nums
      .map((num, i) => {
        const type = types[i] || '-';
        return type === '%' ? `${rnd((num || 0) * 100)}%` : `${rnd(num || 0)}`;
      })
      .join(',');

  switch (outputStyle) {
    case 'luminance':
      return `luminance: ${color.luminance().toFixed(4)}`;
    case 'rgb':
      return color.css();
    case 'hsl':
      return color.css('hsl');
    case 'hsv':
      return `hsv(${tos(color.hsv(), ['-', '%', '%'])})`;
    case 'hsi':
      return `hsi(${tos(color.hsi(), ['-', '%', '%'])})`;
    case 'lab':
      return `lab(${tos(color.lab(), ['-', '-', '-'])})`;
    case 'lch':
      return `lch(${tos(color.lch(), ['-', '-', '-'])})`;
    case 'hex':
      return color.hex();
    default:
      return '';
  }
};
