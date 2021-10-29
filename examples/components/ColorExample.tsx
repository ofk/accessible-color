import { css } from '@emotion/css';
import chroma from 'chroma-js';
import React from 'react';

import { mixColor, toColorString } from '../utils/colorUtils';

export const ColorExample: React.FC<{
  backgroundColor: chroma.Color;
  color: chroma.Color;
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
  outputStyle,
  hideMargin,
  hideExample,
  hidePalette,
  hideOutput,
  hideContrast,
  hideInfomation,
}) => {
  const opaqueColor = mixColor(backgroundColor, color);
  return (
    <div
      className={css`
        display: inline-block;
        width: 12em;
        padding: ${hideMargin ? 0 : '0.5em'};
        color: ${color.css()};
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
              background-color: ${color.css()};
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
            background-color: ${color.css()};
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
