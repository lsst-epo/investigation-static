import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QACalculator from '../index.jsx';

const cardId = 'qa-calc-card';
const inputId = 'qa-calc-input';
const equationId = 'qa-calc-equation';
const calcNameId = 'qa-calc-size';
const testHandler = jest.fn();
const props = {
  question: {
    questionType: 'SizeCalculator',
  },
  answerHandler: testHandler,
};

test('SizeCalculator renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  // Assert
  expect(getByTestId(calcNameId)).toBeInTheDocument();
});

test('SizeCalculator renders with at least two inputs', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  // Assert
  expect(input1).toBeInTheDocument();
  expect(input2).toBeInTheDocument();
});

test('SizeCalculator magnitude input = 5, albedo input = 0.2 and returns D = 297.173 km', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const equationKE = getByTestId(calcNameId);
  // Act
  fireEvent.change(input1, { target: { value: '5' } });
  fireEvent.change(input2, { target: { value: '0.2' } });
  // Assert
  await waitFor(() => {
    expect(input1.value).toBe('5');
    expect(input2.value).toBe('0.2');
    expect(equationKE).toHaveTextContent('297,173.434 m');
  });
});
