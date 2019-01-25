declare module 'node-fetch' {
  export let fetch: (endpoint: string, options?: any, ...params: any[]) => Promise<Response>;
  export default fetch;
}