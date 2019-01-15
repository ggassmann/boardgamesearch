import { createGlobalStyle } from './styled';
import { getColor } from './Theme';

export const GlobalStyle = createGlobalStyle`
  body,#react-root {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-flow: column;
  }
  h1,h2,h3,h4,h5,h6 {
    font-family: 'Roboto', sans-serif;
  }
  a {
    color: ${getColor({ type: 'font', brightness: 'dark', color: 'secondary' })};
    text-decoration: underline;
  }
  div {
    color: black;
  }
  img {
    width: 100%;
    height: auto;
  }
`;
