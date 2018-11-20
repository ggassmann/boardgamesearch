import { createGlobalStyle } from './styled';
import { getColor } from './Theme';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
  }
  h1,h2,h3,h4,h5,h6 {
    font-family: 'Roboto', sans-serif;
  }
  a {
    color: ${getColor({type: 'font'})};
  }
`;
