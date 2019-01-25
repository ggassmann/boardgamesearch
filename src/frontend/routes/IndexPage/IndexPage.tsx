import * as React from 'react';
import { hot } from 'react-hot-loader';

import { FiltersView } from 'src/frontend/components/FiltersView';
import { ProductList } from 'src/frontend/components/ProductList';
import { SquarePageLoader } from 'src/frontend/components/SquareLoader';
import { FETCH_STATUS_FETCHING, FETCH_STATUS_SUCCESS } from 'src/frontend/lib/useFetch';
import { SearchStore } from 'src/frontend/stores/SearchStore';

interface IIndexPageProps {
  products: any;
  productsStatus: number;
  searchStore: SearchStore;
  finalizeLoadable: () => void;
}

export default hot(module)(({searchStore, products, productsStatus, finalizeLoadable}: IIndexPageProps) => {
  const [hasCompletedFirstFetch, setHasCompletedFirstFetch] = React.useState(false);
  if (!hasCompletedFirstFetch && productsStatus === FETCH_STATUS_SUCCESS) {
    finalizeLoadable();
    setHasCompletedFirstFetch(true);
  }
  return (
    <>
      <FiltersView searchStore={searchStore}/>
      {productsStatus === FETCH_STATUS_SUCCESS &&
        <ProductList products={products}/>
      }
      {hasCompletedFirstFetch && productsStatus === FETCH_STATUS_FETCHING &&
        <SquarePageLoader/>
      }
    </>
  );
});
