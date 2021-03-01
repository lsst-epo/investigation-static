import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
import { qaReviewHighlight } from './equations.module.scss';

export default function FindDiameter(props) {
  const { diameter, magnitude, albedo, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={equation} data-testid="qa-calc-size">
      <span>D = </span>
      <span className={fraction}>
        <span className={numerator}>1329</span>
        <span className={denominator}>
          <span className={squareRoot}>
            <span className={addColorClass}>{albedo || 'p'}</span>
          </span>
        </span>
      </span>
      <span>
        <span> 10 </span>
        <span className={exponent}>
          -0.2 &times; <span className={addColorClass}>{magnitude || 'H'}</span>
        </span>
      </span>
      <span>= </span>
      <span className={addColorClass}>
        {diameter && diameter < Infinity ? (
          <span>
            {addTheCommas(formatValue(diameter, 0))}
            <QACalculatorIconUnit className={addColorClass} unit="diameter" />
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
  qaReview: PropTypes.bool,
};
