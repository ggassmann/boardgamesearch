import * as React from 'react';
import { useState, SyntheticEvent } from 'react';
import { FormControl, InputLabel, Input, InputAdornment, MenuItem, Paper } from '@material-ui/core';
import { deburr } from 'lodash';
import * as keycode from 'keycode';

import { useFetch, FETCH_STATUS_SUCCESS } from './lib/useFetch';
import { host, searchPort, searchOriginPath } from 'src/services/serviceorigins';
import { eventTargetValue } from 'src/frontend/lib/eventTargetValue';
import { useClickOutside } from 'src/frontend/lib/useClickOutside';

interface ISearchInputProps {
  setSearchInput: Function;
}

interface ISearchSuggestionProps {
  suggestion: string;
  index: number;
  highlightedIndex: number;
  selectedItem: string;
  onKeyDown: (event: SyntheticEvent) => any;
  selectSuggestion: () => void;
}

const SearchSuggestion = ({ suggestion, index, highlightedIndex, selectedItem, onKeyDown, selectSuggestion }: ISearchSuggestionProps) => {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1;

  return (
    <MenuItem
      key={suggestion}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
      onKeyDown={onKeyDown}
      onClick={selectSuggestion}
    >
      {suggestion}
    </MenuItem>
  );
}

const getSuggestions = (suggestions: string[], value: string) => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 ? ([]) : (
    suggestions.filter(suggestion => {
      const keep = count < 7 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    })
  );
}

export const SearchInput = ({ setSearchInput }: ISearchInputProps) => {
  const [facets, facetsFetchState] = useFetch(`${host}:${searchPort}${searchOriginPath}facets`, { fields: {} });
  const [stateSearchInput, setStateSearchInput] = useState('');
  const [stateSelectedItem, setStateSelectedItem] = useState(null);
  const [stateHighlightedIndex, setStateHighlightedIndex] = useState(0);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [stateSuggestionsHide, setStateSuggestionsHide] = useState(false);

  const clickOutsideRef = React.useRef(null);

  useClickOutside(clickOutsideRef, () => {
    setStateSuggestionsHide(true);
  });

  let autocompleteOptions: string[] = [];
  if (facetsFetchState === FETCH_STATUS_SUCCESS) {
    autocompleteOptions = [].concat(
      ...Object.keys(facets.fields)
        .map(
          (fieldColumn) => facets.fields[fieldColumn].filter(
            (f: any, fIndex: number) => fIndex % 2 === 0
          )
        )
    );
  }

  const setInput = (e: string) => {
    setSearchInput(e);
    setStateSearchInput(e);
    setStateHighlightedIndex(0);
    setStateSuggestions(getSuggestions(autocompleteOptions, e));
    if (stateSuggestionsHide) {
      setStateSuggestionsHide(false);
    }
  }

  const moveHighlight = (e: SyntheticEvent) => {
    if (keycode(e.nativeEvent) === 'down') {
      setStateHighlightedIndex(stateHighlightedIndex + 1);
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'up') {
      setStateHighlightedIndex(stateHighlightedIndex - 1);
      e.preventDefault();
    }
    if (keycode(e.nativeEvent) === 'enter') {
      console.log(stateSuggestions[stateHighlightedIndex]);
      e.preventDefault();
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setStateSuggestionsHide(true);
  }

  return (
    <div ref={clickOutsideRef}>
      <FormControl>
        <InputLabel htmlFor='adornment-password'>Search</InputLabel>
        <Input
          id='adornment-password'
          type={'text'}
          value={stateSearchInput}
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
          <Paper square style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: '3.3rem',
            left: 0,
            right: 0,
          }} onKeyDown={moveHighlight}>
            {stateSuggestions.map((suggestion, index) =>
              <SearchSuggestion
                suggestion={suggestion}
                index={index}
                key={suggestion}
                highlightedIndex={stateHighlightedIndex}
                selectedItem={stateSelectedItem}
                onKeyDown={moveHighlight}
                selectSuggestion={() => selectSuggestion(suggestion)}
              />
            )}
          </Paper>
        }
      </FormControl>
    </div>
  )
}