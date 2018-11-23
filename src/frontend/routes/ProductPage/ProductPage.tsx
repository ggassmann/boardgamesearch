import * as React from 'react';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';

export default ({id, finalizeLoadable}: IProductPageProps) => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}item/${id}`;

  const [product, productStatus] = useFetch(endpoint, null);
  if (!product || productStatus === FETCH_STATUS_FETCHING) {
    return null;
  } else {
    finalizeLoadable();
  }
  return (
    <div>
      <img src={product.image}/>
      {JSON.stringify(product)}
    </div>
  );
};
