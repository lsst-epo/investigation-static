import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Select from './index.jsx';

const testId = 'select';
const testLabel = 'test label';
const options = [
  { value: 'value 1', label: 'label 1' },
  { value: 'value 2', label: 'label 2' },
  { value: 'value 3', label: 'label 3' },
];

const simpleOptions = ['1', '2', '3'];

test('Select renders with array of objs options', () => {
  // Arrange
  const { getByTestId } = render(<Select options={options} />);
  const select = getByTestId(testId);
  const option = select.querySelector('option');
  // Assert
  expect(option).toHaveAttribute('value', 'value 1');
  expect(option).toHaveAttribute('label', 'label 1');
  expect(option).toHaveTextContent('label 1');
});

test('Select renders simple array of options', () => {
  // Arrange
  const { getByTestId } = render(<Select options={simpleOptions} />);
  const select = getByTestId(testId);
  const option = select.querySelector('option');
  // Assert
  expect(option).toHaveAttribute('value', '1');
  expect(option).toHaveAttribute('label', '1');
  expect(option).toHaveTextContent('1');
});

test('Select renders label el with showLabel and label props', () => {
  // Arrange
  const { getByLabelText, getByTestId } = render(
    <Select id="test" options={options} showLabel label={testLabel} />
  );
  // Assert
  expect(getByLabelText(testLabel)).toBeInTheDocument();
  expect(getByTestId(testId)).toHaveAttribute('aria-label', testLabel);
  expect(document.querySelector('label')).toHaveTextContent(testLabel);
});

test('Select does NOT render label el with only label prop', () => {
  // Arrange
  const { getByLabelText, getByTestId } = render(
    <Select options={options} label={testLabel} />
  );
  // Assert
  expect(getByLabelText(testLabel)).toBeInTheDocument();
  expect(getByTestId(testId)).toHaveAttribute('aria-label', testLabel);
  expect(document.querySelector('label')).not.toBeInTheDocument();
});

test('Select renders placeholder option with placeholder prop', () => {
  // Arrange
  const { getByTestId } = render(
    <Select placeholder="placeholder" options={options} label={testLabel} />
  );
  const select = getByTestId(testId);
  const placeholderOption = select.querySelector('option[value="DEFAULT"]');
  // Assert
  expect(placeholderOption).toHaveTextContent('placeholder');
  expect(placeholderOption).toBeDisabled();
});

test('When Select value changes fires onChange callback"', async () => {
  // Arrange
  const handleChange = jest.fn();
  const { getByTestId } = render(
    <Select options={options} handleChange={handleChange} />
  );
  // Act
  fireEvent.change(getByTestId(testId), { target: { value: 'value 1' } });
  // Assert
  expect(handleChange).toHaveBeenCalled();
});

test('When Select loses focus (blur) fires onBlur callback"', async () => {
  // Arrange
  const handleBlur = jest.fn();
  const { getByTestId } = render(
    <Select options={options} handleBlur={handleBlur} />
  );
  // Act
  fireEvent.blur(getByTestId(testId));
  // Assert
  expect(handleBlur).toHaveBeenCalled();
});

test('When Select gains focus fires onFocus callback"', async () => {
  // Arrange
  const handleFocus = jest.fn();
  const { getByTestId } = render(
    <Select options={options} handleFocus={handleFocus} />
  );
  // Act
  fireEvent.focus(getByTestId(testId));
  // Assert
  expect(handleFocus).toHaveBeenCalled();
});
