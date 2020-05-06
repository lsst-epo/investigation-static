export const AU_TO_VIZ_SCALER = 100;
export const DAY_PER_VIZ_SEC = 1;

export const earth = {
  a: 1,
  e: 0.01671022,
  i: 0,
  H: -3.9,
  Ref: 'Earth',
  Principal_desig: 'Earth',
  orbitColor: '#83e570',
  objectColor: '#777839',
  objectRadius: 10,
};

export const jupiter = {
  a: 5.2028,
  e: 0.048,
  i: 1.31,
  H: -25.9,
  Ref: 'Jupiter',
  Principal_desig: 'Jupiter',
  orbitColor: '#f78988',
  objectColor: '#f78456',
  objectRadius: 50,
};

export const neptune = {
  a: 30.06896348,
  e: 0.00858587,
  i: 1.76917,
  H: -25.9,
  Ref: 'Neptune',
  Principal_desig: 'Neptune',
  orbitColor: '#6789f7',
  objectColor: '#6569f7',
  objectRadius: 25,
};

export const auToUnit = value => {
  return value * AU_TO_VIZ_SCALER;
};

export const unitToAU = value => {
  return value / AU_TO_VIZ_SCALER;
};

export const getMinorAxis = (a, e) => {
  return auToUnit(a * Math.sqrt(1 - e ** 2));
};

export const radsToDegs = i => {
  return i * (180 / Math.PI);
};

export const degsToRads = i => {
  return i * (Math.PI / 180);
};

export const getVelocity = (radius, maj) => {
  const GM = 0.000296005155 * 1000000; // Converted from AU3/day2 to UNIT3/day2
  return Math.sqrt(GM * (2 / radius - 1 / maj));
};

export const getFocus = (majAxis, minAxis, peri) => {
  const focus = majAxis ** 2 - minAxis ** 2;
  return peri > 90 && peri <= 270 ? focus * -1 : focus * 1;
};

export const getDiameter = (magnitude, albedo) => {
  return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
};

export const getRadius = magnitude => {
  const realRadius = getDiameter(magnitude, 0.15);
  const adjustedRadius = 0.002 * realRadius * AU_TO_VIZ_SCALER; // Wrong?!!?
  const [minSize, maxSize] = [2, 7];

  if (adjustedRadius < minSize) {
    return minSize;
  }

  if (adjustedRadius > maxSize) {
    return maxSize;
  }

  return adjustedRadius;
};
