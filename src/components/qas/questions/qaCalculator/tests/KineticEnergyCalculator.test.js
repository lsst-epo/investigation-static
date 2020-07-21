import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QACalculator from '../index.jsx';

const cardId = 'qa-calc-card';
const inputId = 'qa-calc-input';
const equationId = 'qa-calc-equation';
const calcNameId = 'qa-calc-kinetic-energy';
const testHandler = jest.fn();
const props = {
  question: {
    questionType: 'KineticEnergyCalculator',
  },
  answerHandler: testHandler,
};

test('KineticEnergyCalculator renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  // Assert
  expect(getByTestId(calcNameId)).toBeInTheDocument();
});

test('KineticEnergyCalculator renders with at least two inputs', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  // Assert
  expect(input1).toBeInTheDocument();
  expect(input2).toBeInTheDocument();
});

test('KECalculator mass input = 10, velocity input = 5 and returns KE = 125 J', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const equationKE = getByTestId(calcNameId);
  // Act
  fireEvent.change(input1, { target: { value: '10' } });
  fireEvent.change(input2, { target: { value: '5' } });
  // Assert
  await waitFor(() => {
    expect(input1.value).toBe('10');
    expect(input2.value).toBe('5');
    expect(equationKE).toHaveTextContent('125 J');
  });
});

test('KineticEnergyCalculator only accepts numbers as inputs', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const equationKE = getByTestId(calcNameId);
  // Act
  fireEvent.change(input1, { target: { value: 'string' } });
  fireEvent.change(input2, { target: { value: 'string' } });
  // Assert
  await waitFor(() => {
    expect(input1.value).toBe('');
    expect(input2.value).toBe('');
    expect(equationKE).toHaveTextContent('? J');
  });
});
