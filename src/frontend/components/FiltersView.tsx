import * as React from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

const FiltersViewContainer = styled(Paper)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

export const FiltersView = () => {
  return (
    <FiltersViewContainer>
      Test
    </FiltersViewContainer>
  )
}