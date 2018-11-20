import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import { SearchInput } from 'src/frontend/components/SearchInput';
import IndexPage from 'src/frontend/routes/IndexPage/IndexPage';
import { ProductPageLoadable } from 'src/frontend/routes/ProductPage/ProductPageLoadable';
import { AppBar } from './components/AppBar';
import { Flex } from './components/Flex';
import { Typeography } from './components/Typeography';
import { GlobalStyle } from './GlobalStyle';
import styled from './styled';

const HeaderLink = styled(Link)`
  flex-grow: 1;
  font-size: 2rem;
  padding-left: 0.5em;
  text-decoration: none;
`;

export const App = () => {
  const [stateSearchInput, setStateSearchInput] = useState('');
  const [stateSearchFilters, setStateSearchFilters] = useState([]);

  return (
    <>
      <GlobalStyle/>
      <BrowserRouter>
        <>
          <AppBar>
            <Flex row={true}>
              <Typeography element='h2'>
                <HeaderLink to='/'>
                  Board Game Search
                </HeaderLink>
              </Typeography>
              <SearchInput
                searchInput={stateSearchInput}
                setSearchInput={setStateSearchInput}
                searchFilters={stateSearchFilters}
                setSearchFilters={setStateSearchFilters}
              />
            </Flex>
          </AppBar>
          <Switch>
            <Route
              exact={true}
              path='/'
              component={() => (
                <IndexPage headerSearch={stateSearchInput} headerSearchFilters={stateSearchFilters}/>
              )}
            />
            <Route exact={true} path='/item/:slug' component={() => <ProductPageLoadable/>} />
          </Switch>
        </>
      </BrowserRouter>
    </>
  );
};
