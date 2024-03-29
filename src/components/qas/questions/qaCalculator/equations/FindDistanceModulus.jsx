import React from 'react';
import PropTypes from 'prop-types';
import { equation, color } from '../qaCalculator.module.scss';
import { addTheCommas } from '../../../../../lib/utilities.js';

export default function FindDistanceModulus(props) {
  const { variable } = props;

  return (
    <p
      className={`equation ${equation}`}
      data-testid="qa-calc-distance-modulus"
    >
      <span>DM = </span>
      <span className={`highlight ${color}`}>
        {variable ? addTheCommas(variable) : 'm'}
      </span>
      <span> + 19.4</span>
    </p>
  );
}

FindDistanceModulus.propTypes = {
  variable: PropTypes.string,
};
