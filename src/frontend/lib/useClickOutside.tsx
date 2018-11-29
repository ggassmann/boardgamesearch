import * as React from 'react';
import {useEffect, useRef} from 'react';

export const useClickOutside = (ref: React.MutableRefObject<Node>, onClickOutside: (event: MouseEvent) => any) => {
  const handleClick = (e: any) => {
    if (ref.current.contains(e.target)) {
      return;
    }
    onClickOutside(e);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false);

    return () => {
      document.removeEventListener('mousedown', handleClick, false);
    };
  });
};
