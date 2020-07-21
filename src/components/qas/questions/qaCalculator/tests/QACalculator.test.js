import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QACalculator from '../index.jsx';

const cardId = 'qa-calc-card';
const inputId = 'qa-calc-input';
const testHandler = jest.fn();
const props = {
  question: {
    questionType: 'DistanceCalculator',
  },
  answerHandler: testHandler,
};

test('QACalculator renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  // Assert
  expect(getByTestId(cardId)).toBeInTheDocument();
});

test('QACalculator renders with at least one input', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input = getByTestId(`${inputId}-0`);
  // Assert
  expect(input).toBeInTheDocument();
});

test('QACalculator fires focus then change event on input to value of 10. Blur event on input and return an input value of 10.', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input = getByTestId(`${inputId}-0`);
  // Act
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: '10' } });
  fireEvent.blur(input);
  // Assert
  await waitFor(() => {
    expect(input.value).toBe('10');
  });
});
