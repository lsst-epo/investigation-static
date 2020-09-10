import React from 'react';
import PropTypes from 'prop-types';
import { equation as equationStyle, color } from '../qaCalculator.module.scss';
import { addTheCommas } from '../../../../../lib/utilities.js';

export default function FindDistanceModulus(props) {
  const { variable } = props;

  return (
    <p className={equationStyle} data-testid="qa-calc-distance-modulus">
      <span>DM = </span>
      <span className={color}>{variable ? addTheCommas(variable) : 'm'}</span>
      <span> + 19.4</span>
    </p>
  );
}

FindDistanceModulus.propTypes = {
  variable: PropTypes.string,
};
