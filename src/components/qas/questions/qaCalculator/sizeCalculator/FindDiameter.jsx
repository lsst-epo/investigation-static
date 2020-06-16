import React from 'react';
import PropTypes from 'prop-types';

import {
  equation,
  fraction,
  exponent,
  color,
  squareRoot,
  numerator,
  denominator,
} from '../qaCalculator.module.scss';

export default function FindDiameter(props) {
  const { diameter, magnitude, albedo } = props;

  return (
    <p className={equation}>
      <span>D = </span>
      <span className={fraction}>
        <span className={numerator}>1329</span>
        <span className={denominator}>
          <span className={squareRoot}>
            <span className={color}>{albedo || 'p'}</span>
          </span>
        </span>
      </span>
      <span>
        <span> 10 </span>
        <span className={exponent}>
          -0.2 * <span className={color}>{magnitude || 'H'}</span>
        </span>
      </span>
      <span>= </span>
      <span className={color}>{diameter ? `${diameter} km` : '?'}</span>
    </p>
  );
}

FindDiameter.propTypes = {
  diameter: PropTypes.number,
  magnitude: PropTypes.number,
  albedo: PropTypes.number,
};
