import { FormControl, Input, InputAdornment, InputLabel, MenuItem, Paper } from '@material-ui/core';
import * as keycode from 'keycode';
import { deburr } from 'lodash';
import * as React from 'react';
import { SyntheticEvent, useState } from 'react';

import { eventTargetValue } from 'src/frontend/lib/eventTargetValue';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { useClickOutside } from 'src/frontend/lib/useClickOutside';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { FETCH_STATUS_SUCCESS, useFetch } from '../lib/useFetch';

interface ISearchInputProps {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  searchFilters: ISearchFilter[];
  setSearchFilters: (searchFilters: ISearchFilter[]) => void;
}

interface ISearchSuggestionProps {
  suggestion: ISearchSuggestion;
  index: number;
  highlightedIndex: number;
  onKeyDown: (event: SyntheticEvent) => any;
  selectSuggestion: () => void;
}

interface ISearchSuggestion {
  label: string;
  column: string;
}

const SearchSuggestion = ({
  suggestion, index, highlightedIndex, onKeyDown, selectSuggestion,
}: ISearchSuggestionProps) => {
  const isHighlighted = highlightedIndex === index;

  return (
    <MenuItem
      key={`${suggestion.label}${suggestion.column}`}
      selected={isHighlighted}
      component='div'
      onKeyDown={onKeyDown}
      onClick={selectSuggestion}
    >
      {suggestion.label}
    </MenuItem>
  );
};

const getSuggestions = (suggestions: ISearchSuggestion[], value: string): ISearchSuggestion[] => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 ? ([]) : (
    suggestions.filter((suggestion) => {
      const keep = count < 7 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    })
  );
};

export const SearchInput = ({ setSearchInput, searchInput, setSearchFilters, searchFilters}: ISearchInputProps) => {
  const [facets, facetsFetchState] = useFetch(`${host}:${searchPort}${searchOriginPath}facets`, { fields: {} });
  const [autocompleteOptions, setAuctocompleteOptions] = useState([]);
  const [stateHighlightedIndex, setStateHighlightedIndex] = useState(0);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [stateSuggestionsHide, setStateSuggestionsHide] = useState(false);

  const clickOutsideRef = React.useRef(null);

  useClickOutside(clickOutsideRef, () => {
    setStateSuggestionsHide(true);
  });

  if (autocompleteOptions.length === 0 && facetsFetchState === FETCH_STATUS_SUCCESS) {
    let newAutocompleteOptions = [];
    if (facetsFetchState === FETCH_STATUS_SUCCESS) {
      newAutocompleteOptions = [].concat(
        ...Object.keys(facets.fields)
          .map(
            (fieldColumn) =>
              facets.fields[fieldColumn]
                .filter(
                  (f: any, fIndex: number) => fIndex % 2 === 0,
                )
                .map((fieldItem: string) => ({label: fieldItem, column: fieldColumn})),
          ),
      );
      setAuctocompleteOptions(newAutocompleteOptions);
    }
  }

  const setInput = (e: string) => {
    setSearchInput(e);
    setStateHighlightedIndex(0);
    setStateSuggestions(getSuggestions(autocompleteOptions, e));
    if (stateSuggestionsHide) {
      setStateSuggestionsHide(false);
    }
  };

  const moveHighlight = (e: SyntheticEvent) => {
    const suggestions = getSuggestions(autocompleteOptions, searchInput);
    if (keycode(e.nativeEvent) === 'down') {
      setStateHighlightedIndex(Math.min(suggestions.length - 1, stateHighlightedIndex + 1));
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'up') {
      setStateHighlightedIndex(Math.max(0, stateHighlightedIndex - 1));
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'enter') {
      const selectedSuggestion = suggestions[stateHighlightedIndex];
      selectSuggestion(selectedSuggestion);
      e.preventDefault();
    }
  };

  const selectSuggestion = (suggestion: ISearchSuggestion) => {
    const selectedFilter: ISearchFilter = {
      label: suggestion.label,
      column: suggestion.column,
      value: suggestion.label,
    };
    setSearchFilters([
      ...searchFilters,
      selectedFilter,
    ]);
    setInput('');
    setStateSuggestionsHide(true);
  };

  return (
    <div ref={clickOutsideRef}>
      <FormControl>
        <InputLabel htmlFor='adornment-password'>Search</InputLabel>
        <Input
          id='adornment-password'
          type={'text'}
          value={searchInput}
          onChange={eventTargetValue(setInput)}
          onKeyDown={moveHighlight}
          onFocus={() => setStateSuggestionsHide(false)}
          onBlur={() => setTimeout(() => setStateSuggestionsHide(true), 100)}
          endAdornment={
            <InputAdornment position='end'>
              $
            </InputAdornment>
          }
        />
        {!stateSuggestionsHide &&
          <Paper
            square={true}
            style={{
              position: 'absolute',
              zIndex: 1,
              marginTop: '3.3rem',
              left: 0,
              right: 0,
            }}
            onKeyDown={moveHighlight}
          >
            {stateSuggestions.map((suggestion, index) =>
              <SearchSuggestion
                suggestion={suggestion}
                index={index}
                key={`${suggestion.label}&${suggestion.column}`}
                highlightedIndex={stateHighlightedIndex}
                onKeyDown={moveHighlight}
                selectSuggestion={() => selectSuggestion(suggestion)}
              />,
            )}
          </Paper>
        }
      </FormControl>
    </div>
  );
};
