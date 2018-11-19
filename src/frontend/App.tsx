import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ProductList } from 'src/frontend/ProductList';
import { SearchInput } from 'src/frontend/SearchInput';
import { ProductPageLoadable } from 'src/frontend/routes/ProductPage/ProductPageLoadable';
import IndexPage from 'src/frontend/routes/IndexPage/IndexPage';

export const App = () => {
  const [stateSearchInput, setStateSearchInput] = useState('');

  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Toolbar>
          <IconButton color='inherit' aria-label='Menu' />
          <Typography variant='h6' color='inherit' style={{ flexGrow: 1 }}>
            Board Game Search
          </Typography>
          <SearchInput setSearchInput={setStateSearchInput} />
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={() => <IndexPage headerSearch={stateSearchInput} />} />
          <Route exact path='/item/:itemid' component={ProductPageLoadable} />
        </Switch>
      </BrowserRouter>
    </>
  );
};
