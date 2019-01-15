import cookiesjs from 'cookiesjs';
import { useEffect, useState } from 'react';
import { log } from 'src/lib/log';

export const useCookie = (name: string, defaultValue?: string) => {
  const [stateCookieValue, setStateCookieValue] = useState(cookiesjs(name) || defaultValue || undefined);

  const setCookie = (value: string) => {
    cookiesjs({[name]: value});
    setStateCookieValue(value);
  };

  useEffect(() => {
    let currentEffectCookieValue = stateCookieValue;
    const cookieCheckerInterval = setInterval(() => {
      const nextVal = cookiesjs(name);
      if (nextVal !== currentEffectCookieValue) {
        setStateCookieValue(nextVal);
        currentEffectCookieValue = nextVal;
      }
    }, 1000 / 30);
    return () => {
      clearInterval(cookieCheckerInterval);
    };
  });

  return [stateCookieValue, setCookie];
};
