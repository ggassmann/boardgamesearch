declare module 'react-store-hook' {
  export class Container {
    setState(any: any): void;
  }
  export function useStore(container: Container): any[];
}