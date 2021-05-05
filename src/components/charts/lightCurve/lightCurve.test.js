import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LightCurve from './index.jsx';
import Point from './Point.jsx';

const testId = 'light-curve';
const svgTestId = 'light-curve-svg';
const tooltipTestId = 'tooltip';
const pointsWrapper = 'light-curve-points-wrapper';
const pointSelector = '.data-point';
const pointRadius = 3;
const testHandler = jest.fn();
const testAlerts = [
  {
    alert_id: 149216727,
    error: 0.05,
    date: 58719.46459,
    magnitude: 17.58,
    image_id: 149331854,
  },
  {
    alert_id: 159607160,
    error: 0.04,
    date: 58722.4869,
    magnitude: 17.35,
    image_id: 159442774,
  },
  {
    alert_id: 166456030,
    error: 0.03,
    date: 58725.49949,
    magnitude: 17.24,
    image_id: 162160454,
  },
];

const testTemplates = {
  Ia: [
    {
      id: '5549abe9-d543-52a7-b22d-d7129b47fbb5',
      x: -19,
      y: 7.611,
    },
    {
      id: 'fa370f9e-a984-58dd-b8dc-bbb2eb8260eb',
      x: -18,
      y: 5.139,
    },
  ],
  Iav: [
    {
      id: '1028221c-8dd5-5963-ab79-abd9e0a2c963',
      x: -19,
      y: 7.68,
    },
    {
      id: '19cb2590-e63e-5ba1-b6d0-528588d4fa93',
      x: -18,
      y: 5.208,
    },
  ],
  IIp: [
    {
      id: 'fb8de8aa-1110-5c49-a37e-d954c0e10f57',
      x: -11,
      y: 26,
    },
    {
      id: '40a8d06c-a260-5825-a17a-931f004c2a6a',
      x: -10,
      y: 6,
    },
  ],
};

const testProps = {
  xDomain: [58690, 58780],
  yDomain: [24, 14],
  pointColor: '#1ab579',
  activeAlertId: '149216727',
  xValueAccessor: 'date',
  yValueAccessor: 'magnitude',
  xAxisLabel: 'Days',
  yAxisLabel: 'Apparent Magnitude (m)',
  tooltipAccessors: ['date', 'magnitude'],
  tooltipLabels: ['Time', 'Apparent Magnitude (m)'],
};

test('LightCurve renders with required props', () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <LightCurve data={testAlerts} />
  );
  const lightCurve = getByTestId(testId);

  // Assert
  expect(lightCurve).toBeInTheDocument();
});

test('LightCurve points are hidden if pointsAreVisible prop is false', () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <LightCurve data={testAlerts} pointsAreVisible={false} />
  );
  const lightCurve = getByTestId(testId);
  const testPoint = lightCurve.querySelector(pointSelector);
  // Assert
  expect(lightCurve).toBeInTheDocument();
  expect(testPoint).not.toBeVisible();
});

test('LightCurve Point gets circled when mouseOver', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <LightCurve data={testAlerts} dataSelectionCallback={testHandler} />
  );
  const lightCurve = getByTestId(testId);
  const testPoint = lightCurve.querySelector(pointSelector);
  // Act
  fireEvent.mouseOver(testPoint);
  // Assert
  await waitFor(() => {
    expect(getByTestId(tooltipTestId)).toBeVisible();
    expect(testPoint).not.toHaveAttribute('stroke', 'transparent');
    expect(testHandler).not.toHaveBeenCalled();
  });
});

test('LightCurve Point is uncircled when mouseOut', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <LightCurve data={testAlerts} dataSelectionCallback={testHandler} />
  );
  const lightCurve = getByTestId(testId);
  const testPoint = lightCurve.querySelector(pointSelector);
  // Act
  fireEvent.mouseOut(testPoint);
  // Assert
  await waitFor(() => {
    expect(queryByTestId(tooltipTestId)).toBeNull();
    expect(testPoint).toHaveAttribute('stroke', 'transparent');
    expect(testHandler).not.toHaveBeenCalled();
  });
});

test('HubblePlot Point grows when clicked and selectionCallback is called', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <LightCurve
      data={testAlerts}
      dataSelectionCallback={testHandler}
      {...testProps}
    />
  );
  const lightCurve = getByTestId(testId);
  const testPoint = lightCurve.querySelector(pointSelector);
  // Act
  fireEvent.click(testPoint);

  // Assert
  await waitFor(() => {
    expect(getByTestId(tooltipTestId)).toBeVisible();
    expect(testPoint).not.toHaveAttribute('stroke', 'transparent');
    expect(testHandler).toHaveBeenCalled();
  });
});
