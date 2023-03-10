import { css } from '@emotion/css';
import chroma from 'chroma-js';
import React, { useEffect, useState } from 'react';

import { gray } from '../../src';
import type { ColorChunk } from '../utils/colorChunk';
import { getInitialColorChunk, toColorsSetFromColorChunk } from '../utils/colorChunk';
import { toColorString } from '../utils/colorUtils';
import { Col, ColButton } from './Col';
import { ColorChunkControlCol } from './ColorChunkControlCol';
import { ColorExample } from './ColorExample';
import { Checkbox, Input, RadioButtons } from './formControls';
import { Row } from './Row';

// cf. https://spectrum.adobe.com/page/color/
const specLightGrayColors = [
  '#ffffff',
  '#fafafa',
  '#f5f5f5',
  '#eaeaea',
  '#e1e1e1',
  '#cacaca',
  '#b3b3b3',
  '#8e8e8e',
  '#6e6e6e',
  '#4b4b4b',
  '#2c2c2c',
];
const specLightBlueColors = ['#2680eb', '#1473e6', '#0d66d0', '#095aba'];
const specLightRedColors = ['#e34850', '#d7373f', '#c9252d', '#bb121a'];
const specLightOrangeColors = ['#e68619', '#da7b11', '#cb6f10', '#bd640d'];
const specLightGreenColors = ['#2d9d78', '#268e6c', '#12805c', '#107154'];
const specDarkGrayColors = [
  '#252525',
  '#2f2f2f',
  '#323232',
  '#3e3e3e',
  '#4a4a4a',
  '#5a5a5a',
  '#6e6e6e',
  '#909090',
  '#b9b9b9',
  '#e3e3e3',
  '#ffffff',
];
const specDarkBlueColors = ['#2680eb', '#378ef0', '#4b9cf5', '#5aa9fa'];
const specDarkRedColors = ['#e34850', '#ec5b62', '#f76d74', '#ff7b82'];
const specDarkOrangeColors = ['#e68619', '#f29423', '#f9a43f', '#ffb55b'];
const specDarkGreenColors = ['#2d9d78', '#33ab84', '#39b990', '#3fc89c'];

// cf. https://jfly.uni-koeln.de/colorset/
const cudGrayColors = ['rgb(255,255,255)', 'rgb(200,200,203)', 'rgb(132,145,158)', 'rgb(0,0,0)'];
const cudBaseColors = [
  'rgb(255,202,191)',
  'rgb(255,255,128)',
  'rgb(216,242,85)',
  'rgb(191,228,255)',
  'rgb(255,202,128)',
  'rgb(119,217,168)',
  'rgb(201,172,230)',
];
const cudAccentColors = [
  'rgb(255,75,0)',
  'rgb(255,241,0)',
  'rgb(3,175,122)',
  'rgb(0,90,255)',
  'rgb(77,196,255)',
  'rgb(255,128,130)',
  'rgb(246,170,0)',
  'rgb(153,0,153)',
  'rgb(128,64,0)',
];

const initialColorChunks: ColorChunk[] = [
  {
    type: 'gray',
    args: [[1, 1.1, 1.25, 1.5, 2, 3, 8, 12].join(' '), ''],
  },
  {
    type: 'translucent-gray',
    args: [[1, 1.1, 1.25, 1.5, 2, 3, 8, 12].join(' ')],
  },
  {
    type: 'color',
    args: [
      cudAccentColors.map((c) => chroma(c).hsl()[0].toFixed(2)).join(' '),
      [1.25, 2, 3, 5, 8, 12].join(' '),
      '',
    ],
  },
  {
    type: 'color',
    args: [
      [
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        specLightBlueColors[0]!,
        specLightRedColors[0]!,
        specLightOrangeColors[0]!,
        specLightGreenColors[0]!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      ]
        .map((c) => chroma(c).hsl()[0].toFixed(2))
        .join(' '),
      [4, 4.5, 5.5, 6.5].join(' '),
      '',
    ],
  },
  {
    type: 'raw',
    args: [
      [
        specLightGrayColors.join(' '),
        specLightBlueColors.join(' '),
        specLightRedColors.join(' '),
        specLightOrangeColors.join(' '),
        specLightGreenColors.join(' '),
      ].join('\n'),
    ],
  },
  {
    type: 'raw',
    args: [
      [
        specDarkGrayColors.join(' '),
        specDarkBlueColors.join(' '),
        specDarkRedColors.join(' '),
        specDarkOrangeColors.join(' '),
        specDarkGreenColors.join(' '),
      ].join('\n'),
    ],
  },
  {
    type: 'raw',
    args: [
      [cudGrayColors.join(' '), cudBaseColors.join(' '), cudAccentColors.join(' ')].join('\n'),
    ],
  },
];

export const App: React.FC = () => {
  const [backgroundColorType, setBackgroundColorType] = useState('light');
  const [backgroundContrast, setBackgroundContrast] = useState(1.05);
  const [backgroundRawColor, setBackgroundRawColor] = useState('white');
  const [backgroundColor, setBackgroundColor] = useState(chroma('white'));
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
          setBackgroundColor(chroma(backgroundRawColor));
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
                background-color: ${backgroundColor.css()};
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
