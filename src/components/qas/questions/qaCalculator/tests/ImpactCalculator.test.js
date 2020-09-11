import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QACalculator from '../index.jsx';

const cardId = 'qa-calc-card';
const inputId = 'qa-calc-input';
const equationId = 'qa-calc-equation';
const calcNameId = 'qa-calc-impact';
const testHandler = jest.fn();
const props = {
  question: {
    questionType: 'ImpactCalculator',
  },
  answerHandler: testHandler,
};

test('ImpactCalculator renders with required props', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  // Assert
  expect(getByTestId(calcNameId)).toBeInTheDocument();
});

test('ImpactCalculator renders with at least four inputs', () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const input3 = getByTestId(`${inputId}-2`);
  const input4 = getByTestId(`${inputId}-3`);
  // Assert
  expect(input1).toBeInTheDocument();
  expect(input2).toBeInTheDocument();
  expect(input3).toBeInTheDocument();
  expect(input4).toBeInTheDocument();
});

test("ImpactCalculator diameter input = 1, density input = 3000, velocity input = 17, observer's distance = 200 and returns as expected", async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const input3 = getByTestId(`${inputId}-2`);
  const input4 = getByTestId(`${inputId}-3`);
  const equationImpact = getByTestId(calcNameId);
  // Act
  fireEvent.change(input1, { target: { value: '1000' } });
  fireEvent.change(input2, { target: { value: '3000' } });
  fireEvent.change(input3, { target: { value: '17000' } });
  fireEvent.change(input4, { target: { value: '200000' } });
  // Assert
  await waitFor(() => {
    expect(equationImpact).toHaveTextContent('10,600 m');
    expect(equationImpact).toHaveTextContent('3,740 m');
    expect(equationImpact).toHaveTextContent(
      'Richter Magnitude at 200,000 m from impact: 5.6'
    );
    expect(equationImpact).toHaveTextContent(
      'Air Blast Over Pressure at 200,000 m: 24,400 Pa'
    );
  });
});
