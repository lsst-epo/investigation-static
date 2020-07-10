import React from 'react';
import { QACalculatorIcon, QACalculatorIconUnit } from './qQaCalculatorIcons';
import FindImpactCrater from './equations/FindImpactCrater';
import FindDiameter from './equations/FindDiameter';
import FindKineticEnergy from './equations/FindKineticEnergy';
import {
  getCalculatedMeasurementsForDistance,
  calculateDiameter,
  calculateKineticEnergy,
  calculateCraterDiameter,
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
    mass: null,
    velocity: null,
    kineticEnergy: null,
  },
  solutionVariable: 'kineticEnergy',
  equation: FindKineticEnergy,
  formula: calculateKineticEnergy,
  inputs: [
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="m =" />,
      rightIcon: <QACalculatorIconUnit unit="mass" />,
      placeholder: 'mass',
      defaultValue: 'mass',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      placeholder: 'velocity',
      defaultValue: 'velocity',
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
    density: null,
    velocity: null,
    asteroidDiameter: null,
  },
  solutionVariable: 'craterDiameter',
  equation: FindImpactCrater,
  formula: calculateCraterDiameter,
  inputs: [
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="D =" />,
      rightIcon: <QACalculatorIconUnit unit="diameter" />,
      placeholder: 'asteroid diameter',
      defaultValue: 'asteroidDiameter',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="p =" />,
      rightIcon: <QACalculatorIconUnit unit="density" />,
      placeholder: 'density',
      defaultValue: 'density',
    },
    {
      containerWidth: col50,
      leftIcon: <QACalculatorIcon content="v =" />,
      rightIcon: <QACalculatorIconUnit unit="velocity" />,
      placeholder: 'velocity',
      defaultValue: 'velocity',
    },
  ],
};
