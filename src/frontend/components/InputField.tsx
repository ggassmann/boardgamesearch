import * as React from 'react';
import styled, { css } from '../styled';
import { getColor } from '../Theme';
import { Box } from './Box';
import { Card } from './Card';

export const TextFieldInput = styled.input.attrs({
  size: 1,
})`
  font-size: 1.5rem;
  padding: 0.25rem;
  border: none;
  border-radius: 6px;
  flex: 1;
  background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};
`;

export const TextFieldButton = styled.a`
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.3rem;
  padding-left: 0.651rem;
  padding-right: 0.651rem;
  background-color: ${getColor({type: 'background', color: 'secondary'})};
  color: ${getColor({type: 'font', color: 'secondary'})};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  margin-left: -6px;
  padding-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: center;
`;

export const TextFieldSuggestions = styled(Card)`
  position: absolute;
  top: 2.5rem;

  &:not(&:last-child) {
    border-bottom: 1px solid ${getColor({type: 'background', color: 'neutral', brightness: 'dark'})};
  }
`;

const BoxA = Box.withComponent('a');

interface ITextFieldSuggestionProps {
  highlighted?: boolean;
}

export const TextFieldSuggestion = styled(BoxA)`
  font-size: 1.5rem;
  padding: 0.25rem;
  display: block;

  cursor: pointer;

  ${({highlighted}: ITextFieldSuggestionProps) => highlighted && css`
    background-color: ${getColor({type: 'background', color: 'neutral'})};
  `}
`;

interface ITextFieldProps {
  buttonOnlyBreakpoint?: number;
  open?: boolean;
  outlined?: boolean;
}

export const TextField = styled.div`
  display: flex;
  flex: 1;
  border-bottom: 1px solid black;
  height: 2.5rem;
  ${({outlined}: ITextFieldProps) => outlined && css`
    border: none;
    ${({open}: ITextFieldProps) => open && css`
      border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
    `}
    ${({buttonOnlyBreakpoint}: ITextFieldProps) => css`
      @media screen and (min-width: ${buttonOnlyBreakpoint || 0}px) {
        border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
      }
    `}
    border-radius: 6px;
    ${TextFieldButton} {
      background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};
      border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
      margin-top: -2px;
      margin-bottom: -2px;
      margin-right: -2px;
      margin-left: -2px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      color: ${getColor({type: 'background', color: 'secondary'})};
    }
  `}
  ${TextFieldInput} {
    display: none;
    ${({open}: ITextFieldProps) => open && css`
      display: initial;
    `}
    ${({buttonOnlyBreakpoint}: ITextFieldProps) => css`
      @media screen and (min-width: ${buttonOnlyBreakpoint || 0}px) {
        display: initial;
      }
    `}
  }
  ${TextFieldButton} {
    margin-left: -2px;
  }
  flex-direction: row-reverse;
  ${({buttonOnlyBreakpoint}: ITextFieldProps) => css`
    @media screen and (min-width: ${buttonOnlyBreakpoint || 0}px) {
      flex-direction: row;
    }
  `}
  position: relative;
  ${({open}: ITextFieldProps) => open && css`
    position: absolute;
    left: 0.4em;
    right: 0.4em;
    top: 0.6em;
    flex-direction: row;
  `}
`;
