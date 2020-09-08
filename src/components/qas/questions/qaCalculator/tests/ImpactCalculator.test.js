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
  fireEvent.change(input1, { target: { value: '1' } });
  fireEvent.change(input2, { target: { value: '3000' } });
  fireEvent.change(input3, { target: { value: '17' } });
  fireEvent.change(input4, { target: { value: '200' } });
  // Assert
  await waitFor(() => {
    expect(input1.value).toBe('1');
    expect(input2.value).toBe('3000');
    expect(input3.value).toBe('17');
    expect(input4.value).toBe('200');
    expect(equationImpact).toHaveTextContent('10.577 km');
    expect(equationImpact).toHaveTextContent('3.74 km');
    expect(equationImpact).toHaveTextContent(
      'Richter Magnitude at 200 km from impact: 5.6'
    );
    // expect(equationImpact).toHaveTextContent('Damage negligible');
    expect(equationImpact).toHaveTextContent(
      'Air Blast Over Pressure at 200 km: 24,449.1 Pa'
    );
    // expect(equationImpact).toHaveTextContent(
    //   'Interior partitions of wood frame'
    // );
  });
});

test('ImpactCalculator only accepts numbers as inputs', async () => {
  // Arrange
  const { getByTestId } = render(<QACalculator {...props} />);
  const input1 = getByTestId(`${inputId}-0`);
  const input2 = getByTestId(`${inputId}-1`);
  const input3 = getByTestId(`${inputId}-2`);
  const input4 = getByTestId(`${inputId}-3`);
  const equationImpact = getByTestId(calcNameId);
  // Act
  fireEvent.change(input1, { target: { value: 'string' } });
  fireEvent.change(input2, { target: { value: 'string' } });
  fireEvent.change(input3, { target: { value: 'string' } });
  fireEvent.change(input4, { target: { value: 'string' } });
  // Assert
  await waitFor(() => {
    expect(input1.value).toBe('');
    expect(input2.value).toBe('');
    expect(input3.value).toBe('');
    expect(input4.value).toBe('');
    expect(equationImpact).toHaveTextContent('? km');
  });
});
