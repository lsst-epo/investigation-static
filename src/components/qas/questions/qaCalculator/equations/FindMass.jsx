/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
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

  const p = !density
    ? colorize(`\\rho`)
    : addColorAndUnit(addTheCommas(density), 'density');
  const d = !diameter
    ? colorize(`D_a`)
    : addColorAndUnit(addTheCommas(diameter), 'diameter');
  const m =
    !mass || +mass === 0
      ? colorize(`?`)
      : addColorAndUnit(scientificNotation(mass, 3, 'latex'), 'mass');

  return (
    <div>
      <MathJax
        laTex={`{\\bf m_a} = ${p} \\  \\times {4 \\over 3} \\times \\pi \\times ({${d} \\  \\over 2}) ^ 3 = \\ ${m}`}
      />
    </div>
  );
}

FindMass.propTypes = {
  density: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mass: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
