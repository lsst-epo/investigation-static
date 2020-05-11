export const units = {
  hubbleConstant: ' Km/s/Mpc',
  temperature: ' K',
  luminosity: ' L',
  mass: ' M',
  lifetime: ' Gyr',
  radius: ' R',
  count: ' stars',
  distance: ' MPc',
  velocity: ' Km/s',
  inclination: '°',
  semimajor_axis: ' AU',
  kineticEnergy: ' J',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
