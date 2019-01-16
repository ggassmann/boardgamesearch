import * as React from 'react';
import { Redirect } from 'react-router';
import { Section } from 'src/frontend/components/Section';
import { useCookie } from 'src/frontend/lib/useCookie';
import { GlobalStoreInstance } from 'src/frontend/stores/GlobalStore';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

interface IAccountPageProps {
  finalizeLoadable: () => void;
}

export default ({finalizeLoadable}: IProductPageProps) => {
  const globalStore = GlobalStoreInstance.useStore();
  GlobalStoreInstance.populateAccount();
  finalizeLoadable();

  log('rendered', globalStore);

  return (
    <Section>
      <>
        {globalStore.state.loggedIn &&
          <>
            <h1>Account Page</h1>
            Welcome {globalStore.state.displayName}!<br/>
            <a href='' onClick={() => GlobalStoreInstance.logout()}>Log Out</a>
          </>
        }
        {globalStore.state.loggedOut &&
          <Redirect to='/user/signin'/>
        }
      </>
    </Section>
  );
};
