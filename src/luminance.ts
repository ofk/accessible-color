// cf. https://github.com/gka/chroma.js/blob/master/src/utils/contrast.js

const calcBrightLuminance = (backgroundLuminance: number, contrast: number): number =>
  (backgroundLuminance + 0.05) * contrast - 0.05;

const calcDarkLuminance = (backgroundLuminance: number, contrast: number): number =>
  (backgroundLuminance + 0.05) / contrast - 0.05;

export const calcLuminance = (backgroundLuminance: number, signedContrast: number): number => {
  if (backgroundLuminance > 0.5) {
    if (signedContrast > 0) return calcDarkLuminance(backgroundLuminance, signedContrast);
    return calcBrightLuminance(backgroundLuminance, -signedContrast);
  }
  if (signedContrast > 0) return calcBrightLuminance(backgroundLuminance, signedContrast);
  return calcDarkLuminance(backgroundLuminance, -signedContrast);
};
