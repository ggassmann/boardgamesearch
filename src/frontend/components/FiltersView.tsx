import * as React from 'react';
import { Card } from 'src/frontend/components/Card';
import { ISearchFilter } from '../lib/ISearchFilter';
import styled from '../styled';
import { dp2 } from './Elevation';

interface IFiltersViewProps {
  searchFilters: ISearchFilter[];
}

const FiltersViewContainer = styled.div`
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 5px;
  ${dp2}
`;

const FilterOptionHeight = 1.6;
const FilterOption = styled.div`
  display: inline-block;
  padding: ${FilterOptionHeight / 4}em;
  padding-right: ${FilterOptionHeight * 1.25}em;
  border-radius: ${FilterOptionHeight / 2}em;
  height: ${FilterOptionHeight}em;
  line-height: ${FilterOptionHeight * 1.1}em;
  position: relative;
  ${dp2}
`;

const FilterOptionRemoveButton = styled.button`
  height: ${FilterOptionHeight * 1.25}em;
  width: ${FilterOptionHeight * 1.25}em;
  position: absolute;
  background: none;
  border-radius: 1.2em;

  right: 0;
  top: ${FilterOptionHeight * 0.375}em;
`;

export const FiltersView = ({searchFilters}: IFiltersViewProps) => {
  if (searchFilters.length < 1) {
    return null;
  }
  return (
    <FiltersViewContainer>
      {searchFilters.map((filter) => (
        <FilterOption>
          {filter.column}: {filter.label}
          <FilterOptionRemoveButton>
            x
          </FilterOptionRemoveButton>
        </FilterOption>
      ))}
    </FiltersViewContainer>
  );
};
