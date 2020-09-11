export const units = {
  hubbleConstant: ' km/s/Mpc',
  temperature: ' K',
  luminosity: ' L',
  stellarMass: ' M',
  mass: ' kg',
  lifetime: ' Gyr',
  radius: ' R',
  count: ' stars',
  distance: ' MPc',
  velocity: ' m/s',
  inclination: '°',
  semimajor_axis: ' AU',
  diameter: ' m',
  craterDiameter: ' m',
  craterDepth: ' m',
  kineticEnergy: ' J',
  volume: ' m^3',
  density: ' kg/m^3',
  overPressure: ' Pa',
  observerDistance: ' m',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
