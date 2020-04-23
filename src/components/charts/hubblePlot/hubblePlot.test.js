import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import HubblePlot from './index.jsx';
import Point from './Point.jsx';

const testId = 'hubble-plot';
const tooltipTestId = 'tooltip';
const testPointLabel = 'test-label';
const pointSelector = '.data-point';
const pointLabelSelector = '.point-label';
const pointRadius = 6;
const pointDiameter = pointRadius * 2;
const testHandler = jest.fn();

const testProps = {
  className: 'hubble-plot',
  data: [
    {
      name: 'Galaxy #1',
      id: 'ZTF19abqmpsr',
      color: '#1ab579',
      distance: 75.20190832749851,
      velocity: 2215.8304466391514,
    },
    {
      name: 'Galaxy #2',
      id: 'ZTF19abxvjkn',
      color: '#eb7c39',
      distance: 126.06531683004127,
      velocity: 7447.495025058962,
    },
    {
      name: 'Galaxy #3',
      id: 'ZTF19abqqmui',
      color: '#4c8cd2',
      distance: null,
      velocity: null,
    },
    {
      name: 'Galaxy #4',
      id: 'ZTF19abvhduf',
      color: '#fed828',
      distance: null,
      velocity: null,
    },
  ],
  options: {
    showUserPlot: '252',
    preSelected: true,
  },
  trendlineInteractable: false,
  hubbleConstant: null,
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 0,
  xDomain: [0, 300],
  yDomain: [0, 18000],
  xValueAccessor: 'distance',
  yValueAccessor: 'velocity',
  xAxisLabel: 'Distance (Mpc)',
  yAxisLabel: 'Velocity (Km/s)',
  tooltipAccessors: ['name', 'distance', 'velocity'],
  tooltipLabels: ['Galaxy', 'Distance', 'Velocity'],
};

test('HubblePlot renders with required props', () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(<HubblePlot {...testProps} />);
  const hubblePlot = getByTestId(testId);
  const testPoint = hubblePlot.querySelector(pointSelector);

  // Assert
  expect(hubblePlot).toBeInTheDocument();
  expect(queryByTestId(tooltipTestId)).toBeNull();
  expect(testPoint).toHaveAttribute('r', pointRadius + '');
});

test('HubblePlot Point renders label with label prop', () => {
  // Arrange
  const testPropsWithLabel = {
    ...testProps,
    data: [
      {
        name: 'Galaxy #1',
        id: 'ZTF19abqmpsr',
        label: testPointLabel,
        color: '#1ab579',
        distance: 75.20190832749851,
        velocity: 2215.8304466391514,
      },
    ],
  };
  const { getByTestId, getByText, queryByTestId } = render(
    <HubblePlot {...testPropsWithLabel} />
  );
  const hubblePlot = getByTestId(testId);
  // Assert
  expect(getByText(testPointLabel));
});

test('HubblePlot Point grows when mouseOver', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <HubblePlot {...testProps} selectionCallback={testHandler} />
  );
  const hubblePlot = getByTestId(testId);
  const testPoint = hubblePlot.querySelector(pointSelector);
  // Act
  fireEvent.mouseOver(testPoint);
  // Assert
  await waitFor(() => {
    expect(getByTestId(tooltipTestId)).toBeVisible();
    expect(testPoint).toHaveAttribute('r', pointDiameter + '');
    expect(testHandler).not.toHaveBeenCalled();
  });
});

test('HubblePlot Point shrinks when mouseOut', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <HubblePlot {...testProps} selectionCallback={testHandler} />
  );
  const hubblePlot = getByTestId(testId);
  const testPoint = hubblePlot.querySelector(pointSelector);
  // Act
  fireEvent.mouseOut(testPoint);
  // Assert
  await waitFor(() => {
    expect(queryByTestId(tooltipTestId)).toBeNull();
    expect(testPoint).toHaveAttribute('r', pointRadius + '');
    expect(testHandler).not.toHaveBeenCalled();
  });
});

test('HubblePlot Point grows when clicked and selectionCallback is called', async () => {
  // Arrange
  const { getByTestId } = render(
    <HubblePlot {...testProps} selectionCallback={testHandler} />
  );
  const hubblePlot = getByTestId(testId);
  const testPoint = hubblePlot.querySelector(pointSelector);
  // Act
  fireEvent.click(testPoint);

  // Assert
  await waitFor(() => {
    expect(getByTestId(tooltipTestId)).toBeVisible();
    expect(testPoint).toHaveAttribute('r', pointDiameter + '');
    expect(testHandler).toHaveBeenCalled();
  });
});

// test('HubblePlot creates Point where clicked with createUserHubblePlot prop', async () => {
//   // Arrange
//   const testPropsWithUserCreate = {
//     ...testProps,
//     data: [
//       {
//         name: 'Galaxy #1',
//         id: 'ZTF19abqmpsr',
//         color: '#1ab579',
//         distance: null,
//         velocity: null,
//       },
//     ],
//     options: {
//       ...testProps.options,
//       createUserHubblePlot: false,
//     }
//   };
//   const { getByTestId } = render(<HubblePlot {...testPropsWithUserCreate} userHubbleCallback={testHandler} />);
//   const hubblePlot = getByTestId(testId);
//   // Act
//   // fireEvent.click(hubblePlot);
//   // Assert
//   await waitFor(() => {
//     const testPoint = hubblePlot.querySelector(pointSelector);
//     const bob = getByTestId(testId+'f');
//     // console.log()

//     expect(testPoint).toHaveAttribute('r', pointRadius + '');
//   });
//   expect(testHandler).toHaveBeenCalled();
// });
