import * as React from 'react';
import { useCookie } from 'src/frontend/lib/useCookie';
import { GlobalStoreInstance } from 'src/frontend/stores/GlobalStore';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

interface IAccountPageProps {
  finalizeLoadable: () => void;
}

export default ({finalizeLoadable}: IProductPageProps) => {
  const [sessionKey, setSessionKey] = useCookie('sessionKey');
  const globalStore = GlobalStoreInstance.useStore();
  GlobalStoreInstance.populateAccount(globalStore.setState);
  finalizeLoadable();

  const logout = () => {
    setSessionKey(undefined);
    globalStore.setState({
      avatar: undefined,
      displayName: undefined,
    });
  };

  return (
    <div>
      <h1>Account Page</h1>
      Welcome {globalStore.state.displayName}!
      <a href='#' onClick={logout}>Log Out</a>
    </div>
  );
};
