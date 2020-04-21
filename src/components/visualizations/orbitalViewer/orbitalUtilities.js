// import * as THREE from 'three';

const G = 6.67384e-11;
// const MIN_GHOST_DISTANCE = 100;
// const MAX_TRAIL_VERTICES = 400;
// const MAX_GHOST_OPACITY = 0.15;
// const GHOST_DISTANCE_SCALE = 80;

export const METERS_PER_UNIT = 100;
// export const METERS_PER_UNIT = 1000000000;
export const STEPS_PER_FRAME = 2;
// export const STEPS_PER_FRAME = 5000;
export const SEC_PER_STEP = 8;
export const FPS = 1 / 30;

export const getDistance = (v1, v2) => {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;
  const z = v1.z - v2.z;
  return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const getAcceleration = (distance, starMass) => {
  return (G * starMass) / distance ** 2;
};

export const getMinorAxis = (a, e) => {
  return a * Math.sqrt(1 - e ** 2) * METERS_PER_UNIT;
};

export const getMajorAxis = a => {
  return a * METERS_PER_UNIT;
};

export const getRotation = i => {
  return i * (Math.PI / 180);
};

export const getVelocity = (radius, maj) => {
  const GM = 0.000296005155;
  return Math.sqrt(GM * (2 / radius - 1 / maj));
};

export const getDiameter = (magnitude, albedo) => {
  return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
};

export const getRadius = magnitude => {
  const realRadius = getDiameter(magnitude, 0.15);
  const adjustedRadius = 0.002 * realRadius * METERS_PER_UNIT;
  const [minSize, maxSize] = [2, 7];

  if (adjustedRadius < minSize) {
    return minSize;
  }

  if (adjustedRadius > maxSize) {
    return maxSize;
  }

  return adjustedRadius;
};
