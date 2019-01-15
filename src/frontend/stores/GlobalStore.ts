import { useEffect, useState } from 'react';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';
import { Container } from '../lib/Container';
import { useCookie } from '../lib/useCookie';
import { FETCH_STATUS_SUCCESS, useFetch } from '../lib/useFetch';

export interface IGlobalStoreStateProps {
  displayName?: string;
  avatar?: string;
  loggedIn?: boolean;
}

export class GlobalStore extends Container<IGlobalStoreStateProps> {
  public state: IGlobalStoreStateProps = {};

  public setSessionKey: (sessionKey: any) => void;

  public useStore() {
    const [sessionKey, setSessionKey] = useCookie('sessionKey');
    this.setSessionKey = setSessionKey;
    return super.useStore();
  }

  public async logout(setState: (newState: IGlobalStoreStateProps) => void) {
    this.setSessionKey(undefined);
    setState({
      displayName: undefined,
      avatar: undefined,
      loggedIn: false,
    });
  }

  public async populateAccount(setState: (newState: IGlobalStoreStateProps) => void, bypassCheck = false) {
    const [sessionKey, setSessionKey] = useCookie('sessionKey');
    if (!this.state.loggedIn && sessionKey) {
      const result = await (
        await fetch(`${host}:${userPort}${userOriginPath}account`, {credentials: 'include'})
      ).json();
      if (result && result.success) {
        setState({
          displayName: result.user.displayName,
          avatar: result.user.avatar,
          loggedIn: true,
        });
      }
    }
  }
}

export const GlobalStoreInstance = new GlobalStore();
