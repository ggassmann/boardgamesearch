import * as React from 'react';
import styled, { css } from '../styled';
import { getColor } from '../Theme';

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
  font-size: 1rem;
  border: none;
  padding-top: 0.9rem;
`;

export const TextFieldLabel = styled.label`
  background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};
  position: absolute;
  font-size: 1rem;
  top: 0.75rem;
  left: 0.25rem;
  color: ${getColor({type: 'font', color: 'neutral', transparency: 0.7})};
  transition: top 0.3s, left 0.3s, font-size 0.3s, color 0.3s;
`;

export const TextField = styled.div`
  background-color: ${getColor({type: 'background', color: 'neutral'})};
  display: flex;
  border-bottom: 1px solid black;
  height: 2rem;
  ${({outlined}: ITextFieldProps) => outlined && css`
    border: 2px solid ${getColor({type: 'background', color: 'secondary'})};
    border-radius: 4px;
  `}
  position: relative;

  ${TextFieldInput}:focus + ${TextFieldLabel},
  ${TextFieldInput}:valid + ${TextFieldLabel} {
    font-size: 0.85rem;
    top: -1;
    left: 0.6rem;
    color: ${getColor({type: 'font', color: 'neutral', transparency: 0.8})};
  }
`;
