import { css, cx } from '@emotion/css';
import type { Color } from 'culori';
import { blend, formatRgb, wcagLuminance } from 'culori';
import React from 'react';

import { calcContrast, simulateColor, toColorString } from '../utils/colorUtils';

export const ColorExample: React.FC<{
  className?: string;
  backgroundColor: Color;
  color: Color;
  simulationStyle: string;
}> = ({ className, backgroundColor, color, simulationStyle }) => {
  const opaqueColor = blend(['white', backgroundColor, color]);
  const displayColor = simulateColor(color, simulationStyle);
  return (
    <div
      className={cx(
        className,
        css`
          color: ${formatRgb(displayColor)};
        `,
      )}
    >
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
  );
};

export const ColorPalette: React.FC<{
  className?: string;
  backgroundColor: Color;
  color: Color;
  simulationStyle: string;
  outputStyle?: string;
  infomation?: string[];
}> = ({ className, backgroundColor, color, simulationStyle, outputStyle, infomation }) => {
  const opaqueColor = blend(['white', backgroundColor, color]);
  const displayColor = simulateColor(color, simulationStyle);
  return (
    <div
      className={cx(
        className,
        css`
          color: ${wcagLuminance(opaqueColor) < 0.5 ? 'white' : 'black'};
          background-color: ${formatRgb(displayColor)};
        `,
      )}
    >
      {outputStyle ? toColorString(outputStyle, color) : '\u00A0'}
      {infomation?.map((info, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          <br />
          <small>
            {info === 'contrast'
              ? `contrast: ${calcContrast(displayColor, backgroundColor).toFixed(2)}`
              : toColorString(info, color)}
          </small>
        </React.Fragment>
      ))}
    </div>
  );
};
