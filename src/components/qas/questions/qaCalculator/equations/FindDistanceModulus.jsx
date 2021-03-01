import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { equation as equationStyle, color } from '../qaCalculator.module.scss';
import { qaReviewHighlight } from './equations.module.scss';
import { addTheCommas } from '../../../../../lib/utilities.js';

export default function FindDistanceModulus(props) {
  const { variable, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={equationStyle} data-testid="qa-calc-distance-modulus">
      <span>DM = </span>
      <span className={addColorClass}>
        {variable ? addTheCommas(variable) : 'm'}
      </span>
      <span> + 19.4</span>
    </p>
  );
}

FindDistanceModulus.propTypes = {
  variable: PropTypes.string,
  qaReview: PropTypes.bool,
};
