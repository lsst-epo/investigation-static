import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Card from './index.js';

test('Card renders with required props', () => {
  // Arrange
  const { getByText } = render(<Card>test</Card>);
  const card = getByText('test');
  // Assert
  expect(card).toBeInTheDocument();
  expect(card).toHaveClass('md-card');
});
