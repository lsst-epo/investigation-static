import { formatValue } from '../../../../../lib/utilities.js';

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
