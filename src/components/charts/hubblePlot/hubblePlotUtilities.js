import isEmpty from 'lodash/isEmpty';

export const emptyUserData = data => {
  if (!data) return data;

  return data.map(galaxy => {
    return { ...galaxy, distance: null, velocity: null };
  });
};

export const getHubblePlotData = (data, options, answers) => {
  const { multiple, showUserHubblePlot, createUserHubblePlot, preSelected } =
    options || {};
  const userHubblePlotAnswer = answers[createUserHubblePlot];
  const showUserHubblePlotAnswer = answers[showUserHubblePlot];

  if (!isEmpty(showUserHubblePlotAnswer)) {
    const { data: answerData } = showUserHubblePlotAnswer;

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
