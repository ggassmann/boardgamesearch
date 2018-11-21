import styled from '../styled';
import { getColor } from '../Theme';
import { dp4 } from './Elevation';

export const AppBar = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1100;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-direction: column;

  height: 64px;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;

  ${dp4}

  background-color: ${getColor({type: 'background', color: 'primary'})};
`;
