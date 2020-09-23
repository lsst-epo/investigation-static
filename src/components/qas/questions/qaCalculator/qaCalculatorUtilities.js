import inRange from 'lodash/inRange';
import find from 'lodash/find';

const seismicDamages = [
  { id: '0', range: [0, 1], description: 'Not felt or noticed. No damage.' },
  {
    id: 'I',
    range: [1, 2],
    description: 'Usually not felt. No damage.',
  },
  {
    id: 'II',
    range: [2, 3],
    description:
      'Felt only by a few persons, especially on upper floors of buildings.',
  },
  {
    id: 'III',
    range: [3, 3.5],
    description:
      'Felt quite noticeably by persons indoors, especially on upper floors of buildings. Parked cars may rock slightly. Vibrations feel similar to the passing of a large truck.',
  },
  {
    id: 'IV',
    range: [3.5, 4.5],
    description:
      'Felt indoors by many, outdoors by few; Some are awakened if sleeping; Dishes, windows, doors disturbed; walls make cracking sounds. Feels like a heavy truck striking the building. Parked cars rock noticeably.',
  },
  {
    id: 'V',
    range: [4.5, 5],
    description:
      'Felt by nearly everyone.  Most are awakened if sleeping. Some dishes and  windows are broken. Unstable objects overturned.',
  },
  {
    id: 'VI',
    range: [5, 5.5],
    description:
      'Felt by all. Some heavy furniture moved; Some dishes and  windows are broken.  A few instances of fallen plaster. Parked cars rock noticeably.',
  },
  {
    id: 'VII',
    range: [5.5, 6.5],
    description:
      'Felt by all.  No damage in buildings of good design and construction; slight to moderate damage in well-built ordinary structures; considerable damage in poorly built or badly designed structures; some chimneys broken.',
  },
  {
    id: 'VIII',
    range: [6.5, 7.5],
    description:
      'Damage slight in specially designed structures; considerable damage or  partial collapse in ordinary buildings. Damage is great in poorly built structures. Chimneys, factory stacks, columns, monuments, and walls may fall. Heavy furniture overturned.',
  },
  {
    id: 'IX',
    range: [7.5, 8],
    description:
      'Damage considerable even in specially designed structures. Many buildings will partially collapse or be shifted off their foundations. Serious damage to dams. Underground pipes broken. Cracks open in the ground. In some areas, sand and mud may shoot into the air.',
  },
  {
    id: 'X',
    range: [8, 8.5],
    description:
      'Most buildings and bridges destroyed, with the exception of some well-built wooden structures and bridges. Serious damage to dams and embankments. Large landslides and mudflows. Some water is thrown out of canals, rivers, and lakes onto their banks. Train tracks are bent slightly.',
  },
  {
    id: 'XI',
    range: [8.5, 9],
    description:
      'Felt by almost everyone both indoors and outdoors. Most buildings and bridges are destroyed. Train tracks bent greatly. Underground pipelines are damaged so much they are unusable.',
  },
  {
    id: 'XII',
    range: [9, Infinity],
    description:
      'Damage nearly total. Felt by everyone both indoors and outdoors. Most buildings and bridges are destroyed. Large rocks and sections of land moved. Objects thrown into the air.',
  },
];

const airBlastDamages = [
  { range: [0, 6900], description: 'Not felt or noticed. No damage.' },
  {
    range: [6900, 22900],
    description: 'Glass windows will shatter.',
  },
  {
    range: [22900, 26800],
    description:
      'Interior walls of wood frame buildings will collapse. Roofs will be severely damaged. Glass windows will shatter.',
  },
  {
    range: [26800, 38500],
    description: 'Wood frame buildings will almost completely collapse.',
  },
  {
    range: [38500, 42600],
    description:
      'Small multistory buildings will experience severe cracking and interior walls will collapse. Wood frame buildings will collapse.',
  },
  {
    range: [42600, 100000],
    description: 'Small multistory and wood frame buildings will collapse.',
  },
  {
    range: [100000, 121000],
    description:
      'Ordinary highway bridges will have substantial damage. Small multistory and wood frame buildings will collapse.',
  },
  {
    range: [121000, 273000],
    description:
      'Ordinary highway bridges will collapse. Small multistory and wood frame buildings will collapse.',
  },
  {
    range: [273000, 297000],
    description:
      'Large multi-story steel frame buildings will have substantial damage and may collapse. All smaller buildings will collapse. Ordinary highway bridges will collapse.',
  },
  {
    range: [297000, 379000],
    description:
      'Cars and trucks will be overturned and moved and will require major repairs. Ordinary highway bridges will collapse.  Large multi-story steel frame buildings will have substantial damage and may collapse. All smaller buildings will collapse.',
  },
  {
    range: [379000, 426000],
    description:
      'Well-designed strong highway bridges will collapse. Cars and trucks will be overturned and moved and will require major repairs. Ordinary highway bridges will collapse.  Large multi-story steel frame buildings will have substantial damage and may collapse. All smaller buildings will collapse.',
  },
  {
    range: [426000, Infinity],
    description:
      'Cars and trucks will be moved and significantly deformed and will be unusable. Well-designed strong highway bridges will collapse. Large multi-story steel frame buildings will have substantial damage and may collapse. All smaller buildings will collapse',
  },
];

export const solveForDistanceModulus = m => {
  return m ? +m + 19.4 : null;
};

export const solveForParsecs = dm => {
  return dm ? 10 ** ((+dm + 5) / 5) : null;
};

export const solveForMegaParsecs = parsecs => {
  return parsecs ? +parsecs / 10 ** 6 : null;
};

export const solveForLightYears = parsecs => {
  return parsecs ? +parsecs * 3.26156 : null;
};

export const solveForMegaLightYears = lightYears => {
  return lightYears ? +lightYears / 999315.5373 : null;
};

export const getCalculatedMeasurementsForDistance = value => {
  const magnitude = value || null;
  const distanceModulus = solveForDistanceModulus(magnitude);
  const parsecs = solveForParsecs(distanceModulus);
  const megaParsecs = solveForMegaParsecs(parsecs);
  const lightYears = solveForLightYears(parsecs);
  const megaLightYears = solveForMegaLightYears(lightYears);

  return {
    magnitude,
    distanceModulus,
    parsecs,
    megaParsecs,
    lightYears,
    megaLightYears,
  };
};

export const calculateVolume = radius => {
  if (!radius) return null;

  return (4 / 3) * Math.PI * radius ** 3;
};

export const calculateMass = ({ density, diameter }) => {
  if (!density || !diameter) return null;
  return density * calculateVolume(diameter / 2);
};

export const calculateDiameter = ({ magnitude, albedo }) => {
  if (!albedo || !magnitude) return null;
  const diameter = (1329 / Math.sqrt(+albedo)) * 10 ** (-0.2 * +magnitude);

  // unit conversion from km to m
  return diameter * 1000;
};

export const calculateImpactEnergy = (diameter, velocity, density) => {
  if (!diameter || !velocity || !density) return null;

  return (Math.PI * +density * (+diameter / 2) ** 3 * (+velocity) ** 2) / 12;
};

export const calculateKineticEnergy = ({ mass, velocity }) => {
  if (!mass || !velocity) return null;

  return 0.5 * +mass * (+velocity) ** 2;
};

export const calculateRichterMagnitude = eImpact => {
  if (!eImpact) return null;
  if (+eImpact <= 0) return null;

  const richterMagnitude = 0.67 * Math.log10(+eImpact) - 5.87;

  return richterMagnitude >= 0 ? richterMagnitude : null;
};

export const calculateAirBlast = (observerDistance, eImpact) => {
  if (!observerDistance || !eImpact) return null;
  if (+observerDistance <= 0 || +eImpact <= 0) return null;

  const eImpactInKilotons = (+eImpact * 1) / (4.184 * 10 ** 12);
  const modifiedUserDistance = +observerDistance / eImpactInKilotons ** (1 / 3);
  const airBlastOverPressure =
    ((75000 * 290) / (4 * modifiedUserDistance)) *
    (1 + 3 * (290 / modifiedUserDistance) ** 1.3);

  return airBlastOverPressure;
};

export const getRichterMagnitudeAt = (richterMagnitude, observerDistance) => {
  if (!richterMagnitude || !observerDistance) return null;
  if (richterMagnitude < 0) return null;
  const re = 6371; // Earth's radius in km
  const obsDistKm = +observerDistance / 1000; // Observer distance from impact in km to make math work
  let rm = null;

  if (obsDistKm < 60) {
    rm = +richterMagnitude - 0.0238 * obsDistKm;
  } else if (obsDistKm >= 60 && obsDistKm < 700) {
    rm = +richterMagnitude - 0.0048 * obsDistKm - 1.1644;
  } else {
    rm = +richterMagnitude - 1.66 * Math.log10(obsDistKm / re) - 6.399;
  }

  return rm >= 0 ? rm : null;
};

export const calculateCraterDiameter = (
  asteroidDiameter,
  density,
  velocity
) => {
  if (!asteroidDiameter || !density || !velocity) return null;

  const Dtc =
    1.161 *
    (+density / 2500) ** (1 / 3) *
    (+asteroidDiameter) ** 0.78 *
    (+velocity) ** 0.44 *
    9.8 ** -0.22 *
    Math.sin(Math.PI / 4) ** (1 / 3);

  return Dtc;
};

export const calculateCraterDepth = craterDiameter => {
  if (!craterDiameter) return null;
  return +craterDiameter / (2 * Math.sqrt(2));
};

export const getDamageDescription = (damageVal, damageDescriptions) => {
  if (!damageVal) return null;

  return find(damageDescriptions, description => {
    const [min, max] = description.range;
    return inRange(+damageVal, min, max);
  });
};

export const calculateAsteroidImpact = props => {
  const { asteroidDiameter, density, velocity } = props;
  if (!asteroidDiameter || !density || !velocity) {
    return {
      ...props,
      kineticEnergy: null,
      craterDiameter: null,
      craterDepth: null,
    };
  }

  const kineticEnergy = calculateImpactEnergy(
    asteroidDiameter,
    density,
    velocity
  );
  const craterDiameter = calculateCraterDiameter(
    asteroidDiameter,
    density,
    velocity
  );
  const craterDepth = calculateCraterDepth(craterDiameter);

  return {
    ...props,
    kineticEnergy,
    craterDiameter,
    craterDepth,
  };
};

export const calculateAsteroidImpactDamage = props => {
  const { kineticEnergy, observerDistance } = props;
  if (!kineticEnergy || !observerDistance) {
    return {
      ...props,
      richterMagnitude: null,
      richterMagnitudeAtObserverDistance: null,
      mercalliIntensity: null,
      overPressure: null,
      airBlastDamage: null,
    };
  }
  const richterMagnitude = calculateRichterMagnitude(+kineticEnergy);
  const richterMagnitudeAtObserverDistance = getRichterMagnitudeAt(
    richterMagnitude,
    observerDistance
  );
  const mercalliIntensity = getDamageDescription(
    richterMagnitudeAtObserverDistance,
    seismicDamages
  );
  const overPressure = calculateAirBlast(observerDistance, +kineticEnergy);
  const airBlastDamage = getDamageDescription(overPressure, airBlastDamages);

  return {
    ...props,
    richterMagnitude,
    richterMagnitudeAtObserverDistance: airBlastDamage
      ? richterMagnitudeAtObserverDistance
      : null,
    mercalliIntensity: airBlastDamage ? mercalliIntensity : null,
    overPressure: mercalliIntensity ? overPressure : null,
    airBlastDamage: mercalliIntensity ? airBlastDamage : null,
  };
};
