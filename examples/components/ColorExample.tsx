import { simulate } from '@bjornlu/colorblind';
import { css } from '@emotion/css';
import chroma from 'chroma-js';
import React from 'react';

import { mixColor } from '../../src';
import { toColorString } from '../utils/colorUtils';

const simulateColor = (color: chroma.Color, style: string): chroma.Color => {
  if (
    style === 'protanopia' ||
    style === 'deuteranopia' ||
    style === 'tritanopia' ||
    style === 'achromatopsia'
  ) {
    const rgba = color.rgba();
    const rgb = simulate({ r: rgba[0], g: rgba[1], b: rgba[2] }, style);
    return chroma(rgb.r, rgb.g, rgb.b, rgba[3]);
  }
  return color;
};

export const ColorExample: React.FC<{
  backgroundColor: chroma.Color;
  color: chroma.Color;
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
  const opaqueColor = mixColor(backgroundColor, color);
  const displayColor = simulateColor(color, simulationStyle);
  return (
    <div
      className={css`
        display: inline-block;
        width: 12em;
        padding: ${hideMargin ? 0 : '0.5em'};
        color: ${displayColor.css()};
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
              color: ${opaqueColor.luminance() < 0.5 ? 'white' : 'black'};
              background-color: ${displayColor.css()};
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
            color: ${opaqueColor.luminance() < 0.5 ? 'white' : 'black'};
            background-color: ${displayColor.css()};
          `}
        >
          {hideOutput ? '\u00A0' : toColorString(color, outputStyle)}
          {hideContrast ? null : (
            <>
              <br />
              <small>
                WCAG Contrast: {chroma.contrast(backgroundColor, opaqueColor).toFixed(2)}
              </small>
            </>
          )}
          {hideInfomation
            ? null
            : ['luminance', 'rgb', 'hsl', 'hsv', 'hsi', 'lab', 'lch'].map((out) => (
                <React.Fragment key={out}>
                  <br />
                  <small>{toColorString(color, out)}</small>
                </React.Fragment>
              ))}
        </div>
      )}
    </div>
  );
};
