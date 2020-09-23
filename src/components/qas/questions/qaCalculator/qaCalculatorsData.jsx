import React from 'react';
import { QACalculatorIcon, QACalculatorIconUnit } from './qQaCalculatorIcons';
import FindImpactCrater from './equations/FindImpactCrater';
import FindDiameter from './equations/FindDiameter';
import FindKineticEnergy from './equations/FindKineticEnergy';
import {
  getCalculatedMeasurementsForDistance,
  calculateDiameter,
  calculateKineticEnergy,
  calculateAsteroidImpact,
} from './qaCalculatorUtilities';
import { col50 } from './qaCalculator.module.scss';

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
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="m =" />,
      placeholder: 'magnitude',
      defaultValue: 'magnitude',
    },
  ],
};

export const KineticEnergyCalculator = {
  value: {
    density: null,
    velocity: null,
    diameter: null,
    kineticEnergy: null,
  },
  solutionVariable: 'kineticEnergy',
  equation: FindKineticEnergy,
  formula: calculateKineticEnergy,
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
      leftIcon: <QACalculatorIcon content="D =" />,
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
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="H =" />,
      placeholder: 'magnitude',
      defaultValue: 'magnitude',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="p =" />,
      placeholder: 'albedo',
      defaultValue: 'albedo',
    },
  ],
};

export const ImpactCalculator = {
  value: {
    craterDiameter: null,
    craterDepth: null,
    richterMagnitude: null,
    richterMagnitudeAtObserverDistance: null,
    mercalliIntensity: null,
    density: null,
    velocity: null,
    asteroidDiameter: null,
    airBlastOverPressure: null,
    airBlastDamage: null,
    observerDistance: null,
  },
  solutionVariable: 'all',
  equation: FindImpactCrater,
  formula: calculateAsteroidImpact,
  inputs: [
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="D<sub>a</sub> =" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      label: 'Asteroid Diameter',
      placeholder: 'asteroid diameter',
      defaultValue: 'asteroidDiameter',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="<span>&#x1D780;</span> =" />,
      rightIcon: <QACalculatorIconUnit unit="density" />,
      label: 'Asteroid Density',
      placeholder: 'density',
      defaultValue: 'density',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      label: 'Asteroid Velocity',
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="r =" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      label: "Observer's distance from impact",
      min: 0,
      max: 20000000,
      placeholder: 'observer distance',
      defaultValue: 'observerDistance',
    },
  ],
};
