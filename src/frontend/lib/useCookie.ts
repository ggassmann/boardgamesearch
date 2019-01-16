import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IHash } from 'src/lib/IHash';
import { log } from 'src/lib/log';
import { Container } from './Container';

interface ICookieContainer {
  value?: any;
}

class CookieContainer extends Container<ICookieContainer> {}

const cookieContainers: IHash<CookieContainer> = {};

export const useCookie = (name: string, defaultValue?: string) => {
  if (!cookieContainers[name]) {
    const startingValue =
      Cookies.get(name) || Cookies.get(name) || defaultValue || undefined;
    cookieContainers[name] = new CookieContainer();
    cookieContainers[name].setState({
      value: startingValue,
    });
    if (startingValue !== undefined) {
      Cookies.set(name, startingValue, {expires: 7});
    }
  }
  const cookieStore = cookieContainers[name].useStore();

  const setCookie = (value: any) => {
    if (value === undefined) {
      Cookies.remove(name);
    } else {
      Cookies.set(name, value, {expires: 7});
    }
    cookieStore.setState({value});
  };

  return [cookieStore.state.value, setCookie];
};
