import { formatValue } from '../../../../lib/utilities.js';

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

export const getCalculatedMeasurementsForDistance = value => {
  const magnitude = value || null;
  const distanceModulus = solveForDistanceModulus(magnitude);
  const parsecs = solveForParsecs(distanceModulus);
  const megaParsecs = solveForMegaParsecs(parsecs);
  const lightYears = solveForLightYears(parsecs);
  const megaLightYears = solveForMegaLightYears(lightYears);

  return {
    magnitude,
    distanceModulus,
    parsecs,
    megaParsecs,
    lightYears,
    megaLightYears,
  };
};

export const calculateDiameter = ({ magnitude, albedo }) => {
  if (!magnitude || !albedo) return null;

  return formatValue((1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude), 3);
};

export const calculateVolume = ({ radius }) => {
  if (!radius) return null;

  return (4 / 3) * Math.PI * radius ** 3;
};

export const calculateKineticEnergy = ({ mass, velocity }) => {
  if (!mass || !velocity) return null;

  return 0.5 * mass * velocity ** 2;
};

export const calculateMass = ({ density, volume }) => {
  if (!density || !volume) return null;

  return density * volume;
};
