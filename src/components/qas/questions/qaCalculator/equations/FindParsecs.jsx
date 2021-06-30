import React from 'react';
import PropTypes from 'prop-types';
import { equation } from '../../../styles.module.scss';
import { fraction, denominator, color } from '../qaCalculator.module.scss';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';

export default function FindParsecs(props) {
  const { variable } = props;

  return (
    <p className={`equation ${equation}`} data-testid="qa-calc-parsecs">
      <span>d = 10 </span>
      <sup className={fraction}>
        <span>
          <span>(</span>
          <span className={color}>
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
};
