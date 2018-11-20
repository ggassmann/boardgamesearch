import * as React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import { IThing } from 'src/services/IThing';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import styled from 'styled-components';
import { getColor } from '../Theme';
import { dp1 } from './Elevation';

interface IProductPropTypes {
  item: IThing;
}

interface IProductListPropTypes {
  query?: string;
  queryFilters?: ISearchFilter[];
}

const ProductContainer = styled(Link)`
  ${dp1}
  background-color: ${getColor({type: 'background', color: 'neutral'})};
  text-decoration: none;
  display: block;

  &:hover {
    background-color: ${getColor({type: 'background', color: 'neutral', brightness: 'slightdark'})};
  }
`;

const Product = ({ item }: IProductPropTypes) => (
  <ProductContainer to={`/item/${slugify(item.name).toLowerCase()}`}>
    <li>
      <img src={item.thumbnail} alt=''/>
      <h3>{item.name}</h3>
      <p>Rating: {item.suggestedRating || '?'}</p>
    </li>
    <li>
      <hr/>
    </li>
  </ProductContainer>
);

export const ProductList = ({ query, queryFilters }: IProductListPropTypes) => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}search`;
  const [data, dataStatus] = useFetch(endpoint, { docs: [], explain: [] }, {
    body: {
      query,
      filters: queryFilters,
    },
  });
  return (
    <ul>
      {dataStatus === FETCH_STATUS_FETCHING && <div/>}
      {data.docs.map((item: IThing) => <Product key={item.id} item={item} />)}
    </ul>
  );
};
