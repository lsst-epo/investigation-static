export const units = {
  temperature: 'K',
  luminosity: 'L',
  mass: 'M',
  lifetime: 'Gyr',
  radius: 'R',
  count: 'stars',
};

export const renderUnit = function(type) {
  return units[type] || null;
};
