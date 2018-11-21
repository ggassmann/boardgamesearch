import * as React from 'react';
import styled, { keyframes } from '../styled';
import { getColor } from '../Theme';
import { Flex } from './Flex';

const squarePositions = [
  [0, 0],
  [0, 100],
  [100, 100],
  [100, 0],
];

const squareKeyframes = squarePositions.map((position, i) => {
  const squareKeyframe = keyframes`
    0%, 100% {
      transform: translate(${squarePositions[(i + 0) % 4][0]}px, ${squarePositions[(i + 0) % 4][1]}px);
    }
    25% {
      transform: translate(${squarePositions[(i + 1) % 4][0]}px, ${squarePositions[(i + 1) % 4][1]}px);
    }
    50% {
      transform: translate(${squarePositions[(i + 2) % 4][0]}px, ${squarePositions[(i + 2) % 4][1]}px);
    }
    75% {
      transform: translate(${squarePositions[(i + 3) % 4][0]}px, ${squarePositions[(i + 3) % 4][1]}px);
    }
  `;
  return squareKeyframe;
});

const squareColors = [
  getColor({type: 'background', color: 'primary'}),
  getColor({type: 'background', color: 'secondary', brightness: 'light'}),
  getColor({type: 'background', color: 'primary', brightness: 'dark'}),
  getColor({type: 'background', color: 'secondary', brightness: 'dark'}),
];

interface ISquareProps {
  num: number;
}

const Square = styled.div`
  animation: ${({num}: ISquareProps) => squareKeyframes[num]} 1.8s cubic-bezier(.6,.01,.4,1) infinite;
  width: 50%;
  height: 50%;
  background-color: ${({num}: ISquareProps) => squareColors[num]};
  position: absolute;
`;

const SquareContainer = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
`;

export const SquareLoader = () => (
  <SquareContainer>
    <Square num={0}/>
    <Square num={1}/>
    <Square num={2}/>
    <Square num={3}/>
  </SquareContainer>
);

const SquarePageLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
  align-items: center;
`;

export const SquarePageLoader = () => (
  <SquarePageLoaderContainer>
    <SquareLoader/>
  </SquarePageLoaderContainer>
);
