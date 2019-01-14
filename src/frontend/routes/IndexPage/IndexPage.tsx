import * as React from 'react';
import { FiltersView } from 'src/frontend/components/FiltersView';
import { ProductList } from 'src/frontend/components/ProductList';
import { SquarePageLoader } from 'src/frontend/components/SquareLoader';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { FETCH_STATUS_FETCHING, FETCH_STATUS_SUCCESS } from 'src/frontend/lib/useFetch';

interface IIndexPageProps {
  products: any;
  productsStatus: number;
  headerSearchFilters: ISearchFilter[];
  finalizeLoadable: () => void;
}

export default ({ products, productsStatus, headerSearchFilters, finalizeLoadable}: IIndexPageProps) => {
  const [hasCompletedFirstFetch, setHasCompletedFirstFetch] = React.useState(false);
  if (!hasCompletedFirstFetch && productsStatus === FETCH_STATUS_SUCCESS) {
    finalizeLoadable();
    setHasCompletedFirstFetch(true);
  }
  return (
    <>
      <FiltersView searchFilters={headerSearchFilters}/>
      {productsStatus === FETCH_STATUS_SUCCESS &&
        <ProductList products={products}/>
      }
      {hasCompletedFirstFetch && productsStatus === FETCH_STATUS_FETCHING &&
        <SquarePageLoader/>
      }
    </>
  );
};
