import { Element, Stack, Text } from '@codesandbox/components';
import { json } from 'overmind';
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { DeleteIcon, SwitchIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';
import { PresetMenu } from './PresetMenu';

const Styled = styled(Element) <{
  width: string;
  height: string;
  theme: any;
  scale: number;
}>`
  height: 100%;

  > div {
    overflow: auto;
    margin: auto;
    background: ${props => props.theme['sideBar.background']};
    height: 100%;
    position: relative;
  }

  iframe {
    width: ${props => props.width};
    height: ${props => props.height};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(${props => props.scale});
    display: block;
  }
`;

export const ResponsiveWrapper = ({
  on,
  props: { theme, state, actions },
  children,
}: ResponsiveWrapperProps) => {
  const {
    responsive: { scale: defaultScale, resolution, presets },
  } = state;
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('100%');
  const [scale, setScale] = useState<number>(defaultScale / 100);

  const defaultWidth =
    document.getElementById('sandbox-preview-container')?.clientWidth - 20;
  const defaultHeight =
    document.getElementById('sandbox-preview-container')?.clientHeight - 100;

  useEffect(() => {
    const [w, h] = resolution;
    setWidth(w + 'px');
    setHeight(h + 'px');
    let scaleToSet = 1;

    if (w > defaultWidth) {
      scaleToSet = defaultWidth / w;
    }

    if (h > defaultHeight) {
      const heightToSet = defaultHeight / h;
      if (heightToSet < scaleToSet) {
        scaleToSet = heightToSet;
      }
    }

    setScale(scaleToSet);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolution]);

  if (!on) return children;

  const [resolutionWidth, resolutionHeight] = resolution;

  return (
    <>
      <Element
        paddingTop={4}
        paddingX={6}
        style={{ background: theme['sideBar.background'] }}
      >
        <Stack justify="space-between" paddingBottom={2} align="center">
          <Stack gap={1}>
            <Stack align="center" gap={1}>
              <Text style={{ userSelect: 'none' }} size={2}>
                {resolutionWidth}{' '}
              </Text>
              <button
                type="button"
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  actions.setResolution(json(resolution).reverse())
                }
              >
                <SwitchIcon color={theme['sideBar.foreground']} />
              </button>{' '}
              <Text style={{ userSelect: 'none' }}>{resolutionHeight}</Text>
              <button
                type="button"
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onClick={actions.openDeletePresetModal}
              >
                <DeleteIcon />
              </button>
            </Stack>
            <Text size={2}>({Math.floor(scale * 100)}%)</Text>
          </Stack>
          <PresetMenu
            onSelect={preset => actions.setResolution(preset)}
            theme={theme}
            resolution={resolution}
            presets={presets}
          />
        </Stack>
      </Element>
      <Styled scale={scale} width={width} height={height}>
        <div>{children}</div>
      </Styled>
    </>
  );
};
