import * as React from 'react';
import { Paper } from 'src/frontend/components/Paper';
import { ISearchFilter } from '../lib/ISearchFilter';

interface IFiltersViewProps {
  searchFilters: ISearchFilter[];
}

export const FiltersView = ({searchFilters}: IFiltersViewProps) => {
  return (
    <Paper>
      {searchFilters.map((filter) => (
        <div>
          {filter.column}: {filter.label}
        </div>
      ))}
    </Paper>
  )
}