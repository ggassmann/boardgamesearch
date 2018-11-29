import * as React from 'react';
import { Card } from 'src/frontend/components/Card';
import { ISearchFilter } from '../lib/ISearchFilter';

interface IFiltersViewProps {
  searchFilters: ISearchFilter[];
}

export const FiltersView = ({searchFilters}: IFiltersViewProps) => {
  if (searchFilters.length < 1) {
    return null;
  }
  return (
    <Card>
      {searchFilters.map((filter) => (
        <div>
          {filter.column}: {filter.label}
        </div>
      ))}
    </Card>
  );
};
