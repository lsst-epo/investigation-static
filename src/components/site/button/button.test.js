import React from 'react';
import { render } from '@testing-library/react';
import ButtonIcon from './ButtonIcon.jsx';
import Button from './index.js';
import ArrowLeft from '../icons/ArrowLeft.jsx';

test('Button renders with required props', () => {
  // Arrange
  const { getByRole } = render(<Button flat />);
  // Assert
  expect(getByRole('button')).toBeInTheDocument();
});

test('ButtonIcon renders with props', () => {
  // Arrange
  const { getByText, getByRole } = render(<ButtonIcon Icon={ArrowLeft} srText="test" />);
  const srEl = getByText('test')
  // Assert
  expect(srEl).toHaveClass('screen-reader-only');
  expect(getByRole('presentation')).toBeInTheDocument();
});

test('ButtonIcon renders Icon', () => {
  // Arrange
  const { getByRole } = render(<ButtonIcon Icon={ArrowLeft} />);
  // Assert
});

