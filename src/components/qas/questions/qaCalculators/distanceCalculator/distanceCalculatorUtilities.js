import { formatValue } from '../../../../../lib/utilities.js';

export const solveForDistanceModulus = m => {
  return m ? formatValue(m + 19.4, 2) : null;
};

export const solveForParsecs = dm => {
  return dm ? formatValue(10 ** ((dm + 5) / 5), 2) : null;
};

export const solveForMegaParsecs = parsecs => {
  return parsecs ? formatValue(parsecs / 10 ** 6, 2) : null;
};

export const solveForLightYears = parsecs => {
  return parsecs ? formatValue(parsecs * 3.26156, 2) : null;
};

export const solveForMegaLightYears = lightYears => {
  return lightYears ? formatValue(lightYears / 999315.5373, 2) : null;
};
