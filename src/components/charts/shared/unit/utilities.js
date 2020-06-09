export const units = {
  hubbleConstant: ' km/s/Mpc',
  temperature: ' K',
  luminosity: ' L',
  mass: ' M',
  lifetime: ' Gyr',
  radius: ' R',
  count: ' stars',
  distance: ' MPc',
  velocity: ' km/s',
  inclination: '°',
  semimajor_axis: ' AU',
  size: ' km',
  kineticEnergy: ' J',
  volume: ' m^3',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
