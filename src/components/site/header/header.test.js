import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from './index.jsx';

const testTitle = 'Test Title';
const handleToggleClick = jest.fn();

test('Header renders without props', () => {
  // Arrange
  const { getByTestId } = render(<Header />);
  // Assert
  expect(getByTestId('site-header')).toBeInTheDocument();
});

test('Header Logo alt text is Investigation Title', () => {
  const headerKey = 'interface::header.title';
  // Arrange
  const { getByAltText, getByText, queryByText } = render(
    <Header logo="fake/image/path" investigationTitle={testTitle} />
  );
  const logoLink = getByAltText(testTitle);
  // Assert
  expect(getByText(headerKey)).toBeInTheDocument();
  expect(queryByText(`${testTitle}: Page`)).toBe(null);
  expect(logoLink).toBeInTheDocument();
});

test('When TOC is visible Header TOC toggle reads "Close..."', () => {
  // Arrange

  const { getByRole } = render(
    <Header tocVisability toggleToc={handleToggleClick} />
  );
  // Assert
  expect(getByRole('button')).toHaveTextContent('interface::header.toc_close');
});

test('When TOC is visible Header TOC toggle reads "Open..."', () => {
  // Arrange

  const { getByRole } = render(<Header toggleToc={handleToggleClick} />);
  // Assert
  expect(getByRole('button')).toHaveTextContent('interface::header.toc_open');
});

test('When Header TOC toggle is clicked toggleToc callback fires"', async () => {
  // Arrange
  const { getByRole } = render(<Header toggleToc={handleToggleClick} />);
  const tocToggle = getByRole('button');
  // Act
  fireEvent.click(tocToggle);
  // Assert
  expect(handleToggleClick).toHaveBeenCalled();
});
