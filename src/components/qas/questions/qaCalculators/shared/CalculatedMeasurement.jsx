/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './calculation/calculation.module.scss';
import { addTheCommas } from '../../../../../lib/utilities';

function CalculatedMeasurement({ unit, value }) {
  const labels = {
    pc: 'Parsecs (pc)',
    Mpc: 'Mega Parsecs (Mpc)',
    ly: 'Light Years (ly)',
    Mly: 'Mega Light Years (Mly)',
  };

  return (
    <div className={styles.calculationBlock}>
      <p>{`${labels[unit] || unit} = ${value ? addTheCommas(value) : '?'}`}</p>
    </div>
  );
}

CalculatedMeasurement.propTypes = {
  unit: PropTypes.string,
  value: PropTypes.number,
};

export default CalculatedMeasurement;
