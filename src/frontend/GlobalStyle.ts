import { createGlobalStyle } from './styled';
import { getColor } from './Theme';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  a {
    color: ${getColor({type: 'font'})};
  }
`;
