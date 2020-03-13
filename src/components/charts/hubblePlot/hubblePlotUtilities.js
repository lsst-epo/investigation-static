import isEmpty from 'lodash/isEmpty';

export const emptyUserData = data => {
  if (!data) return data;

  return data.map(galaxy => {
    return { ...galaxy, distance: null, velocity: null };
  });
};

export const getHubblePlotData = (data, options, answers) => {
  const { multiple, showUserPlot, createUserHubblePlot, preSelected } =
    options || {};
  const userHubblePlotAnswer = answers[createUserHubblePlot];
  const userPlotAnswer = answers[showUserPlot];

  if (!isEmpty(userPlotAnswer)) {
    const { data: answerData } = userPlotAnswer;

    return multiple ? [data, answerData] : [...data, ...answerData];
  }

  if (!isEmpty(userHubblePlotAnswer)) {
    return userHubblePlotAnswer.data;
  }

  if (createUserHubblePlot && data && !preSelected) {
    return emptyUserData(data);
  }

  if (multiple) {
    return [data];
  }

  return data;
};
