import { dp4 } from 'src/frontend/components/Elevation';
import styled from 'src/frontend/styled';
import { getColor } from '../Theme';

export const Paper = styled.div`
  ${dp4}
  border-radius: 4px;
  background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};
`;
