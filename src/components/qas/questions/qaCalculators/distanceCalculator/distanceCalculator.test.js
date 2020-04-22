import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DistanceCalculator from './index.jsx';

const question66 = {
  id: '66',
  questionType: 'DistanceCalculator',
  title: 'Question #1',
  label:
    '<p>Enter the peak apparent magnitude (m) for supernova #4 to find its distance from Earth.</p>',
  placeholder: 'Enter peak magnitude',
  answerPre: '<p>Selected: </p>',
  answerAccessor: 'text',
};

test('Distance Calculator renders with question #66', () => {
  const component = render(<DistanceCalculator question={question66} />);
  expect(component).toMatchSnapshot();
});
