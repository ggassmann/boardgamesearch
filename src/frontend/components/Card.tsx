import * as React from 'react';
import { dp1, dp8, transitionDpHigh, transitionDpLow } from 'src/frontend/components/Elevation';
import styled, { css } from 'src/frontend/styled';
import { getColor } from '../Theme';
import { Box, IBoxProps } from './Box';

interface ICardProps extends IBoxProps {
  hoverEffect?: boolean;
}

export const Card = styled(({hoverEffect, ...rest}: ICardProps) => <Box {...rest}/>)`
  ${dp1}
  border-radius: 4px;
  background-color: ${getColor({ type: 'background', color: 'neutral', brightness: 'light' })};

  padding: 6px;

  ${transitionDpLow}

  ${({ hoverEffect }: ICardProps) => hoverEffect && css`
    &:hover {
      ${dp8}
      ${transitionDpHigh}
    }
  `}
`;
