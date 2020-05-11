import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../../lib/utilities';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from './equation.module.scss';

export default function FindKineticEnergy(props) {
  const { kineticEnergy, mass, velocity } = props;

  return (
    <p className={equation}>
      <span>KE = </span>
      <span>(</span>
      <span className={fraction}>
        <span className="numerator">1</span>
        <span className={denominator}>2</span>
      </span>
      {` * `}
      <span>
        <span className={color}> {mass ? addTheCommas(mass) : 'm'}</span>
        <span>)</span>
        {` * `}
        <span className={color}>
          {velocity ? addTheCommas(velocity) : 'v'}&nbsp;
        </span>
        <span className={exponent}>2</span>
      </span>
      <span>= </span>
      <span className={color}>
        {kineticEnergy ? addTheCommas(formatValue(kineticEnergy, 2)) : '?'}
      </span>
    </p>
  );
}

FindKineticEnergy.propTypes = {
  kineticEnergy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mass: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  velocity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
