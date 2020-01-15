import isEmpty from 'lodash/isEmpty';

export const emptyUserData = data => {
  if (!data) return data;

  return data.map(galaxy => {
    return { ...galaxy, distance: null, velocity: null };
  });
};

export const getHubblePlotData = (data, options, answers) => {
  const { userHubblePlot } = options;
  const userHubblePlotAnswer = answers[userHubblePlot];

  if (!isEmpty(userHubblePlotAnswer)) {
    return userHubblePlotAnswer.data;
  }

  if (userHubblePlot) {
    return emptyUserData(data);
  }

  return data;
};
