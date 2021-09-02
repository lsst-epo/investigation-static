import React from 'react';
import PropTypes from 'prop-types';
import { equation } from '../../../styles.module.scss';
import { color } from '../qaCalculator.module.scss';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';

export default function FindParsecs(props) {
  const { variable } = props;

  const sigFitVariable = +toSigFigs(variable);
  const preparedVariable = addTheCommas(+sigFitVariable.toFixed(1));

  return (
    <p className={`equation ${equation}`} data-testid="qa-calc-parsecs">
      <span>d = 10 </span>
      <sup>
        <span>
          <span>(</span>
          <span className={`highlight ${color}`}>
            {variable ? preparedVariable : 'DM'}
          </span>
          <span>+ 5)</span>
        </span>
        <span> / 5</span>
      </sup>
    </p>
  );
}

FindParsecs.propTypes = {
  variable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
