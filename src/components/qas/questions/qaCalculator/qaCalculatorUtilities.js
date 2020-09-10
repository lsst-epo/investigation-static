import inRange from 'lodash/inRange';
import find from 'lodash/find';
import { formatValue } from '../../../../lib/utilities.js';

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

export const calculateDiameter = ({ magnitude, albedo }) => {
  if (!albedo || !magnitude) return null;
  const answer = (1329 / Math.sqrt(+albedo)) * 10 ** (-0.2 * +magnitude);
  return formatValue(answer, 3);
};

export const calculateVolume = ({ radius }) => {
  if (!radius) return null;
  return (4 / 3) * Math.PI * (+radius) ** 3;
};

export const calculateKineticEnergy = ({ mass, velocity }) => {
  if (!mass || !velocity) return null;
  return (0.5 * +mass * (+velocity) ** 2).toString(10);
};

export const calculateMass = ({ density, volume }) => {
  if (!density || !volume) return null;
  return +density * +volume;
};

export const calculateSeismicDamage = (asteroidDiameter, density, velocity) => {
  if (!asteroidDiameter || !density || !velocity) return null;

  return (
    (Math.PI *
      +density *
      (+asteroidDiameter * 1000) ** 3 *
      (+velocity * 1000) ** 2) /
    12
  );
};

export const calculateRichterMagnitude = eImpact => {
  if (!eImpact) return null;
  if (+eImpact <= 0) return null;

  const richterMagnitude = 0.67 * Math.log10(+eImpact) - 5.87;
  return richterMagnitude;
};

export const calculateAirBlast = (observerDistance, eImpact) => {
  if (!observerDistance || !eImpact) return null;
  if (+observerDistance <= 0 || +eImpact <= 0) return null;

  const observerDistanceInMeters = +observerDistance * 1000;
  const eImpactInKilotons = (+eImpact * 1) / (4.184 * 10 ** 12);
  const modifiedUserDistance =
    observerDistanceInMeters / eImpactInKilotons ** (1 / 3);
  const airBlastOverPressure =
    ((75000 * 290) / (4 * modifiedUserDistance)) *
    (1 + 3 * (290 / modifiedUserDistance) ** 1.3);

  return airBlastOverPressure;
};

export const getRichterMagnitudeAt = (
  richterMagnitude,
  { observerDistance }
) => {
  if (!richterMagnitude || !observerDistance) return null;
  const re = 6371; // Earth's radius in km
  let rm = null;

  if (+observerDistance < 60) {
    rm = formatValue(+richterMagnitude - 0.0238 * +observerDistance, 1);
  } else if (observerDistance >= 60 && observerDistance < 700) {
    rm = formatValue(
      +richterMagnitude - 0.0048 * +observerDistance - 1.1644,
      1
    );
  } else {
    rm = formatValue(
      +richterMagnitude - 1.66 * Math.log10(+observerDistance / re) - 6.399,
      1
    );
  }

  return rm >= 0 ? rm : 0;
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
    (+asteroidDiameter * 1000) ** 0.78 *
    (+velocity * 1000) ** 0.44 *
    9.8 ** -0.22 *
    Math.sin(Math.PI / 4) ** (1 / 3);

  return Dtc ? formatValue(Dtc * 0.001, 3) : null;
};

export const calculateCraterDepth = craterDiameter => {
  if (!craterDiameter) return null;
  return +craterDiameter / (2 * Math.sqrt(2));
};

export const getMercalliIntensity = richterMagnitude => {
  if (!richterMagnitude) return null;

  const mercalliIntensity = [
    { id: '0', range: [0, 1], description: 'No seismic damage felt.' },
    {
      id: 'I',
      range: [1, 2],
      description:
        'Not felt except by a very few under especially favorable conditions.',
    },
    {
      id: 'II',
      range: [2, 3],
      description:
        'Felt only by a few persons at rest, especially on upper floors of buildings.',
    },
    {
      id: 'III',
      range: [3, 3.5],
      description:
        'Felt quite noticeably by persons indoors, especially on upper floors of buildings. Many people do not recognize it as an earthquake. Standing motor cars may rock slightly. Vibrations similar to the passing of a truck.',
    },
    {
      id: 'IV',
      range: [3.5, 4.5],
      description:
        'Felt indoors by many, outdoors by few during the day. At night, some awakened. Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building. Standing motor cars rocked noticeably.',
    },
    {
      id: 'V',
      range: [4.5, 5],
      description:
        'Felt by nearly everyone; many awakened. Some dishes, windows broken. Unstable objects overturned. Pendulum clocks may stop.',
    },
    {
      id: 'VI',
      range: [5, 5.5],
      description:
        'Felt by all, many frightened. Some heavy furniture moved; a few instances of fallen plaster. Damage slight.',
    },
    {
      id: 'VII',
      range: [5.5, 6.5],
      description:
        'Damage negligible in buildings of good design and construction; slight to moderate in well-built ordinary structures; considerable damage in poorly built or badly designed structures; some chimneys broken.',
    },
    {
      id: 'VIII',
      range: [6.5, 7.5],
      description:
        'Damage slight in specially designed structures; considerable damage in ordinary substantial buildings with partial collapse. Damage great in poorly built structures. Fall of chimneys, factory stacks, columns, monuments, and walls. Heavy furniture overturned.',
    },
    {
      id: 'IX',
      range: [7.5, 8],
      description:
        'General panic. Damage considerable in specially designed structures; well-designed frame structures thrown out of plumb. Damage great in substantial buildings, with partial collapse. Buildings shifted off foundations. Serious damage to reservoirs. Underground pipes broken. Conspicuous cracks in ground. In alluviated areas sand and mud ejected, earthquake fountains, sand craters.',
    },
    {
      id: 'X',
      range: [8, 8.5],
      description:
        'Most masonry and frame structures destroyed with their foundations. Some well-built wooden structures and bridges destroyed. Serious damage to dams, dikes, and embankments. Large landslides. Water thrown on banks of canals, rivers, lakes, etc. Sand and mud shifted horizontally on beaches and flat land. Rails bent slightly.',
    },
    {
      id: 'XI',
      range: [8.5, 9],
      description:
        'Rails bent greatly. Underground pipelines completely out of service.',
    },
    {
      id: 'XII',
      range: [9, Infinity],
      description:
        'Damage nearly total. Large rock masses displaced. Lines of sight and level distorted. Objects thrown into the air.',
    },
  ];

  return mercalliIntensity.filter(mi =>
    inRange(+richterMagnitude, mi.range[0], mi.range[1])
  );
};

export const getAirBlastDamage = airBlastOverPressure => {
  if (!airBlastOverPressure) return null;

  const airBlastDamage = [
    {
      overPressure: 426000,
      vehicles:
        'Cars and trucks will be largely displaced and grossly distorted and will require rebuilding before use.',
    },
    {
      overPressure: 379000,
      bridges:
        'Highway girder bridges and highway truss bridges will collapse.',
    },
    {
      overPressure: 297000,
      vehicles:
        'Cars and trucks will be overturned and displaced, requiring major repairs',
    },
    {
      overPressure: 273000,
      buildings:
        'Multistory steel-framed office-type buildings will suffer extreme frame distortion, incipient collapse. Multistory wall-bearing buildings and wood frame buildings will collapse.',
    },
    {
      overPressure: 121000,
      bridges: 'Highway truss bridges will collapse.',
    },
    {
      overPressure: 100000,
      bridges:
        'Highway truss bridges will suffer substantial distortion of bracing',
    },
    {
      overPressure: 42600,
      buildings:
        'Multistory wall-bearing buildings and wood frame buildings will collapse.',
    },
    {
      overPressure: 38500,
      buildings:
        'Multistory wall-bearing buildings will experience severe cracking and interior partitions will be blown down. Wood frame buildings will collapse.',
    },
    {
      overPressure: 26800,
      buildings: 'Wood frame buildings will almost completely collapse.',
    },
    {
      overPressure: 22900,
      buildings:
        'Interior partitions of wood frame buildings will be blown down. Roof will be severely damaged. Glass will windows shatter.',
    },
    {
      overPressure: 6900,
      buildings: 'Glass windows will shatter.',
    },
    { overPressure: 0, buildings: 'No air blast damage felt.' },
  ];
  const filteredAirBlastDamage = airBlastDamage.filter(damage => {
    const { overPressure } = damage;
    return overPressure <= +airBlastOverPressure;
  });

  const vehicles = find(filteredAirBlastDamage, 'vehicles');
  const bridges = find(filteredAirBlastDamage, 'bridges');
  const buildings = find(filteredAirBlastDamage, 'buildings');

  const damageDescription = [];
  if (buildings) damageDescription.push(buildings.buildings);
  if (bridges) damageDescription.push(bridges.bridges);
  if (vehicles) damageDescription.push(vehicles.vehicles);

  return damageDescription;
};

export const calculateAsteroidImpact = props => {
  const { asteroidDiameter, density, velocity, observerDistance } = props;
  const craterDiameter = calculateCraterDiameter(
    asteroidDiameter,
    density,
    velocity
  );
  const craterDepth = calculateCraterDepth(craterDiameter);
  const seismicDamage = calculateSeismicDamage(
    asteroidDiameter,
    density,
    velocity
  );
  const richterMagnitude = calculateRichterMagnitude(seismicDamage);
  const richterMagnitudeAtObserverDistance = getRichterMagnitudeAt(
    richterMagnitude,
    props
  );
  const mercalliIntensity = getMercalliIntensity(
    richterMagnitudeAtObserverDistance
  );
  const overPressure = calculateAirBlast(observerDistance, seismicDamage);
  const airBlastDamage = getAirBlastDamage(overPressure);
  return {
    ...props,
    craterDiameter,
    craterDepth,
    richterMagnitude,
    richterMagnitudeAtObserverDistance,
    mercalliIntensity,
    overPressure,
    airBlastDamage,
  };
};
