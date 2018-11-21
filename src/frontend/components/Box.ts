import { createElement } from 'react';
import styled from '../styled';

export const Box = styled(({element = 'div', children, ...props}) => createElement(element, props, children))`
  flex: 1;
`;
