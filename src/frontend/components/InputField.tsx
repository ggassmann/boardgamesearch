import * as React from 'react';
import styled, { css } from '../styled';
import { getColor } from '../Theme';
import { Box } from './Box';
import { Card } from './Card';

interface ITextFieldProps {
  outlined?: boolean;
}

const TextFieldInputWithRequiredProp = (
  props: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
  ) => {
    delete props.required;
    return (<input required={true} {...props} />);
  };

export const TextFieldInput = styled(TextFieldInputWithRequiredProp)`
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
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: ${getColor({type: 'background', color: 'secondary'})};
  color: ${getColor({type: 'font', color: 'secondary'})};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  margin-left: -6px;
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
    background-color: ${getColor({type: 'background', color: 'neutral'})}
  `}
`;

export const TextField = styled.div`
  display: flex;
  flex: 1;
  border-bottom: 1px solid black;
  height: 2.5rem;
  ${({outlined}: ITextFieldProps) => outlined && css`
    border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
    border-radius: 6px;
    ${TextFieldButton} {
      background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};
      border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
      margin-top: -2px;
      margin-bottom: -2px;
      margin-right: -2px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      color: ${getColor({type: 'background', color: 'secondary'})};
    }
  `}
  position: relative;
`;
