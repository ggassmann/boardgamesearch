import styled, { css } from '../styled';

interface IFlexProps {
  row?: boolean;
  verticalAlignItems?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  gutter?: number;
}

export const Flex = styled.div`
  display: flex;
  max-width: 100%;
  ${({ row }: IFlexProps) => row && css`
    flex-direction: row;
  `};
  ${({ verticalAlignItems }: IFlexProps) => verticalAlignItems && css`
    align-items: ${verticalAlignItems}
  ` || ''};
  &>* {
    ${({ gutter }: IFlexProps) => gutter > 0 && css`
      margin: ${gutter}px;
    `}
  }
`;
