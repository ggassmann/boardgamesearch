import { Grid } from '@material-ui/core';
import * as React from 'react';
import { FiltersView } from 'src/frontend/components/FiltersView';
import { ProductList } from 'src/frontend/components/ProductList';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';

interface IIndexPageProps {
  headerSearch: string;
  headerSearchFilters: ISearchFilter[];
}

export default ({ headerSearch, headerSearchFilters}: IIndexPageProps) => {
  return (
    <Grid container={true} direction='column'>
      <Grid alignContent='center'>
        <FiltersView searchFilters={headerSearchFilters}/>
      </Grid>
      <ProductList query={headerSearch} queryFilters={headerSearchFilters}/>
    </Grid>
  );
};
