import { createElement } from 'react';
import styled, { css } from '../styled';

export interface IBoxProps {
  grow?: number;
  shrink?: number;
  basis?: number;
  verticalAlign?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  horizontalAlign?: 'center' | 'flex-start' | 'flex-end';
}

export const Box = styled(({ element = 'div', children, ...props }) => createElement(element, props, children))`
  flex: 1;
  ${({ grow }: IBoxProps) => grow !== undefined && css`flex-grow: ${grow};` || ''}
  ${({ shrink }: IBoxProps) => shrink !== undefined && css`flex-shrink: ${shrink};` || ''}
  ${({ basis }: IBoxProps) => basis !== undefined && css`flex-basis: ${basis};` || ''}
  ${({ verticalAlign }: IBoxProps) => verticalAlign && css`align-self: ${verticalAlign};` || ''}
  ${({ horizontalAlign }: IBoxProps) => horizontalAlign && css`justify-self: ${horizontalAlign};` || ''}
`;
