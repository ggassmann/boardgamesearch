import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<styledComponents.DefaultTheme>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
