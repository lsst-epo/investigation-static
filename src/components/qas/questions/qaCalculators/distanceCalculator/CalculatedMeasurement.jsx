import React from 'react';
import PropTypes from 'prop-types';
import { calculationBlock } from './distanceCalculator.module.scss';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities';

function CalculatedMeasurement({ unit, value }) {
  const labels = {
    pc: 'Parsecs (pc)',
    Mpc: 'Mega Parsecs (Mpc)',
    ly: 'Light Years (ly)',
    Mly: 'Mega Light Years (Mly)',
    D: 'D (km)',
  };

  return (
    <div className={calculationBlock}>
      <p>{`${labels[unit] || unit} = ${
        value ? addTheCommas(toSigFigs(value, 3)) : '?'
      }`}</p>
    </div>
  );
}

CalculatedMeasurement.propTypes = {
  unit: PropTypes.string,
  value: PropTypes.number,
};

export default CalculatedMeasurement;
