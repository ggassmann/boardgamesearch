import { dp1, dp8, transitionDpHigh, transitionDpLow } from 'src/frontend/components/Elevation';
import styled, { css } from 'src/frontend/styled';
import { getColor } from '../Theme';

interface ICardProps {
  hoverable?: boolean;
}

export const Card = styled.div`
  ${dp1}
  border-radius: 4px;
  background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'light'})};

  padding: 6px;

  ${transitionDpLow}

  ${({hoverable}: ICardProps) => hoverable && css`
    &:hover {
      ${dp8}
      ${transitionDpHigh}
    }
  `}
`;
