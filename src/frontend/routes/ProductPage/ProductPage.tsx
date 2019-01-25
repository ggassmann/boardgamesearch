import { formatMoney } from 'accounting';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Box } from 'src/frontend/components/Box';
import { Card } from 'src/frontend/components/Card';
import { Flex } from 'src/frontend/components/Flex';
import { ProductList } from 'src/frontend/components/ProductList';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import styled from 'src/frontend/styled';
import { IThing } from 'src/lib/IThing';
import { log } from 'src/lib/log';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';

interface IProductDescriptionProps {
  description: string;
}

const ProductRightPanel = styled(Box)`
  min-width: 18rem;
`;

const ProductImage = styled.img`
  max-width: unset;
  width: 100%;
`;

const ProductDescription = ({ description }: IProductDescriptionProps) => {
  const outerSegments = description.split('\n\n');
  return (
    <>
      {
        outerSegments
          .map((segment) => segment.trim().split('\n'))
          .map((segment, segmentIndex) => (
            <React.Fragment key={segmentIndex}>
              <p>
                {segment.map((innerSegment, innerSegmentIndex) => (
                  <React.Fragment key={innerSegmentIndex}>
                    {innerSegment.trim()}
                    {innerSegmentIndex !== segment.length - 1 && <br /> || ''}
                  </React.Fragment>
                ))}
              </p>
            </React.Fragment>
          ))
      }
    </>
  );
};

const ProductImageCard = styled(Card)`
  max-width: 100%;
  @media screen and (min-width: 890px) {
    max-width: 50vw;
  }
`;

const ProductAmazonLink = styled.a`
  max-height: 64px;
  margin-top: 1em;
  display: block;
  img {
    max-height: 64px;
  }
`;

interface IProductProducersGroupProps {
  label: string;
  productKey: string;
  contents: string[];
}

const ProductFacetGroupCard = styled(Card)`
  flex: 1;
  flex-basis: 18em;
  display: flex;
  flex-direction: column;
`;

const ProductFacetList = styled.ul`
  list-style: none;
  margin: 0;
`;

const ProductFacetGroupHeader = styled.h4`
  margin-bottom: 0.25em;
`;

const ProductFacet = ({label, productKey, contents}: IProductProducersGroupProps) => {
  return (
    <>
      {contents && contents.length > 0 &&
        <>
          <ProductFacetGroupHeader>{label}</ProductFacetGroupHeader>
          <ProductFacetList>
            {contents.map((content) => (
              <li key={content}>
                {content}
              </li>
            ))}
          </ProductFacetList>
        </>
      }
    </>
  );
};

export default hot(module)(({ id, finalizeLoadable }: IProductPageProps) => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}item/${id}`;

  const [productResults, productStatus] = useFetch(endpoint, null);
  if (!productResults || productStatus === FETCH_STATUS_FETCHING) {
    return null;
  } else {
    finalizeLoadable();
  }
  const product: IThing = productResults.item;
  const relatedItems: IThing[] = productResults.relatedItems;
  log(product, relatedItems);
  const amazonLink = product.amazonLink || `https://www.amazon.com/s/ref=as_li_ss_tl?k=${
    encodeURIComponent(product.name)
    }&i=toys-and-games&ref=nb_sb_noss_1&linkCode=ll2` +
    '&tag=bgsearch02-20&linkId=b2314d0ee1c9f3dbaa8f19c84d281bcd&language=en_US';
  return (
    <div>
      <h1>
        {product.name}
      </h1>
      <Flex row={true} verticalAlignItems={'flex-start'} gutter={6}>
        <Box grow={1} shrink={1} basis='auto'>
          <ProductImageCard>
            <ProductImage src={product.image} />
          </ProductImageCard>
          <ProductAmazonLink href={amazonLink} rel='noopener'>
            {product.amazonPrice && formatMoney(product.amazonPrice)}
            <img src={require('src/image/vendor/amazon-logo_black.jpg')} />
          </ProductAmazonLink>
        </Box>
        <ProductRightPanel grow={1000}>
          <Card>
            <ProductDescription
              description={product.description}
            />
          </Card>
        </ProductRightPanel>
      </Flex>
      <Flex row={true} verticalAlignItems={'stretch'} gutter={6}>
        <ProductFacetGroupCard>
          <ProductFacet label='Artists' productKey='artists' contents={product.artists}/>
          <ProductFacet label='Designers' productKey='designers' contents={product.designers}/>
          <ProductFacet label='Publishers' productKey='publishers' contents={product.publishers}/>
        </ProductFacetGroupCard>
        <ProductFacetGroupCard>
          <ProductFacet label='Mechanics' productKey='mechanics' contents={product.mechanics}/>
          <ProductFacet label='Families' productKey='families' contents={product.families}/>
          <ProductFacet label='Categories' productKey='categories' contents={product.categories}/>
        </ProductFacetGroupCard>
      </Flex>
      <Card>
        <h4>You may also like:</h4>
        <ProductList products={{docs: relatedItems}}/>
      </Card>
    </div>
  );
});
