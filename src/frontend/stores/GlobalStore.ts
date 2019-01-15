import { useState } from 'react';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';
import { Container } from '../lib/Container';
import { useFetch } from '../lib/useFetch';

export interface IGlobalStoreStateProps {
  displayName?: string;
  avatar?: string;
}

export class GlobalStore extends Container<IGlobalStoreStateProps> {
  public state: IGlobalStoreStateProps = {
    displayName: undefined,
    avatar: undefined,
  };

  public async populateAccount(setState: (newState: IGlobalStoreStateProps) => void, bypassCheck = false) {
    const [result, resultStatus] = useFetch(`${host}:${userPort}${userOriginPath}account`, undefined);
    if (result && result.success && (
      this.state.displayName !== result.user.displayName ||
      this.state.avatar !== result.user.avatar
    )) {
      setState({
        displayName: result.user.displayName,
        avatar: result.user.avatar,
      });
    }
  }
}

export const GlobalStoreInstance = new GlobalStore();
