import isEmpty from 'lodash/isEmpty';

export const emptyUserData = data => {
  if (!data) return data;

  return data.map(galaxy => {
    return { ...galaxy, distance: null, velocity: null };
  });
};

export const getHubblePlotData = (data, options, answers) => {
  const { userHubblePlot } = options || {};
  const userHubblePlotAnswer = answers[userHubblePlot];
  // console.log(data, options, answers);

  if (!isEmpty(userHubblePlotAnswer) && data) {
    // console.log('answer', userHubblePlotAnswer.data, data);
    return [...data, ...userHubblePlotAnswer.data];
  }

  if (!isEmpty(userHubblePlotAnswer)) {
    // console.log('no answer', userHubblePlotAnswer.data, data);
    return userHubblePlotAnswer.data;
  }

  if (userHubblePlot && data) {
    return emptyUserData(data);
  }

  return data;
};
