import { formatMoney } from 'accounting';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Box } from 'src/frontend/components/Box';
import { Card } from 'src/frontend/components/Card';
import { Flex } from 'src/frontend/components/Flex';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import styled from 'src/frontend/styled';
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
        outerSegments.map((segment, segmentIndex) => (
          <React.Fragment key={segmentIndex}>
            <p>
              {segment.trim().split('\n').map((innerSegment, innerSegmentIndex) => (
                <React.Fragment key={innerSegmentIndex}>
                  {innerSegment}
                  {innerSegmentIndex !== outerSegments.length && <br /> || ''}
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

export default hot(module)(({ id, finalizeLoadable }: IProductPageProps) => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}item/${id}`;

  const [product, productStatus] = useFetch(endpoint, null);
  if (!product || productStatus === FETCH_STATUS_FETCHING) {
    return null;
  } else {
    finalizeLoadable();
  }
  log(product);
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
        <ProductImageCard grow={1} shrink={1} basis='auto'>
          <ProductImage src={product.image} />
        </ProductImageCard>
        <Box grow={0} basis={'92px'}>
          <Flex column={true}>
            <a href={amazonLink} rel='noopener'>
              <Box>
                {product.amazonPrice && formatMoney(product.amazonPrice)}
              </Box>
              <Box>
                <img src={require('src/image/vendor/amazon-logo_black.jpg')} />
              </Box>
            </a>
          </Flex>
        </Box>
        <ProductRightPanel grow={1000}>
          <Card>
            <ProductDescription
              description={product.description}
            />
          </Card>
        </ProductRightPanel>
      </Flex>
    </div>
  );
});
