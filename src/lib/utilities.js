import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import { extent as d3Extent, mean as d3Mean } from 'd3-array';

export const randomIntFromInterval = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const dashSepToCamelCase = function(input) {
  return input
    .toLowerCase()
    .replace(/-(.)/g, function dashCharToCap(match, group1) {
      return group1.toUpperCase();
    });
};

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

export const checkIds = function(ids, id) {
  let present = false;
  let i = 0;

  while (i < ids.length) {
    if (id === ids[i]) {
      present = true;
    }

    i += 1;
  }

  return present;
};

export const renderDef = function(def) {
  return { __html: def };
};

export const mjdToUTC = function(mjd, format) {
  const millis = mjd * 86400000 - 3506716800000;
  const gd = new Date(millis);
  const month = gd.getUTCMonth();
  const day = gd.getUTCDate();
  const hours = gd.getUTCHours().toString();
  const minutes = gd.getUTCMinutes().toString();
  const abvYear = gd
    .getUTCFullYear()
    .toString()
    .slice(-2);
  const time = `${hours.length < 2 ? 0 + hours : hours}:${
    minutes.length < 2 ? 0 + minutes : minutes
  }`;
  const date = `${month}/${day}/${abvYear}`;
  return {
    MDY: `${date}`,
    MDYT: `${date} ${time} (UTC)`,
  }[format || 'MDY'];
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

export const addTheCommas = function(num) {
  const arrNum = (+num).toString().split('.');
  const withCommas = arrNum[0].split(/(?=(?:\d{3})+(?:\.|$))/g).join(',');
  const finalNumber = arrNum[1]
    ? [withCommas, arrNum[1]].join('.')
    : withCommas;
  return finalNumber;
};

export const solveForDistanceModulus = m => {
  if (m !== 'm') {
    const dm = m + 19.4;
    return formatValue(dm, 2);
  }
  return 'DM';
};

export const solveForParsecs = dm => {
  if (dm !== '?') {
    const pars = 10 ** ((dm + 5) / 5);
    return formatValue(pars, 2);
  }
  return '?';
};

export const solveForMegaParsecs = parsecs => {
  if (parsecs !== '?') {
    const megaPars = parsecs / 10 ** 6;
    return formatValue(megaPars, 2);
  }
  return '?';
};

export const solveForLightYears = parsecs => {
  if (parsecs !== '?') {
    const ly = parsecs * 3.26156;
    return formatValue(ly, 2);
  }
  return '?';
};

export const solveForMegaLightYears = lightYears => {
  if (lightYears !== '?') {
    const mly = lightYears / 999315.5373;
    return formatValue(mly, 2);
  }
  return '?';
};

export const getParsecsFromDistance = data => {
  const DM = solveForDistanceModulus(+data);
  return solveForParsecs(+DM);
};

export const getMegaParsecsFromDistance = data => {
  const parsecs = getParsecsFromDistance(data);
  return solveForMegaParsecs(parsecs);
};

export const getLightYearsFromDistance = data => {
  const parsecs = getParsecsFromDistance(data);
  return solveForLightYears(+parsecs);
};

function round(precision, number) {
  return parseFloat(number.toPrecision(precision));
}

function getSigFigPadding(isInt, precision, numFloorDigits, numDigits) {
  return isInt ? precision - numFloorDigits : precision - numDigits + 1;
}

export const toSigFigs = (number, precision) => {
  if (!isNumber(number)) return '';
  if (number === 0) return '0';

  const roundedValue = round(precision, number);
  const floorValue = Math.floor(roundedValue);

  const isInt = Math.abs(floorValue - roundedValue) < Number.EPSILON;
  const numFloorDigits = String(floorValue).length;
  const numDigits = String(roundedValue).length;

  if (numFloorDigits > precision) {
    return String(floorValue);
  }

  const padding = getSigFigPadding(isInt, precision, numFloorDigits, numDigits);

  if (padding > 0 && isInt) {
    return `${String(floorValue)}.${'0'.repeat(padding)}`;
  }

  if (padding > 0) {
    return `${String(roundedValue)}${'0'.repeat(padding)}`;
  }

  return String(roundedValue);
};

export const getMegaLightYearsFromDistance = data => {
  const lightYears = getLightYearsFromDistance(+data);
  const megaLightYears = solveForMegaLightYears(+lightYears);
  return toSigFigs(megaLightYears, 3);
};

export const getValue = function(accessor, data) {
  return (
    {
      hubbleConstant: formatValue(data, 1),
      distance: formatValue(data, 0),
      velocity: formatValue(data, 0),
      magnitude: formatValue(data, 2),
      luminosity: formatValue(data, 2),
      radius: formatValue(data, 2),
      mass: formatValue(data, 2),
      lifetime: formatValue(data / 1000000000, 2),
      temperature: formatValue(data, 0),
      brightness: formatValue(data, 2),
      date: mjdToUTC(data, 'MDYT'),
      parsecs: getParsecsFromDistance(data),
      megaParsecs: getMegaParsecsFromDistance(data),
      lightYears: getLightYearsFromDistance(data),
      megaLightYears: getMegaLightYearsFromDistance(data),
      color: formatValue(data, 2),
      inclination: formatValue(data, 0),
      eccentricity: formatValue(data, 2),
      semimajor_axis: formatValue(data, 2),
      count: formatValue(data ? data.length : 0, 0),
    }[accessor] || data
  );
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
  return (
    {
      luminosity: `L${getSymbol(accessor)}`,
      radius: `R${getSymbol(accessor)}`,
      mass: `M${getSymbol(accessor)}`,
      lifetime: 'Gyr',
      temperature: 'K',
    }[accessor] || ''
  );
};

export const getElDims = function($el) {
  if ($el && $el.getBBox) {
    const { width, height } = $el.getBBox();
    return { width, height };
  }

  return { width: 0, height: 0 };
};
