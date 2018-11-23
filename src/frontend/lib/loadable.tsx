import * as React from 'react';
import {useEffect, useState} from 'react';

import { SquarePageLoader } from '../components/SquareLoader';

export const loadable = (
  importFunction: () => Promise<any>,
  loadingComponent: any = null,
) => {
  const LoadingComponent = loadingComponent || (() => <SquarePageLoader/>);
  const FinalComponent = (props: any) => {
    const [BaseComponent, setStateBaseComponent] = useState(null);
    const [stateFinalizedLoading, setStateFinalizedLoading] = useState(false);

    const finalizeLoadable = () => {
      if (!stateFinalizedLoading) {
        setStateFinalizedLoading(true);
      }
    };

    useEffect(() => {
      let canceled = false;
      if (BaseComponent === null) {
        importFunction().then((module) => {
          if (canceled) {
            return;
          }
          setStateBaseComponent(() => module.default);
        });
      }
      return () => {
        canceled = true;
      };
    });

    return (
      <>
        {BaseComponent &&
          <BaseComponent {...props} finalizeLoadable={finalizeLoadable}/>
        }
        {!stateFinalizedLoading &&
          <LoadingComponent/>
        }
      </>
    );
  };
  FinalComponent.preload = importFunction;
  return FinalComponent;
};
