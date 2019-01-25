import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledComponent } from 'styled-components';
import { GlobalStoreInstance } from '../stores/GlobalStore';
import { SearchStore } from '../stores/SearchStore';
import styled, { css } from '../styled';
import { AppBar } from './AppBar';
import { Box } from './Box';
import { Flex } from './Flex';
import { SearchInput } from './SearchInput';
import { Typeography } from './Typeography';

interface IHeaderLinkProps {
  hideAfter?: number;
  hideBefore?: number;
  to: string;
  color?: string;
}

const HeaderLink: StyledComponent<
  'div', null, IHeaderLinkProps
  > = styled(
    ({ hideAfter, hideBefore, color, ...props }: IHeaderLinkProps) => <Link {...props} />,
  )`
  flex-grow: 1;
  font-size: 2rem;
  padding-right: 1rem;
  text-decoration: none;
  ${({ color }: IHeaderLinkProps) => color && css`color: ${color};`}

  @media screen and (max-width: ${({ hideAfter }: IHeaderLinkProps) => hideAfter}px) {
    display: none;
  }
  @media screen and (min-width: ${({ hideBefore }: IHeaderLinkProps) => hideBefore + 1}px) {
    display: none;
  }
`;

const HeaderAccountLink = styled(HeaderLink)`
  font-weight: bold;
  font-size: 1.1rem;
  margin-left: 0.8em;
  margin-bottom: 0.25em;
  display: block;
`;

interface IHeaderAvatarProps {
  src: string;
  to: string;
}
const HeaderAvatar: StyledComponent<
  'div', null, IHeaderAvatarProps
  > = styled(
    ({src, ...props }: IHeaderAvatarProps) => <Link {...props} />,
  )`
  display: block;
  background: url('${(props: IHeaderAvatarProps) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 10%;
  border-radius: 50%;
  border: 2px solid rgba(50, 50, 50, 0.6);
  width: 40px;
  height: 40px;
  margin: 1px;
  margin-left: 0.5em;

  transition: border 0.5s;

  &:hover {
    border: 2px solid rgba(240, 240, 240, 0.95);
    transition: border 0.15s;
  }
`;

const HeaderAccountLinkPlaceholder = styled.div`
  width: 3.3em;
`;

const SMALL_HEADER_CUTOFF = 464;

interface IHeaderProps {
  headerSearchStore: SearchStore;
}

export const Header = ({headerSearchStore}: IHeaderProps) => {
  const globalStore = GlobalStoreInstance.useStore();

  return (
    <AppBar>
      <Flex row={true} verticalAlignItems={'center'}>
        <Typeography element='h2'>
          <HeaderLink to='/' hideAfter={SMALL_HEADER_CUTOFF} color='black'>
            Board Game Search
          </HeaderLink>
          <HeaderLink to='/' hideBefore={SMALL_HEADER_CUTOFF} color='black'>
            BGS
          </HeaderLink>
        </Typeography>
        <Box>
          <SearchInput
            searchStore={headerSearchStore}
          />
        </Box>
        <Box grow={0}>
          {globalStore.state.avatar &&
            <>
              <HeaderAvatar to='/user/account' src={globalStore.state.avatar}/>
            </>
          || globalStore.state.loggedOut &&
            <>
              <HeaderAccountLink to='/user/signin'>
                Sign&nbsp;In
              </HeaderAccountLink>
            </>
          ||
            <HeaderAccountLinkPlaceholder/>
          }
        </Box>
      </Flex>
    </AppBar>
  );
};
