import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';
import { Container } from '../lib/Container';

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
    if (bypassCheck || !this.state.displayName || !this.state.avatar) {
      const result = await (await fetch(
        `${host}:${userPort}${userOriginPath}account`, {credentials: 'include'},
      )).json();
      if (result.success) {
        setState({
          displayName: result.user.displayName,
          avatar: result.user.avatar,
        });
      }
    }
  }
}

export const GlobalStoreInstance = new GlobalStore();
