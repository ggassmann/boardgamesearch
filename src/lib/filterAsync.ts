export const filterAsync = (array: any[], predicate: (element: any, index: number, data: any[]) => any) => {
  const data = Array.from(array) ;
  return Promise.all(data.map((element, index) => predicate(element, index, data)))
    .then((result) => {
      return data.filter((element, index) => {
        return result[index];
      });
    });
};
