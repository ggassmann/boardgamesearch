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
    <>
      <FiltersView searchFilters={headerSearchFilters}/>
      <ProductList query={headerSearch} queryFilters={headerSearchFilters}/>
    </>
  );
};
