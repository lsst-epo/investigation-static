export const AU_PER_VIZ_UNIT = 100;
export const DAY_PER_VIZ_SEC = 1;

export const auToUnit = value => {
  return value * AU_PER_VIZ_UNIT;
};

export const unitToAU = value => {
  return value / AU_PER_VIZ_UNIT;
};

export const getDistance = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  const z = v1.z - v2.z;
  return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const getMinorAxis = (a, e) => {
  return auToUnit(a * Math.sqrt(1 - e ** 2));
};

export const getRotation = i => {
  return i * (Math.PI / 180);
};

export const getVelocity = (radius, maj) => {
  const GM = auToUnit(0.000296005155); // Converted from AU3/day2 to UNIT3/day2
  return Math.sqrt(GM * (2 / radius - 1 / maj));
};

export const getDiameter = (magnitude, albedo) => {
  return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
};

export const getRadius = magnitude => {
  const realRadius = getDiameter(magnitude, 0.15);
  const adjustedRadius = 0.002 * realRadius * AU_PER_VIZ_UNIT;
  const [minSize, maxSize] = [2, 7];

  if (adjustedRadius < minSize) {
    return minSize;
  }

  if (adjustedRadius > maxSize) {
    return maxSize;
  }

  return adjustedRadius;
};
