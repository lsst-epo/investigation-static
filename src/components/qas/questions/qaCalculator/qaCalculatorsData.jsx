import React from 'react';
import { QACalculatorIcon, QACalculatorIconUnit } from './qQaCalculatorIcons';
import FindImpactCrater from './equations/FindImpactCrater';
import FindImpactEnergy from './equations/FindImpactEnergy';
import FindDiameter from './equations/FindDiameter';
import FindKineticEnergy from './equations/FindKineticEnergy';
import FindMass from './equations/FindMass';
import FindImpactDamage from './equations/FindImpactDamage';
import {
  getCalculatedMeasurementsForDistance,
  calculateDiameter,
  calculateKineticEnergy,
  calculateMass,
  calculateAsteroidImpact,
  calculateImpactEnergy,
  calculateAsteroidImpactDamage,
} from './qaCalculatorUtilities';

export const DistanceCalculator = {
  value: {
    magnitude: null,
    distanceModulus: null,
    parsecs: null,
    megaParsecs: null,
    lightYears: null,
    megaLightYears: null,
  },
  formula: getCalculatedMeasurementsForDistance,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="m =" />,
      placeholder: 'magnitude',
      defaultValue: 'magnitude',
    },
  ],
};

export const MassCalculator = {
  value: {
    velocity: null,
    kineticEnergy: null,
    mass: null,
    density: null,
    diameter: null,
  },
  solutionVariable: 'all',
  equation: FindMass,
  formula: calculateMass,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
    {
      leftIcon: <QACalculatorIcon content="&#x1D780; =" />,
      rightIcon: <QACalculatorIconUnit unit="density" />,
      placeholder: 'density',
      defaultValue: 'density',
    },
    {
      leftIcon: <QACalculatorIcon content="<span>D<sub>a</sub> =</span>" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      placeholder: 'diameter',
      defaultValue: 'diameter',
    },
  ],
};

export const KineticEnergyCalculator = {
  value: {
    mass: null,
    velocity: null,
    kineticEnergy: null,
  },
  solutionVariable: 'kineticEnergy',
  equation: FindKineticEnergy,
  formula: calculateKineticEnergy,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="m =" />,
      rightIcon: <QACalculatorIconUnit unit="mass" />,
      placeholder: 'mass',
      defaultValue: 'mass',
    },
    {
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
  ],
};

export const ImpactEnergyCalculator = {
  value: {
    density: null,
    velocity: null,
    diameter: null,
    kineticEnergy: null,
  },
  solutionVariable: 'kineticEnergy',
  equation: FindImpactEnergy,
  formula: calculateImpactEnergy,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="&#x1D780; =" />,
      rightIcon: <QACalculatorIconUnit unit="density" />,
      placeholder: 'density',
      defaultValue: 'density',
    },
    {
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
    {
      leftIcon: <QACalculatorIcon content="<span>D<sub>a</sub> =</span>" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      placeholder: 'diameter',
      defaultValue: 'diameter',
    },
  ],
};

export const SizeCalculator = {
  value: {
    magnitude: null,
    albedo: null,
    diameter: null,
  },
  solutionVariable: 'diameter',
  equation: FindDiameter,
  formula: calculateDiameter,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="H =" />,
      placeholder: 'magnitude',
      defaultValue: 'magnitude',
    },
    {
      leftIcon: <QACalculatorIcon content="p =" />,
      placeholder: 'albedo',
      defaultValue: 'albedo',
    },
  ],
};

export const ImpactCalculator = {
  value: {
    kineticEnergy: null,
    craterDiameter: null,
    craterDepth: null,
    density: null,
    velocity: null,
    asteroidDiameter: null,
  },
  solutionVariable: 'all',
  equation: FindImpactCrater,
  formula: calculateAsteroidImpact,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="D<sub>a</sub> =" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      // label: 'Asteroid Diameter',
      placeholder: 'asteroid diameter',
      defaultValue: 'asteroidDiameter',
    },
    {
      leftIcon: <QACalculatorIcon content="<span>&#x1D780;</span> =" />,
      rightIcon: <QACalculatorIconUnit unit="density" />,
      // label: 'Asteroid Density',
      placeholder: 'density',
      defaultValue: 'density',
    },
    {
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      // label: 'Asteroid Velocity',
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
  ],
};

export const ImpactDamageCalculator = {
  value: {
    kineticEnergy: null,
    observerDistance: null,
    richterMagnitude: null,
    richterMagnitudeAtObserverDistance: null,
    mercalliIntensity: null,
    airBlastOverPressure: null,
    airBlastDamage: null,
  },
  solutionVariable: 'all',
  equation: FindImpactDamage,
  formula: calculateAsteroidImpactDamage,
  inputs: [
    {
      leftIcon: <QACalculatorIcon content="KE =" />,
      rightIcon: <QACalculatorIconUnit unit="kineticEnergy" />,
      // label: 'Asteroid Kinetic Energy',
      placeholder: 'asteroid KE',
      defaultValue: 'kineticEnergy',
    },
    {
      leftIcon: <QACalculatorIcon content="r =" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      // label: "Observer's distance from impact",
      min: 0,
      max: 20000000,
      placeholder: 'observer distance',
      defaultValue: 'observerDistance',
    },
  ],
};
