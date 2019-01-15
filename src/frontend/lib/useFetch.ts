import { useState } from 'react';

import { log } from 'src/lib/log';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import { useClickOutside } from './useClickOutside';

export const FETCH_STATUS_UNINITIALIZED = 0;
export const FETCH_STATUS_FETCHING = 1;
export const FETCH_STATUS_SUCCESS = 2;

export const useFetch = (endpoint: string, startingValue: any, options: any = {}) => {
  const [stateEndpoint, setStateEndpoint] = useState(null);
  const [stateOptions, setStateOptions] = useState(null);
  const [stateStatus, setStateStatus] = useState(FETCH_STATUS_UNINITIALIZED);
  const [stateFetchAbortController, setStateFetchAbortController] = useState(null);
  const [stateResponse, setStateResponse] = useState(startingValue);

  if (
    stateEndpoint !== endpoint ||
    JSON.stringify(Object.keys(stateOptions)) !== JSON.stringify(Object.keys(options)) || // Start with keys.
    JSON.stringify(stateOptions) !== JSON.stringify(options)
  ) {
    setStateEndpoint(endpoint);
    setStateOptions(options);
    setStateStatus(FETCH_STATUS_FETCHING);

    if (stateFetchAbortController) {
      stateFetchAbortController.abort();
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setStateFetchAbortController(controller);

    if (options.body) {
      options = Object.assign(
        {},
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        options,
        {
          body: JSON.stringify(options.body),
        },
      );
    }

    const fetchOptions = Object.assign({}, {credentials: 'include'}, options, {signal});

    fetch(`${endpoint}`, fetchOptions).then(async (response) => {
      const data = await response.json();
      setStateResponse(data);
      setStateStatus(FETCH_STATUS_SUCCESS);
      setStateFetchAbortController(null);
    });
  }
  return [stateResponse, stateStatus];
};
