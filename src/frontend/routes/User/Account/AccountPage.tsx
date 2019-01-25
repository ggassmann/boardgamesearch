import * as React from 'react';
import {hot} from 'react-hot-loader';
import { Redirect } from 'react-router';

import { Section } from 'src/frontend/components/Section';
import { GlobalStoreInstance } from 'src/frontend/stores/GlobalStore';

interface IAccountPageProps {
  finalizeLoadable: () => void;
}

export default hot(module)(({finalizeLoadable}: IProductPageProps) => {
  const globalStore = GlobalStoreInstance.useStore();
  finalizeLoadable();

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
        {!globalStore.state.loggingIn && globalStore.state.loggedOut &&
          <Redirect to='/user/signin'/>
        }
      </>
    </Section>
  );
});
