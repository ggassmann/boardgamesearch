import styled, { css } from '../styled';

interface IFlexProps {
  row?: boolean;
  verticalAlignItems?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
}

export const Flex = styled.div`
  ${({row}: IFlexProps) => row && css`
    flex-direction: row;
  `};
  display: flex;
  ${({verticalAlignItems}: IFlexProps) => verticalAlignItems && css`
    align-items: ${verticalAlignItems}
  ` || ''};
`;
