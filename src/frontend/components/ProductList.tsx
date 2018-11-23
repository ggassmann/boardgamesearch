import * as React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import { IThing } from 'src/services/IThing';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';
import styled from 'styled-components';
import { ProductPageLoadable } from '../routes/ProductPage/ProductPageLoadable';
import { getColor } from '../Theme';
import { Card } from './Card';
import { dp1 } from './Elevation';

interface IProductPropTypes {
  item: IThing;
}

interface IProductListPropTypes {
  products: any;
}

const ProductContainer = styled(Link)`
  ${dp1}
  background-color: ${getColor({type: 'background', color: 'neutral'})};
  text-decoration: none;
  display: block;

  padding: 1em;
`;

const Product = ({ item }: IProductPropTypes) => (
  <li>
    <ProductContainer to={`/item/${item.id}/${slugify(item.name).toLowerCase()}`}>
      <Card hoverable={true} onMouseOver={ProductPageLoadable.preload}>
        <img src={item.thumbnail} alt=''/>
        <h3>{item.name}</h3>
        <p>Rating: {item.suggestedRating || '?'}</p>
      </Card>
    </ProductContainer>
  </li>
);

const ProductListContainer = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ProductList = ({ products }: IProductListPropTypes) => {
  return (
    <ProductListContainer>
      {products.docs.map((item: IThing) => <Product key={item.id} item={item} />)}
    </ProductListContainer>
  );
};
