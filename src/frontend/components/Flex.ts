import styled, { css } from '../styled';

interface IFlexProps {
  row?: boolean;
}

export const Flex = styled.div`
  ${({row}: IFlexProps) => row && css`
    flex-direction: row;
  `};
  display: flex;
`;
