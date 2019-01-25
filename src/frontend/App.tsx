import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { StyledComponent } from 'styled-components';

import { SearchInput } from 'src/frontend/components/SearchInput';
import { ProductPageLoadable } from 'src/frontend/routes/ProductPage/ProductPageLoadable';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { AppBar } from './components/AppBar';
import { Box } from './components/Box';
import { Flex } from './components/Flex';
import { Header } from './components/Header';
import { Typeography } from './components/Typeography';
import { GlobalStyle } from './GlobalStyle';
import { useFetch } from './lib/useFetch';
import { IndexPageLoadable } from './routes/IndexPage/IndexPageLoadable';
import { AccountPageLoadable } from './routes/User/Account/AccountPageLoadable';
import { SignInPageLoadable } from './routes/User/SignInPage/SignInPageLoadable';
import { GlobalStoreInstance } from './stores/GlobalStore';
import { SearchStore } from './stores/SearchStore';

const HEADER_SEARCH_STORE = new SearchStore();

export const App = hot(() => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}search`;
  const headerSearchStore = HEADER_SEARCH_STORE.useStore();

  const [products, productsStatus] = useFetch(endpoint, { docs: [], explain: [] }, {
    body: {
      query: headerSearchStore.state.input,
      filters: headerSearchStore.state.filters,
    },
  });

  const globalStore = GlobalStoreInstance.useStore();
  GlobalStoreInstance.populateAccount();

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <>
          <Header headerSearchStore={HEADER_SEARCH_STORE}/>
          <Switch>
            <Route
              exact={true}
              path='/'
              render={() => (
                <IndexPageLoadable
                  products={products}
                  productsStatus={productsStatus}
                  searchStore={HEADER_SEARCH_STORE}
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
});
