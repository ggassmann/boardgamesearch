import {createElement} from 'react';
import styled from 'styled-components';

export const Typeography = styled(({element = 'p', children, ...props}) => createElement(element, props, children))`
  font-size: 1rem;
  display: flex;
`;
