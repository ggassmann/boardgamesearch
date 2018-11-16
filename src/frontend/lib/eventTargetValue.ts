export const eventTargetValue = (f: (...args: any[]) => any, ...args: any[]) => {
  return (event: any) => {
    return f(event.target.value, ...args);
  };
};
