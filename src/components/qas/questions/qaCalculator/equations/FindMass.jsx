/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
// import Tex2SVG from 'react-hook-mathjax';
import MathJax from '../../../../site/mathJax';
import {
  addTheCommas,
  scientificNotation,
} from '../../../../../lib/utilities.js';
import {
  colorize,
  addColorAndUnit,
} from '../../../../site/mathJax/mathjax.utilities.js';

export default function FindMass(props) {
  const { density, mass, diameter } = props;

  function getDensityChar(d) {
    if (!d) {
      return colorize(`\\rho`);
    }

    return addColorAndUnit(addTheCommas(d), 'density');
  }

  function getDiameterChar(d) {
    if (!d) {
      return colorize(`D_a`);
    }

    return addColorAndUnit(addTheCommas(diameter), 'diameter');
  }

  function getMassChar(m) {
    if (!m || +m === 0) {
      return colorize(`?`);
    }

    return addColorAndUnit(scientificNotation(mass, 3, 'latex'), 'mass');
  }

  // function getVelocityChar(v) {
  //   if (!v) {
  //     return colorize(`?`);
  //   }

  //   return addColorAndUnit(v, 'velocity');
  // }

  // function getkineticEnergyChar(ke) {
  //   if (!ke) {
  //     return colorize(`?`);
  //   }

  //   return addColorAndUnit(scientificNotation(ke, 3, 'latex'), 'kineticEnergy');
  // }

  const p = getDensityChar(density);
  const d = getDiameterChar(diameter);
  const m = getMassChar(mass);
  // const v = getVelocityChar(velocity);
  // const ke = getkineticEnergyChar(kineticEnergy);

  // <Tex2SVG
  //   latex={`{\\bf KE_a} = {1 \\over 2} \\times ${m} \\times (${v}) ^ 2 = \\ ${ke}`}
  // />
  return (
    <p className="equation">
      <MathJax
        latex={`{\\bf m_a} = ${p} \\  \\times {4 \\over 3} \\times \\pi \\times ({${d} \\  \\over 2}) ^ 3 = \\ ${m}`}
      />
    </p>
  );
}

FindMass.propTypes = {
  density: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mass: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
