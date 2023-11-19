import { css } from '@emotion/css';
import { formatRgb, hsl } from 'culori';
import React, { useEffect, useState } from 'react';

import { Col, ColButton } from './Col';
import { ColorChunkControlCol } from './ColorChunkControlCol';
import { ColorExample } from './ColorExample';
import { Checkbox, Input, RadioButtons } from './formControls';
import { Row } from './Row';
import { gray, toColor } from '../../src';
import { getInitialColorChunk, toColorsSetFromColorChunk } from '../utils/colorChunk';
import type { ColorChunk } from '../utils/colorChunk';
import { toColorString } from '../utils/colorUtils';

// cf. https://yeun.github.io/open-color/
const openColors = [
  [
    '#f8f9fa',
    '#f1f3f5',
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#adb5bd',
    '#868e96',
    '#495057',
    '#343a40',
    '#212529',
  ],
  [
    '#fff5f5',
    '#ffe3e3',
    '#ffc9c9',
    '#ffa8a8',
    '#ff8787',
    '#ff6b6b',
    '#fa5252',
    '#f03e3e',
    '#e03131',
    '#c92a2a',
  ],
  [
    '#fff0f6',
    '#ffdeeb',
    '#fcc2d7',
    '#faa2c1',
    '#f783ac',
    '#f06595',
    '#e64980',
    '#d6336c',
    '#c2255c',
    '#a61e4d',
  ],
  [
    '#f8f0fc',
    '#f3d9fa',
    '#eebefa',
    '#e599f7',
    '#da77f2',
    '#cc5de8',
    '#be4bdb',
    '#ae3ec9',
    '#9c36b5',
    '#862e9c',
  ],
  [
    '#f3f0ff',
    '#e5dbff',
    '#d0bfff',
    '#b197fc',
    '#9775fa',
    '#845ef7',
    '#7950f2',
    '#7048e8',
    '#6741d9',
    '#5f3dc4',
  ],
  [
    '#edf2ff',
    '#dbe4ff',
    '#bac8ff',
    '#91a7ff',
    '#748ffc',
    '#5c7cfa',
    '#4c6ef5',
    '#4263eb',
    '#3b5bdb',
    '#364fc7',
  ],
  [
    '#e7f5ff',
    '#d0ebff',
    '#a5d8ff',
    '#74c0fc',
    '#4dabf7',
    '#339af0',
    '#228be6',
    '#1c7ed6',
    '#1971c2',
    '#1864ab',
  ],
  [
    '#e3fafc',
    '#c5f6fa',
    '#99e9f2',
    '#66d9e8',
    '#3bc9db',
    '#22b8cf',
    '#15aabf',
    '#1098ad',
    '#0c8599',
    '#0b7285',
  ],
  [
    '#e6fcf5',
    '#c3fae8',
    '#96f2d7',
    '#63e6be',
    '#38d9a9',
    '#20c997',
    '#12b886',
    '#0ca678',
    '#099268',
    '#087f5b',
  ],
  [
    '#ebfbee',
    '#d3f9d8',
    '#b2f2bb',
    '#8ce99a',
    '#69db7c',
    '#51cf66',
    '#40c057',
    '#37b24d',
    '#2f9e44',
    '#2b8a3e',
  ],
  [
    '#f4fce3',
    '#e9fac8',
    '#d8f5a2',
    '#c0eb75',
    '#a9e34b',
    '#94d82d',
    '#82c91e',
    '#74b816',
    '#66a80f',
    '#5c940d',
  ],
  [
    '#fff9db',
    '#fff3bf',
    '#ffec99',
    '#ffe066',
    '#ffd43b',
    '#fcc419',
    '#fab005',
    '#f59f00',
    '#f08c00',
    '#e67700',
  ],
  [
    '#fff4e6',
    '#ffe8cc',
    '#ffd8a8',
    '#ffc078',
    '#ffa94d',
    '#ff922b',
    '#fd7e14',
    '#f76707',
    '#e8590c',
    '#d9480f',
  ],
];

// cf. https://spectrum.adobe.com/page/color/
const spectrumLightColors = [
  [
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
  ],
  ['#2680eb', '#1473e6', '#0d66d0', '#095aba'],
  ['#e34850', '#d7373f', '#c9252d', '#bb121a'],
  ['#e68619', '#da7b11', '#cb6f10', '#bd640d'],
  ['#2d9d78', '#268e6c', '#12805c', '#107154'],
];
const spectrumDarkColors = [
  [
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
  ],
  ['#2680eb', '#378ef0', '#4b9cf5', '#5aa9fa'],
  ['#e34850', '#ec5b62', '#f76d74', '#ff7b82'],
  ['#e68619', '#f29423', '#f9a43f', '#ffb55b'],
  ['#2d9d78', '#33ab84', '#39b990', '#3fc89c'],
];

// cf. https://jfly.uni-koeln.de/colorset/
const colorUniversalDesign = [
  ['rgb(255,255,255)', 'rgb(200,200,203)', 'rgb(132,145,158)', 'rgb(0,0,0)'],
  [
    'rgb(255,202,191)',
    'rgb(255,255,128)',
    'rgb(216,242,85)',
    'rgb(191,228,255)',
    'rgb(255,202,128)',
    'rgb(119,217,168)',
    'rgb(201,172,230)',
  ],
  [
    'rgb(255,75,0)',
    'rgb(255,241,0)',
    'rgb(3,175,122)',
    'rgb(0,90,255)',
    'rgb(77,196,255)',
    'rgb(255,128,130)',
    'rgb(246,170,0)',
    'rgb(153,0,153)',
    'rgb(128,64,0)',
  ],
];

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const cudAccentColors = colorUniversalDesign[2]!;

const toStringFromColorStrings = (colors: string[][]): string =>
  colors.map((color) => color.join(' ')).join('\n');

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
      cudAccentColors.map((c) => (hsl(toColor(c)).h ?? 0).toFixed(2)).join(' '),
      [1.25, 2, 3, 5, 8, 12].join(' '),
      '',
    ],
  },
  {
    type: 'color',
    args: [
      [
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        spectrumLightColors[1]![0]!,
        spectrumLightColors[2]![0]!,
        spectrumLightColors[3]![0]!,
        spectrumLightColors[4]![0]!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      ]
        .map((c) => (hsl(toColor(c)).h ?? 0).toFixed(2))
        .join(' '),
      [4, 4.5, 5.5, 6.5].join(' '),
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
