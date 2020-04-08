import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table from './index.jsx';

const testId = "test-table";
const testTitles = ['#1', '#2', '#3'];
const testRows = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']];

test('Table renders with NO props', () => {
  // Arrange
  const { getByTestId } = render(<Table />);
  const table = getByTestId(testId);
  // Assert
  expect(table).toBeInTheDocument();
});

test('Table renders Header with colTitles prop', () => {
  // Arrange
  const { getByTestId, screen } = render(<Table colTitles={testTitles} />);
  const table = getByTestId(testId);
  const thead = table.querySelector('thead');
  const ths = thead.querySelectorAll('th');
  const firstCell = ths[0];
  // Assert
  expect(ths.length).toEqual(testTitles.length);
  expect(firstCell).toHaveTextContent('#1');
});

test('Table renders Table Body with rows prop', () => {
  // Arrange
  const { getByTestId } = render(<Table rows={testRows} />);
  const table = getByTestId(testId);
  const tbody = table.querySelector('tbody');
  const trs = tbody.querySelectorAll('tr');
  const firstCell = trs[0].querySelector('td');
  // Assert
  expect(trs.length).toEqual(testRows.length);
  expect(firstCell).toHaveTextContent('A');
});

test('Table renders Row Titles with includeRowTitles prop', () => {
  // Arrange
  const { getByTestId } = render(<Table colTitles={testTitles} rows={testRows} includeRowTitles />);
  const table = getByTestId(testId);
  const tbody = table.querySelector('tbody');
  const td = tbody.querySelector('td');
  // Assert
  expect(td).toHaveTextContent('A');
  expect(td).toHaveClass('row-title');
});
