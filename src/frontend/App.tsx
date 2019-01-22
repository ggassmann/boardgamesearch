import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { StyledComponent } from 'styled-components';

import { SearchInput } from 'src/frontend/components/SearchInput';
import { ProductPageLoadable } from 'src/frontend/routes/ProductPage/ProductPageLoadable';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { AppBar } from './components/AppBar';
import { Box } from './components/Box';
import { Flex } from './components/Flex';
import { Typeography } from './components/Typeography';
import { GlobalStyle } from './GlobalStyle';
import { useFetch } from './lib/useFetch';
import { IndexPageLoadable } from './routes/IndexPage/IndexPageLoadable';
import { AccountPageLoadable } from './routes/User/Account/AccountPageLoadable';
import { SignInPageLoadable } from './routes/User/SignInPage/SignInPageLoadable';
import { GlobalStoreInstance } from './stores/GlobalStore';
import styled, { css } from './styled';

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

export const App = () => {
  const [stateSearchInput, setStateSearchInput] = useState('');
  const [stateSearchFilters, setStateSearchFilters] = useState([]);
  const [stateSearchFacets, setStateSearchFacets] = useState([]);

  const endpoint = `${host}:${searchPort}${searchOriginPath}search`;

  const [products, productsStatus] = useFetch(endpoint, { docs: [], explain: [] }, {
    body: {
      query: stateSearchInput,
      filters: stateSearchFilters,
    },
  });

  const globalStore = GlobalStoreInstance.useStore();
  GlobalStoreInstance.populateAccount();

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <>
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
                  searchInput={stateSearchInput}
                  setSearchInput={setStateSearchInput}
                  searchFilters={stateSearchFilters}
                  setSearchFilters={setStateSearchFilters}
                  searchFacets={stateSearchFacets}
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
          <Switch>
            <Route
              exact={true}
              path='/'
              render={() => (
                <IndexPageLoadable
                  products={products}
                  productsStatus={productsStatus}
                  headerSearchFilters={stateSearchFilters}
                />
              )}
            />
            <Route
              exact={true}
              path='/item/:id/:slug'
              render={({ match }: any) => <ProductPageLoadable id={match.params.id} />}
            />
            <Route
              path='/user/signin'
              render={({ match }: any) => <SignInPageLoadable />}
            />
            <Route
              path='/user/account'
              render={({ match }: any) => <AccountPageLoadable />}
            />
          </Switch>
        </>
      </BrowserRouter>
    </>
  );
};
