import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { StyledComponent } from 'styled-components';

import { SearchInput } from 'src/frontend/components/SearchInput';
import IndexPage from 'src/frontend/routes/IndexPage/IndexPage';
import { ProductPageLoadable } from 'src/frontend/routes/ProductPage/ProductPageLoadable';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { AppBar } from './components/AppBar';
import { Box } from './components/Box';
import { Flex } from './components/Flex';
import { Typeography } from './components/Typeography';
import { GlobalStyle } from './GlobalStyle';
import { useFetch } from './lib/useFetch';
import styled from './styled';

interface IHeaderLinkProps extends Link {
  hideAfter?: number;
  hideBefore?: number;
}

const HeaderLink: StyledComponent<
    'div', null, IHeaderLinkProps
  > = styled(
    ({hideAfter, hideBefore, ...props}: IHeaderLinkProps) => <Link {...props}/>,
  )`
  flex-grow: 1;
  font-size: 2rem;
  padding-right: 1rem;
  text-decoration: none;

  @media screen and (max-width: ${({hideAfter}: IHeaderLinkProps) => hideAfter}px) {
    display: none;
  }
  @media screen and (min-width: ${({hideBefore}: IHeaderLinkProps) => hideBefore}px) {
    display: none;
  }
`;

const SMALL_HEADER_CUTOFF = 380;

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

  return (
    <>
      <GlobalStyle/>
      <BrowserRouter>
        <>
          <AppBar>
            <Flex row={true} verticalAlignItems={'center'}>
              <Typeography element='h2'>
                <HeaderLink to='/' hideAfter={SMALL_HEADER_CUTOFF}>
                  Board Game Search
                </HeaderLink>
                <HeaderLink to='/' hideBefore={SMALL_HEADER_CUTOFF}>
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
            </Flex>
          </AppBar>
          <Switch>
            <Route
              exact={true}
              path='/'
              render={() => (
                <IndexPage
                  products={products}
                  productsStatus={productsStatus}
                  headerSearchFilters={stateSearchFilters}
                />
              )}
            />
            <Route
              exact={true}
              path='/item/:id/:slug'
              render={({match}: any) => <ProductPageLoadable id={match.params.id}/>}
            />
          </Switch>
        </>
      </BrowserRouter>
    </>
  );
};
