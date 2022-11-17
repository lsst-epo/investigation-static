import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Blinker from './index.jsx';

const imagesId = 'blinker-images';
const controlsId = 'blinker-controls';
const testProps = {
  images: [
    { id: 1, name: '/path/to/image/1.jpeg' },
    { id: 2, name: '/path/to/image/2.jpeg' },
    { id: 3, name: '/path/to/image/3.jpeg' },
  ],
  activeId: 1,
};
const testHandler = jest.fn();

test('Blinker renders with required props', () => {
  const { images } = testProps;
  // Arrange
  const { getByTestId } = render(<Blinker images={images} />);
  // Assert
  expect(getByTestId(imagesId)).toBeInTheDocument();
  expect(getByTestId(controlsId)).toBeInTheDocument();
});

test('Blinker calls callback when Start/Stop is clicked', () => {
  // Arrange
  const { getByTestId } = render(
    <Blinker handleStartStop={testHandler} {...testProps} />
  );
  // Act
  fireEvent.click(getByTestId('blinker-start-stop'));
  // Assert
  expect(testHandler).toHaveBeenCalled();
});

test('Blinker calls callback when Forward is clicked', () => {
  // Arrange
  const { getByTestId } = render(
    <Blinker handleNext={testHandler} {...testProps} />
  );
  // Act
  fireEvent.click(getByTestId('blinker-forward'));
  // Assert
  expect(testHandler).toHaveBeenCalled();
});

test('Blinker calls callback when Backward is clicked', () => {
  // Arrange
  const { getByTestId } = render(
    <Blinker handlePrevious={testHandler} {...testProps} />
  );
  // Act
  fireEvent.click(getByTestId('blinker-rewind'));
  // Assert
  expect(testHandler).toHaveBeenCalled();
});
