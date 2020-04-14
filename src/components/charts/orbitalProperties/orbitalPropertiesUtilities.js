export const getMinorAxis = (a, e) => {
  return a * Math.sqrt(1 - e ** 2);
};

export const getMajorAxis = a => {
  return a;
};

export const getDiameter = (magnitude, albedo) => {
  return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
};
