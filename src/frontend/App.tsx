import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

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

const HeaderLink = styled(Link)`
  flex-grow: 1;
  font-size: 2rem;
  padding-right: 2rem;
  text-decoration: none;
`;

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
                <HeaderLink to='/'>
                  Board Game Search
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
              component={() => (
                <IndexPage
                  products={products}
                  productsStatus={productsStatus}
                  headerSearchFilters={stateSearchFilters}
                />
              )}
            />
            <Route exact={true} path='/item/:slug' component={() => <ProductPageLoadable/>} />
          </Switch>
        </>
      </BrowserRouter>
    </>
  );
};
