let queue: any[] = [];
let nextLog: NodeJS.Immediate;

export const log = async (x: any, ...params: any[]) => {
  queue = [
    ...queue,
    [x, params],
  ];
  if(!nextLog) {
    nextLog = setImmediate(() => {
      while(queue.length > 0) {
        console.log(queue[0][0], ...queue[0][1]);
        queue = queue.slice(1);
      }
    });
    nextLog = undefined;
  }
};