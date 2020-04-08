import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TextField from './index.js';

test('TextField renders with required props', () => {
  // Arrange
  const { getByLabelText } = render(<TextField id="test" label="test" />);
  const textField = getByLabelText('test');
  // Assert
  expect(textField).toBeInTheDocument();
  expect(textField).toHaveClass('md-text-field');
});

