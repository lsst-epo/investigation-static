import * as THREE from 'three';

export const AU_TO_VIZ_SCALER = 100;
export const DAY_PER_VIZ_SEC = 1;

const earth = {
  a: 1,
  e: 0.01671022,
  i: 0,
  H: -3.9,
  Ref: 'Earth',
  Principal_desig: 'Earth',
  orbitColor: '#83e570',
  objectColor: '#777839',
  objectRadius: 15,
};

const jupiter = {
  a: 5.2028,
  e: 0.048,
  i: 1.31,
  H: -25.9,
  Ref: 'Jupiter',
  Principal_desig: 'Jupiter',
  orbitColor: '#FFB000',
  objectColor: '#FE6100',
  objectRadius: 15,
};

const neptune = {
  a: 30.06896348,
  e: 0.00858587,
  i: 1.76917,
  H: -25.9,
  Ref: 'Neptune',
  Principal_desig: 'Neptune',
  orbitColor: '#648FFF',
  objectColor: '#785EF0',
  objectRadius: 15,
};

export const getRefObjProps = id => {
  return (
    {
      neptune,
      earth,
      jupiter,
    }[id] || null
  );
};

// args must be in VIZ_UNITS
export const getCurve = (xRadius, yRadius, aX = 0, aY = 0) => {
  return new THREE.EllipseCurve(
    aX, // aX
    aY, // aY
    xRadius, // xRadius
    yRadius, // yRadius
    0, // aStartAngle
    2 * Math.PI, // aEndAngle
    false, // aClockwise
    0 // aRotation
  );
};

export const getLineGeometry = points => {
  return new THREE.BufferGeometry().setFromPoints(points);
};

// pos and sunPos must be Vector3
export const getAngleFromPos = (pos, sunPos) => {
  // x=c; y=a; z=b
  const z = pos.distanceTo(sunPos);
  const { x, y } = pos;
  const rads = Math.acos((z ** 2 + x ** 2 - y ** 2) / (2 * z * x));
  return (rads * 180) / Math.PI;
};

// path must be EllipseCurve
export const getPosFromArcLength = (arcLength, path) => {
  const { x, y } = path.getPoint(arcLength);
  return new THREE.Vector3(x, y, 0);
};

// args must be in AU
export const auToUnit = value => {
  return value * AU_TO_VIZ_SCALER;
};
// args must be in VIZ_UNITS
export const unitToAu = value => {
  return value / AU_TO_VIZ_SCALER;
};
// a must be in AU
export const getMinorAxis = (a, e) => {
  return auToUnit(a * Math.sqrt(1 - e ** 2));
};

export const auToMeters = value => {
  return 149600000000 * value;
};

export const degsToRads = i => {
  return i * (Math.PI / 180);
};

export const radsToDegs = i => {
  return i * (180 / Math.PI);
};
// args must be in VIZ_UNITS
export const getVelocity = (radius, maj) => {
  const GM = 0.000296005155 * AU_TO_VIZ_SCALER ** 3; // Converted from AU3/day2 to UNIT3/day2
  return Math.sqrt(GM * (2 / radius - 1 / maj));
};
// args must be in VIZ_UNITS
export const getFocus = (majAxis, minAxis) => {
  return Math.sqrt(majAxis ** 2 - minAxis ** 2);
};

export const getDiameter = (magnitude, albedo) => {
  return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * magnitude);
};

export const getRadius = magnitude => {
  const realRadius = getDiameter(magnitude, 0.15);
  const adjustedRadius = 0.002 * realRadius * AU_TO_VIZ_SCALER; // Wrong!!!!!!
  const [minSize, maxSize] = [2, 7];

  if (adjustedRadius < minSize) {
    return minSize;
  }

  if (adjustedRadius > maxSize) {
    return maxSize;
  }

  return adjustedRadius;
};

export const convert2dTo3d = (vector2D, orbitData) => {
  const { i, Peri: peri, Node: ascendingNode } = orbitData;
  const yAxisOfRotation = new THREE.Vector3(0, 1, 0);
  const zAxisOfRotation = new THREE.Vector3(0, 0, 1);

  return new THREE.Vector3(vector2D.x, vector2D.y, 0)
    .applyAxisAngle(zAxisOfRotation, peri ? degsToRads(peri + 90) : 0)
    .applyAxisAngle(yAxisOfRotation, degsToRads(i))
    .applyAxisAngle(
      zAxisOfRotation,
      ascendingNode ? degsToRads(ascendingNode) : 0
    );
};
