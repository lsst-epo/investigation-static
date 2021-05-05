import React from 'react';
import { render } from '@testing-library/react';
import Legend from './index.jsx';

const testId = 'gs-legend';
const testProps = {
  activeGalaxy: {
    name: 'Galaxy #1',
    id: 'testId',
    color: '#1ab579',
    distance: 2,
    velocity: 1,
  },
  selectedData: [
    { id: 'galaxy', stuff: 'things' },
    { id: 'supernova', stuff: 'things' },
  ],
  className: 'md-btn--toolbar',
};

test('Legend renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<Legend activeGalaxy={{}} />);
  // Assert
  expect(getByTestId(testId)).toBeInTheDocument();
});

test('Legend renders labels and values with values', () => {
  // Arrange
  const { getByTestId } = render(<Legend {...testProps} />);
  const $legend = getByTestId(testId);
  // Assert
  expect($legend).toHaveTextContent('1');
  expect($legend).toHaveTextContent('2');
});

test('Legend renders labels without values', () => {
  const { activeGalaxy } = testProps;
  // Arrange
  const { getByTestId } = render(<Legend activeGalaxy={activeGalaxy} />);
  const $legend = getByTestId(testId);
  // Assert
  expect($legend).toHaveTextContent('Velocity');
  expect($legend).toHaveTextContent('Distance');
});
