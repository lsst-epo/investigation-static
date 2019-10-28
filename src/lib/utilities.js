import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import { extent as d3Extent, mean as d3Mean } from 'd3-array';

export const getAnswerData = function(answers, id) {
  const answer = answers[id];
  return !isEmpty(answer) ? answer.data : null;
};

export const getCompoundQs = function(questions, i) {
  const question = questions[i];
  const { ids } = question;
  const qs = [question];
  let nextCompoundIndex = i + 1;
  let isCompound = true;

  while (isCompound) {
    const nextQ = questions[nextCompoundIndex];

    if (nextQ.type === 'compound-select' && includes(ids, nextQ.id)) {
      qs.push(nextQ);
      nextCompoundIndex += 1;
    } else {
      isCompound = false;
    }
  }

  return qs;
};

export const renderDef = function(def) {
  return { __html: def };
};

export const formatValue = function(number, decimalPlaces) {
  return Number.parseFloat(Number.parseFloat(number).toFixed(decimalPlaces));
};

export const arrayify = function(data) {
  return data === null ? null : [].concat(data);
};

export const extentFromSet = function(data, accessor) {
  return d3Extent(data, datum => {
    return datum[accessor];
  });
};

export const getMean = function(data, accessor) {
  return d3Mean(data, d => d[accessor]);
};

export const capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getSunValue = function(accessor) {
  const data = {
    lifetime: 10000000000,
    luminosity: 1,
    mass: 1,
    radius: 1,
    source_id: 'Sun',
    temperature: 5778,
  };

  if (accessor) {
    return data[accessor];
  }

  return data;
};

export const getSunAnswer = function(accessor) {
  const data = getSunValue();

  if (accessor) {
    return { content: data[accessor], data };
  }

  return { content: data, data };
};

export const getValue = function(accessor, data) {
  if (accessor === 'luminosity') {
    return formatValue(data, 2);
  }

  if (accessor === 'radius') {
    return formatValue(data, 2);
  }

  if (accessor === 'mass') {
    return formatValue(data, 2);
  }

  if (accessor === 'lifetime') {
    return formatValue(data / 1000000000, 2);
  }

  if (accessor === 'temperature') {
    return formatValue(data, 0);
  }

  return data;
};

export const getSymbol = function(accessor) {
  if (
    accessor === 'radius' ||
    accessor === 'mass' ||
    accessor === 'luminosity'
  ) {
    return `&#8857`;
  }

  return '';
};

export const getUnit = function(accessor) {
  if (accessor === 'luminosity') {
    return `L${getSymbol(accessor)}`;
  }

  if (accessor === 'radius') {
    return `R${getSymbol(accessor)}`;
  }

  if (accessor === 'mass') {
    return `M${getSymbol(accessor)}`;
  }

  if (accessor === 'lifetime') {
    return 'Gyr';
  }

  if (accessor === 'temperature') {
    return 'K';
  }

  return '';
};
