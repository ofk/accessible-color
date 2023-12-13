import { css } from '@emotion/css';
import { formatRgb, samples } from 'culori';
import React, { useEffect, useState } from 'react';

import { Col, ColButton } from './Col';
import { ColorChunkControlCol } from './ColorChunkControlCol';
import { ColorExample } from './ColorExample';
import { Checkbox, Input, RadioButtons } from './formControls';
import { Row } from './Row';
import { gray, toColor } from '../../src';
import { getInitialColorChunk, toColorsSetFromColorChunk } from '../utils/colorChunk';
import type { ColorChunk } from '../utils/colorChunk';
import {
  colorUniversalDesign,
  openColors,
  spectrumDarkColors,
  spectrumLightColors,
} from '../utils/colors';
import { toColorString } from '../utils/colorUtils';

const toStringFromColorStrings = (colors: string[][]): string =>
  colors.map((color) => color.join(' ')).join('\n');

const initialColorChunks: ColorChunk[] = [
  {
    type: 'gray',
    args: [[1.1, 1.25, 1.5, 2, 3, 5, 8, 12].join(' '), ''],
  },
  {
    type: 'translucent-gray',
    args: [[1.1, 1.25, 1.5, 2, 3, 5, 8, 12].join(' ')],
  },
  {
    type: 'color',
    args: [
      samples(13)
        .slice(0, -1)
        .map((i) => (i * 360).toFixed(2))
        .join(' '),
      [1.1, 1.25, 1.5, 2, 3, 5, 8, 12].join(' '),
      '',
    ],
  },
  {
    type: 'raw',
    args: [toStringFromColorStrings(openColors)],
  },
  {
    type: 'raw',
    args: [toStringFromColorStrings(spectrumLightColors)],
  },
  {
    type: 'raw',
    args: [toStringFromColorStrings(spectrumDarkColors)],
  },
  {
    type: 'raw',
    args: [toStringFromColorStrings(colorUniversalDesign)],
  },
];

export const App: React.FC = () => {
  const [backgroundColorType, setBackgroundColorType] = useState('light');
  const [backgroundContrast, setBackgroundContrast] = useState(1.05);
  const [backgroundRawColor, setBackgroundRawColor] = useState('white');
  const [backgroundColor, setBackgroundColor] = useState(toColor('white'));
  const [simulationStyle, setSimulationStyle] = useState('normal');
  const [outputStyle, setOutputStyle] = useState('hex');
  const [visibleExample, setVisibleExample] = useState(true);
  const [visiblePalette, setVisiblePalette] = useState(true);
  const [visibleContrast, setVisibleContrast] = useState(true);
  const [visibleInfomation, setVisibleInfomation] = useState(false);
  const [noneMode, setNoneMode] = useState(false);
  const [colorChunks, setColorChunks] = useState<ColorChunk[]>(initialColorChunks);
  useEffect(() => {
    try {
      switch (backgroundColorType) {
        case 'light':
          {
            const bgColor = gray('white', backgroundContrast);
            setBackgroundColor(bgColor);
            setBackgroundRawColor(toColorString(bgColor, outputStyle));
          }
          break;
        case 'dark':
          {
            const bgColor = gray('black', backgroundContrast);
            setBackgroundColor(bgColor);
            setBackgroundRawColor(toColorString(bgColor, outputStyle));
          }
          break;
        default:
          setBackgroundColor(toColor(backgroundRawColor));
          break;
      }
    } catch (e) {
      // noop
    }
  }, [backgroundColorType, backgroundContrast, backgroundRawColor, outputStyle]);
  return (
    <div
      className={css`
        font-size: 13px;
      `}
    >
      <h1>accessible-color example</h1>
      <div>
        <div>
          Basecoat:
          <RadioButtons
            name="backgroundColorType"
            value={backgroundColorType}
            setValue={setBackgroundColorType}
            options={[
              { value: 'light', label: '+' },
              {
                value: 'dark',
                label: (
                  <>
                    -{' '}
                    <input
                      type="number"
                      min={1}
                      step={0.1}
                      value={backgroundContrast}
                      onChange={(e): void => {
                        setBackgroundContrast(Number(e.target.value));
                      }}
                      className={css`
                        width: 3em;
                      `}
                    />
                  </>
                ),
              },
              {
                value: 'color',
                label: (
                  <Input
                    value={backgroundRawColor}
                    setValue={setBackgroundRawColor}
                    className={css`
                      width: 5em;
                    `}
                  />
                ),
              },
            ]}
          />{' '}
          / Output:
          <RadioButtons
            name="outputStyle"
            value={outputStyle}
            setValue={setOutputStyle}
            options={['hex', 'rgb', 'hsl']}
          />{' '}
          /{' '}
          <Checkbox
            checked={visibleExample}
            setChecked={(nextChecked): void => {
              if (!nextChecked) setVisiblePalette(true);
              setVisibleExample(nextChecked);
            }}
            label="example"
            disabled={noneMode}
          />{' '}
          <Checkbox
            checked={visiblePalette}
            setChecked={(nextChecked): void => {
              if (!nextChecked) setVisibleExample(true);
              setVisiblePalette(nextChecked);
            }}
            label="palette"
            disabled={noneMode}
          />{' '}
          <Checkbox
            checked={visibleContrast}
            setChecked={(nextChecked): void => {
              if (nextChecked) setVisiblePalette(true);
              setVisibleContrast(nextChecked);
            }}
            label="contrast"
            disabled={noneMode}
          />{' '}
          <Checkbox
            checked={visibleInfomation}
            setChecked={(nextChecked): void => {
              if (nextChecked) setVisiblePalette(true);
              setVisibleInfomation(nextChecked);
            }}
            label="infomation"
            disabled={noneMode}
          />{' '}
          <Checkbox
            checked={noneMode}
            setChecked={(nextChecked): void => {
              setNoneMode(nextChecked);
            }}
            label="none"
          />{' '}
          / Simulation:
          <RadioButtons
            name="simulationStyle"
            value={simulationStyle}
            setValue={setSimulationStyle}
            options={['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']}
          />
        </div>
        {colorChunks.map((colorChunk, i) => (
          <Row
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            <Col>
              <ColButton
                onClick={(): void => {
                  setColorChunks((prevColorChunks) => {
                    const nextColorChunks = [...prevColorChunks];
                    nextColorChunks.splice(i, 1);
                    return nextColorChunks;
                  });
                }}
              >
                -
              </ColButton>
              <br />
              <ColButton
                onClick={(): void => {
                  setColorChunks((prevColorChunks) => {
                    const nextColorChunks = [...prevColorChunks];
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    nextColorChunks.splice(i, 0, { ...prevColorChunks[i]! });
                    return nextColorChunks;
                  });
                }}
              >
                %
              </ColButton>
            </Col>
            <ColorChunkControlCol
              colorChunk={colorChunk}
              setColorChunk={(nextColorChunk): void => {
                setColorChunks((prevColorChunks) => {
                  const nextColorChunks = [...prevColorChunks];
                  nextColorChunks[i] = nextColorChunk;
                  return nextColorChunks;
                });
              }}
            />
            <Col
              className={css`
                flex: 1;
                background-color: ${formatRgb(backgroundColor)};
              `}
            >
              {toColorsSetFromColorChunk(backgroundColor, colorChunk).map((colorsSet, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={j}>
                  {colorsSet.map((color, k) => (
                    <ColorExample
                      // eslint-disable-next-line react/no-array-index-key
                      key={k}
                      backgroundColor={backgroundColor}
                      color={color}
                      simulationStyle={simulationStyle}
                      outputStyle={outputStyle}
                      hideMargin={noneMode}
                      hideExample={noneMode || !visibleExample}
                      hidePalette={!visiblePalette}
                      hideOutput={noneMode}
                      hideContrast={noneMode || !visibleContrast}
                      hideInfomation={noneMode || !visibleInfomation}
                    />
                  ))}
                </div>
              ))}
            </Col>
          </Row>
        ))}
        <Row>
          <Col>
            <ColButton
              onClick={(): void => {
                setColorChunks((prevColorChunks) => [
                  ...prevColorChunks,
                  getInitialColorChunk('raw'),
                ]);
              }}
            >
              +
            </ColButton>
          </Col>
        </Row>
      </div>
    </div>
  );
};
