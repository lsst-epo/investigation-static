import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QACalculator from '../index.jsx';

const cardId = 'qa-calc-card';
const inputId = 'qa-calc-input';
const equationId = 'qa-calc-equation';
const equationDMId = 'qa-calc-distance-modulus';
const equationParsecsId = 'qa-calc-parsecs';
const testHandler = jest.fn();
const props = {
  question: {
    questionType: 'DistanceCalculator',
  },
  answerHandler: testHandler,
};

test('DistanceCalculator renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  // Assert
  expect(getByTestId(equationDMId)).toBeInTheDocument();
});

test('DistanceCalculator renders with at least one input', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input = getByTestId(`${inputId}-0`);
  // Assert
  expect(input).toBeInTheDocument();
});

test('DistanceCalculator has input of 5 and returns m = 5 and DM = 24.4', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input = getByTestId(`${inputId}-0`);
  const equationDMElem = getByTestId(equationDMId);
  const equationParsecsElem = getByTestId(equationParsecsId);
  // Act
  fireEvent.change(input, { target: { value: '5' } });
  // Assert
  await waitFor(() => {
    expect(input.value).toBe('5');
    expect(equationDMElem).toHaveTextContent('5');
    expect(equationParsecsElem).toHaveTextContent('24.4');
  });
});

test('DistanceCalculator only accepts numbers as inputs', async () => {
  const equationDMId = 'qa-calc-distance-modulus';
  const equationParsecsId = 'qa-calc-parsecs';
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input = getByTestId(`${inputId}-0`);
  const equationDMElem = getByTestId(equationDMId);
  const equationParsecsElem = getByTestId(equationParsecsId);
  // Act
  fireEvent.change(input, { target: { value: 'string' } });
  // Assert
  await waitFor(() => {
    expect(input.value).toBe('');
    expect(equationDMElem).not.toHaveTextContent('string');
    expect(equationParsecsElem).not.toHaveTextContent('string');
  });
});
