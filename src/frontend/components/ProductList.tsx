import {formatMoney} from 'accounting';
import * as React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import styled from 'styled-components';

import { IThing } from 'src/lib/IThing';
import { ProductPageLoadable } from '../routes/ProductPage/ProductPageLoadable';
import { getColor } from '../Theme';
import { Box } from './Box';
import { Card } from './Card';
import { dp1 } from './Elevation';
import { Flex } from './Flex';

interface IProductPropTypes {
  item: IThing;
}

interface IProductListPropTypes {
  products: any;
}

const ProductContainer = styled(Link)`
  ${dp1}
  background-color: ${getColor({ type: 'background', color: 'neutral' })};
  text-decoration: none;
  display: block;

  padding: 1em;
`;

const ProductImageThumbnailContainer = styled(Box).attrs({
  grow: 1,
})`
  min-width: 128px;
`;

const ProductImageThumbnail = styled.img`
  max-height: 96px;
  height: 96px;
  width: auto;
`;

const ProductInfoContainer = styled(Box).attrs({
  grow: 5,
})`
  min-width: 200px;
`;

const Product = ({ item }: IProductPropTypes) => (
  <li>
    <ProductContainer to={`/item/${item.id}/${slugify(item.name).toLowerCase()}`}>
      <Card hoverEffect={true} onMouseOver={ProductPageLoadable.preload}>
        <Flex row={true}>
          <Box>
            <h3>{item.name}</h3>
          </Box>
          <Box grow={0} basis={'64px'}>
            {item.amazonPrice &&
              <Flex column={true}>
                <a href={item.amazonLink} rel='noopener'>
                  <Box>
                      {formatMoney(item.amazonPrice)}
                  </Box>
                  <Box>
                    <img src={require('src/image/vendor/amazon-logo_black.jpg')}/>
                  </Box>
                </a>
              </Flex>
            }
          </Box>
        </Flex>
        <Flex>
          <ProductImageThumbnailContainer>
            <ProductImageThumbnail src={item.thumbnail} alt='' />
          </ProductImageThumbnailContainer>
          <ProductInfoContainer>
            <Flex>
              <Box>
                <p>Rating: {item.suggestedRating || '?'}</p>
              </Box>
            </Flex>
          </ProductInfoContainer>
        </Flex>
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
