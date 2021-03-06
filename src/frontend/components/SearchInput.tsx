import * as keycode from 'keycode';
import deburr from 'lodash/deburr';
import * as React from 'react';
import { SyntheticEvent, useState } from 'react';

import { eventTargetValue } from 'src/frontend/lib/eventTargetValue';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { useClickOutside } from 'src/frontend/lib/useClickOutside';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { Search } from 'styled-icons/fa-solid/Search';
import { FETCH_STATUS_SUCCESS, useFetch } from '../lib/useFetch';
import { SearchStore } from '../stores/SearchStore';
import styled from '../styled';
import { TextField, TextFieldButton, TextFieldInput, TextFieldSuggestion, TextFieldSuggestions } from './InputField';

interface ISearchInputProps {
  searchStore: SearchStore;
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
  searchStore,
}: ISearchInputProps) => {
  const [baseFacets, baseFacetsFetchState] = useFetch(`${host}:${searchPort}${searchOriginPath}facets`, { fields: {} });
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [stateHighlightedIndex, setStateHighlightedIndex] = useState(0);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [stateSuggestionsHide, setStateSuggestionsHide] = useState(false);
  const [stateSearchButtonOpen, setStateSearchButtonOpen] = useState(false);
  const [stateEnterContext, setStateEnterContext] = useState('input');

  const clickOutsideRef = React.useRef(null);
  const textFieldRef = React.useRef(null);

  useClickOutside(clickOutsideRef, (e: MouseEvent) => {
    setStateSuggestionsHide(true);
    setStateSearchButtonOpen(false);
    setStateEnterContext('input');
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
      setAutocompleteOptions(newAutocompleteOptions);
    }
  }

  const setInput = (e: string) => {
    searchStore.setState({
      input: e,
    });
    setStateHighlightedIndex(0);
    setStateSuggestions(getSuggestions(autocompleteOptions, e));
    if (stateSuggestionsHide) {
      setStateSuggestionsHide(false);
      setStateEnterContext('input');
    }
  };

  const handleHighlightKeypress = (e: SyntheticEvent) => {
    const suggestions = getSuggestions(autocompleteOptions, searchStore.state.input);
    if (stateSuggestionsHide || suggestions.length === 0) {
      setStateHighlightedIndex(0);
      return;
    }
    if (keycode(e.nativeEvent) === 'down') {
      setStateHighlightedIndex(Math.min(suggestions.length - 1, stateHighlightedIndex + 1));
      setStateEnterContext('suggestions');
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'up') {
      setStateHighlightedIndex(Math.max(0, stateHighlightedIndex - 1));
      setStateEnterContext('suggestions');
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'enter') {
      if (stateEnterContext === 'input') {
        setStateSuggestionsHide(true);
        setStateEnterContext('input');
      } else {
        const selectedSuggestion = suggestions[stateHighlightedIndex];
        selectSuggestion(selectedSuggestion);
      }
      e.preventDefault();
    }
  };

  const selectSuggestion = (suggestion: ISearchSuggestion) => {
    const selectedFilter: ISearchFilter = {
      label: suggestion.label,
      column: suggestion.column,
      value: suggestion.label,
    };
    searchStore.setState({
      filters: [
        ...searchStore.state.filters,
        selectedFilter,
      ],
    });
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
        value={searchStore.state.input}
        placeholder='Search'
        onChange={eventTargetValue(setInput)}
        onKeyDown={handleHighlightKeypress}
        onFocus={() => setStateSuggestionsHide(false)}
        onBlur={() => setTimeout(() => setStateSuggestionsHide(true), 100)}
        ref={textFieldRef}
      />
      <TextFieldButton href={`/search/${searchStore.state.input}`} onClick={onSearchButtonClick}>
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
