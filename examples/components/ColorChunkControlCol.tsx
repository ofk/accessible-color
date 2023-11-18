import { css } from '@emotion/css';
import React from 'react';

import { Col } from './Col';
import { Input, Select } from './formControls';
import type { ColorChunk } from '../utils/colorChunk';
import {
  colorChunkTemplates,
  getInitialColorChunk,
  updateColorChunkArg,
} from '../utils/colorChunk';

export const ColorChunkControlCol: React.FC<{
  colorChunk: ColorChunk;
  setColorChunk: (nextColorChunk: ColorChunk) => void;
}> = ({ colorChunk, setColorChunk }) => (
  <Col>
    <div>
      <Select
        value={colorChunk.type}
        setValue={(nextValue): void => {
          setColorChunk(getInitialColorChunk(nextValue as ColorChunk['type']));
        }}
        options={colorChunkTemplates.map(({ type }) => type)}
      />
    </div>
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      colorChunkTemplates
        .find((cctmpl) => cctmpl.type === colorChunk.type)!
        .inputPropsSet.map((iTmpl, j) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={j}>
            <Input
              {...iTmpl}
              className={css`
                box-sizing: border-box;
                width: 12em;
              `}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              value={colorChunk.args[j]!}
              setValue={(nextValue): void => {
                setColorChunk(updateColorChunkArg(colorChunk, j, nextValue));
              }}
            />
          </div>
        ))
    }
  </Col>
);
