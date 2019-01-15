import cookiesjs from 'cookiesjs';
import { useEffect, useState } from 'react';
import { IHash } from 'src/lib/IHash';
import { Container } from './Container';

interface ICookieContainer {
  value?: any;
}

class CookieContainer extends Container<ICookieContainer> {}

const cookieContainers: IHash<CookieContainer> = {};

export const useCookie = (name: string, defaultValue?: string) => {
  if (!cookieContainers[name]) {
    cookieContainers[name] = new CookieContainer();
  }
  const cookieStore = cookieContainers[name].useStore();

  const setCookie = (value: string) => {
    cookiesjs({[name]: value});
    cookieStore.setState({value});
  };

  return [cookieStore.state.value, setCookie];
};
