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
  destruction: ' km',
  velocity: ' km/s',
  inclination: '°',
  semimajor_axis: ' AU',
  diameter: ' km',
  craterDiameter: ' km',
  craterDepth: ' km',
  kineticEnergy: ' J',
  volume: ' m^3',
  density: ' kg/m^3',
  overPressure: ' Pa',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
