import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../../../styles.module.scss';
import { fraction, denominator, color } from '../qaCalculator.module.scss';
import { qaReviewHighlight } from './equations.module.scss';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';

export default function FindParsecs(props) {
  const { variable, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={styles.equation} data-testid="qa-calc-parsecs">
      <span>d = 10 </span>
      <sup className={fraction}>
        <span>
          <span>(</span>
          <span className={addColorClass}>
            {variable ? addTheCommas(toSigFigs(variable)) : 'DM'}
          </span>
          <span>+ 5)</span>
        </span>
        <span className={denominator}>5</span>
      </sup>
    </p>
  );
}

FindParsecs.propTypes = {
  variable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  qaReview: PropTypes.bool,
};
