import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { color, calculationBlock } from './qaCalculator.module.scss';
import { addTheCommas, toSigFigs } from '../../../../lib/utilities';

function CalculatedMeasurement({ unit, value, qaReview }) {
  const labels = {
    pc: 'Parsecs (pc)',
    Mpc: 'Mega Parsecs (Mpc)',
    ly: 'Light Years (ly)',
    Mly: 'Megalight-years (Mly)',
    D: 'D (km)',
  };

  return (
    <div className={calculationBlock}>
      <p>
        <span>{labels[unit] || unit} = </span>
        <span
          className={classnames(color, {
            [color]: !qaReview,
          })}
        >
          {value ? addTheCommas(toSigFigs(value, 3)) : '?'}
        </span>
      </p>
    </div>
  );
}

CalculatedMeasurement.propTypes = {
  unit: PropTypes.string,
  value: PropTypes.number,
  qaReview: PropTypes.bool,
};

export default CalculatedMeasurement;
