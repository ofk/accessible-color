import { css } from '@emotion/css';
import {
  blend,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  formatRgb,
  wcagContrast,
  wcagLuminance,
} from 'culori';
import type { Color } from 'culori';
import React from 'react';

import { toColorString } from '../utils/colorUtils';

const simulateColor = (color: Color, style: string): Color => {
  switch (style) {
    case 'protanopia':
      return filterDeficiencyProt(1)(color);
    case 'deuteranopia':
      return filterDeficiencyDeuter(1)(color);
    case 'tritanopia':
      return filterDeficiencyTrit(1)(color);
    case 'achromatopsia':
      return filterGrayscale()(color);
    default:
      return color;
  }
};

export const ColorExample: React.FC<{
  backgroundColor: Color;
  color: Color;
  simulationStyle: string;
  outputStyle: string;
  hideMargin?: boolean;
  hideExample?: boolean;
  hidePalette?: boolean;
  hideOutput?: boolean;
  hideContrast?: boolean;
  hideInfomation?: boolean;
}> = ({
  backgroundColor,
  color,
  simulationStyle,
  outputStyle,
  hideMargin,
  hideExample,
  hidePalette,
  hideOutput,
  hideContrast,
  hideInfomation,
}) => {
  const opaqueColor = blend([backgroundColor, color]);
  const displayColor = simulateColor(color, simulationStyle);
  return (
    <div
      className={css`
        display: inline-block;
        width: 12em;
        padding: ${hideMargin ? 0 : '0.5em'};
        color: ${formatRgb(displayColor)};
      `}
    >
      {hideExample ? null : (
        <div>
          Text <b>Bold</b>{' '}
          <span
            className={css`
              padding: 1px 3px;
              border: 1px solid;
            `}
          >
            Box
          </span>{' '}
          <span
            className={css`
              padding: 2px 4px;
              color: ${wcagLuminance(opaqueColor) < 0.5 ? 'white' : 'black'};
              background-color: ${formatRgb(displayColor)};
            `}
          >
            Fill
          </span>
        </div>
      )}
      {hidePalette ? null : (
        <div
          className={css`
            padding: 0.5em;
            color: ${wcagLuminance(opaqueColor) < 0.5 ? 'white' : 'black'};
            background-color: ${formatRgb(displayColor)};
          `}
        >
          {hideOutput ? '\u00A0' : toColorString(color, outputStyle)}
          {hideContrast ? null : (
            <>
              <br />
              <small>WCAG Contrast: {wcagContrast(backgroundColor, opaqueColor).toFixed(2)}</small>
            </>
          )}
          {hideInfomation
            ? null
            : ['luminance', 'rgb', 'hsl', 'hsv', 'hsi', 'lab', 'lch', 'oklab', 'oklch'].map(
                (out) => (
                  <React.Fragment key={out}>
                    <br />
                    <small>{toColorString(color, out)}</small>
                  </React.Fragment>
                ),
              )}
        </div>
      )}
    </div>
  );
};
