import * as React from 'react';
import { Card } from 'src/frontend/components/Card';
import { Flex } from 'src/frontend/components/Flex';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';

interface IProductDescriptionProps {
  description: string;
}

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

export default ({ id, finalizeLoadable }: IProductPageProps) => {
  const endpoint = `${host}:${searchPort}${searchOriginPath}item/${id}`;

  const [product, productStatus] = useFetch(endpoint, null);
  if (!product || productStatus === FETCH_STATUS_FETCHING) {
    return null;
  } else {
    finalizeLoadable();
  }
  log(product);
  return (
    <div>
      <h1>
        {product.name}
      </h1>
      <Flex row={true} verticalAlignItems={'flex-start'} gutter={6}>
        <Card grow={1}>
          <img src={product.image} />
        </Card>
        <Card grow={3}>
          <ProductDescription
            description={product.description}
          />
        </Card>
      </Flex>
    </div>
  );
};
