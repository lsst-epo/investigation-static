import React from 'react';
import PropTypes from 'prop-types';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons';
import { addTheCommas, formatValue } from '../../../../../lib/utilities.js';

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
    <p className={`equation ${equation}`} data-testid="qa-calc-size">
      <span>
        D<sub>a</sub> ={' '}
      </span>
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
          -0.2 &times; <span className={color}>{magnitude || 'H'}</span>
        </span>
      </span>
      <span>= </span>
      <span className={color}>
        {diameter && diameter < Infinity ? (
          <span>
            {addTheCommas(formatValue(diameter, 0))}
            <QACalculatorIconUnit className={color} unit="diameter" />
          </span>
        ) : (
          '?'
        )}
      </span>
    </p>
  );
}

FindDiameter.propTypes = {
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  magnitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  albedo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
