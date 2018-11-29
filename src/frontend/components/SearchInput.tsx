import * as keycode from 'keycode';
import { deburr } from 'lodash';
import * as React from 'react';
import { SyntheticEvent, useState } from 'react';

import { eventTargetValue } from 'src/frontend/lib/eventTargetValue';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { useClickOutside } from 'src/frontend/lib/useClickOutside';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { Search } from 'styled-icons/fa-solid/Search';
import { ISearchFacet } from '../lib/ISearchFacet';
import { FETCH_STATUS_SUCCESS, useFetch } from '../lib/useFetch';
import styled from '../styled';
import { TextField, TextFieldButton, TextFieldInput, TextFieldSuggestion, TextFieldSuggestions } from './InputField';

interface ISearchInputProps {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  searchFilters: ISearchFilter[];
  setSearchFilters: (searchFilters: ISearchFilter[]) => void;
  searchFacets: ISearchFacet[];
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

const SearchButtonLabel = styled.span`
  display: none;
`;

const SEARCH_SINGLE_BUTTON_BREAKPOINT = 570;

const SearchSuggestion = ({
  suggestion, index, highlightedIndex, onKeyDown, selectSuggestion,
}: ISearchSuggestionProps) => {
  const isHighlighted = highlightedIndex === index;

  return (
    <TextFieldSuggestion
      key={`${suggestion.label}${suggestion.column}`}
      onKeyDown={onKeyDown}
      onClick={selectSuggestion}
      highlighted={isHighlighted}
    >
      {suggestion.label}
    </TextFieldSuggestion>
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

export const SearchInput = ({
  setSearchInput, searchInput, setSearchFilters, searchFilters, searchFacets,
}: ISearchInputProps) => {
  const [baseFacets, baseFacetsFetchState] = useFetch(`${host}:${searchPort}${searchOriginPath}facets`, { fields: {} });
  const [autocompleteOptions, setAuctocompleteOptions] = useState([]);
  const [stateHighlightedIndex, setStateHighlightedIndex] = useState(0);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [stateSuggestionsHide, setStateSuggestionsHide] = useState(false);
  const [stateSearchButtonOpen, setStateSearchButtonOpen] = useState(false);

  const clickOutsideRef = React.useRef(null);
  const textFieldRef = React.useRef(null);

  useClickOutside(clickOutsideRef, (e: MouseEvent) => {
    setStateSuggestionsHide(true);
    setStateSearchButtonOpen(false);
  });

  if (autocompleteOptions.length === 0 && baseFacetsFetchState === FETCH_STATUS_SUCCESS) {
    let newAutocompleteOptions = [];
    if (baseFacetsFetchState === FETCH_STATUS_SUCCESS) {
      newAutocompleteOptions = [].concat(
        ...Object.keys(baseFacets.fields)
          .map(
            (fieldColumn) =>
              baseFacets.fields[fieldColumn]
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

  const handleHighlightKeypress = (e: SyntheticEvent) => {
    const suggestions = getSuggestions(autocompleteOptions, searchInput);
    if (stateSuggestionsHide || suggestions.length === 0) {
      setStateHighlightedIndex(0);
      return;
    }
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

  const onSearchButtonClick = (e: SyntheticEvent) => {
    if (window.innerWidth <= SEARCH_SINGLE_BUTTON_BREAKPOINT && !stateSearchButtonOpen) {
      e.preventDefault();
      setStateSearchButtonOpen(true);
      setTimeout(() => {
        textFieldRef.current.focus();
      }, 1);
    }
  };

  return (
    <TextField
      outlined={true}
      buttonOnlyBreakpoint={SEARCH_SINGLE_BUTTON_BREAKPOINT}
      open={stateSearchButtonOpen}
      ref={clickOutsideRef}
    >
      <TextFieldInput
        id='search-query-header'
        type='text'
        value={searchInput}
        placeholder='Search'
        onChange={eventTargetValue(setInput)}
        onKeyDown={handleHighlightKeypress}
        onFocus={() => setStateSuggestionsHide(false)}
        onBlur={() => setTimeout(() => setStateSuggestionsHide(true), 100)}
        ref={textFieldRef}
      />
      <TextFieldButton href={`/search/${searchInput}`} onClick={onSearchButtonClick}>
        <Search size={'1.2rem'}/>
        <SearchButtonLabel>
          Search
        </SearchButtonLabel>
      </TextFieldButton>
      {!stateSuggestionsHide && stateSuggestions.length > 0 &&
        <TextFieldSuggestions
          onKeyDown={handleHighlightKeypress}
        >
          {stateSuggestions.map((suggestion, index) =>
            <SearchSuggestion
              suggestion={suggestion}
              index={index}
              key={`${suggestion.label}&${suggestion.column}`}
              highlightedIndex={stateHighlightedIndex}
              onKeyDown={handleHighlightKeypress}
              selectSuggestion={() => selectSuggestion(suggestion)}
            />,
          )}
        </TextFieldSuggestions>
      }
    </TextField>
  );
};
