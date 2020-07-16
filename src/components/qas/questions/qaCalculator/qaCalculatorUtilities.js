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
  if (albedo === null || magnitude === null) return null;
  const answer = (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
  return formatValue(answer, 3);
};

export const calculateVolume = ({ radius }) => (4 / 3) * Math.PI * radius ** 3;

export const calculateKineticEnergy = ({ mass, velocity }) =>
  0.5 * mass * velocity ** 2;

export const calculateMass = ({ density, volume }) => density * volume;

export const calculateCraterDiameter = ({
  asteroidDiameter,
  density,
  velocity,
}) => {
  const Dtc =
    1.161 *
    (density / 2500) ** (1 / 3) *
    (asteroidDiameter * 1000) ** 0.78 *
    (velocity * 1000) ** 0.44 *
    9.8 ** -0.22 *
    Math.sin(Math.PI / 4) ** (1 / 3);

  return Dtc ? Dtc * 0.001 : null;
};
