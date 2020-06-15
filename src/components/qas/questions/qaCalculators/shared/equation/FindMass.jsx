import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../../lib/utilities';
import { color, equation } from './equation.module.scss';

export default function FindMass(props) {
  const { density, mass, volume } = props;

  return (
    <p className={equation}>
      <span>m = </span>
      <span className={color}>{density ? addTheCommas(density) : 'p'}</span>
      <span> * </span>
      <span className={color}>{volume ? addTheCommas(volume) : 'v'}</span>
      <span> = </span>
      <span className={color}>
        {mass ? addTheCommas(formatValue(mass, 2)) : '?'}
      </span>
    </p>
  );
}

FindMass.propTypes = {
  density: PropTypes.number,
  mass: PropTypes.number,
  volume: PropTypes.number,
};
