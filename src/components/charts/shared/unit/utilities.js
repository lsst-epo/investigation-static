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
  velocity: ' km/s',
  inclination: '°',
  semimajor_axis: ' AU',
  diameter: ' km',
  craterDiameter: ' km',
  kineticEnergy: ' J',
  volume: ' m^3',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
