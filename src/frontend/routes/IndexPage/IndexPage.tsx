import * as React from 'react';
import { Grid } from '@material-ui/core';
import { ProductList } from 'src/frontend/ProductList';

interface IIndexPageProps {
  headerSearch: string;
}

export default ({ headerSearch }: IIndexPageProps) => {
  return (
    <Grid container={true}>
      <ProductList search={headerSearch} />
    </Grid>
  )
}