import styled, { css } from '../styled';

interface IFlexProps {
  row?: boolean;
  column?: boolean;
  verticalAlignItems?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  gutter?: number;
}

export const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  ${({ row }: IFlexProps) => row && css`
    flex-direction: row;
  `};
  ${({ column }: IFlexProps) => column && css`
    flex-direction: column;
  `};
  ${({ verticalAlignItems }: IFlexProps) => verticalAlignItems && css`
    align-items: ${verticalAlignItems}
    ${verticalAlignItems === 'stretch' && css`
      height: 100%;
    `}
  ` || ''};
  &>* {
    ${({ gutter }: IFlexProps) => gutter > 0 && css`
      margin: ${gutter}px;
    `}
  }
`;
