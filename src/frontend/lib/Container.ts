import {Container as OriginalContainer, useStore as originalUseStore} from 'react-store-hook';

interface IContainerContents<T> {
  setState: (state: T) => void;
  state: T;
}

export class Container<T> extends OriginalContainer {
  public useStore(): IContainerContents<T> {
    const [originalState, originalSetState] = originalUseStore(this);
    const contents: IContainerContents<T> = {
      setState: originalSetState,
      state: originalState,
    };
    return contents;
  }
}
