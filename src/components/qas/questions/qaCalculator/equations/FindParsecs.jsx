import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../../styles.module.scss';
import { fraction, denominator, color } from '../qaCalculator.module.scss';
import { addTheCommas } from '../../../../../lib/utilities.js';

export default function FindParsecs(props) {
  const { variable } = props;

  return (
    <p className={styles.equation} data-testid="qa-calc-parsecs">
      <span>d = 10 </span>
      <sup className={fraction}>
        <span>
          <span>(</span>
          <span className={color}>
            {variable ? addTheCommas(variable) : 'DM'}
          </span>
          <span>+ 5)</span>
        </span>
        <span className={denominator}>5</span>
      </sup>
    </p>
  );
}

FindParsecs.propTypes = {
  variable: PropTypes.number,
};
