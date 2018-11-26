import { createElement } from 'react';
import styled, { css } from '../styled';

export interface IBoxProps {
  grow?: number;
  shrink?: number;
  basis?: number;
  verticalAlign?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
}

export const Box = styled(({ element = 'div', children, ...props }) => createElement(element, props, children))`
  flex: 1;
  ${({ grow }: IBoxProps) => grow && css`flex-grow: ${grow};` || ''}
  ${({ shrink }: IBoxProps) => shrink && css`flex-shrink: ${shrink};` || ''}
  ${({ basis }: IBoxProps) => basis && css`flex-basis: ${basis};` || ''}
  ${({ verticalAlign }: IBoxProps) => verticalAlign && css`align-self: ${verticalAlign};` || ''}
`;
