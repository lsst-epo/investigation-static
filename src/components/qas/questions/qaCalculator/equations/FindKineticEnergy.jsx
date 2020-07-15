import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../lib/utilities.js';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons.jsx';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';

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
        {mass && <QACalculatorIconUnit className={color} tiny unit="mass" />}
        <span>)</span>
        {` * `}
        <span className={color}>
          {velocity ? addTheCommas(velocity) : 'v'}
          {velocity && (
            <QACalculatorIconUnit className={color} tiny unit="velocity" />
          )}
        </span>
        <span className={exponent}>2</span>
      </span>
      <span>= </span>
      <span className={color}>
        {kineticEnergy ? `${addTheCommas(formatValue(kineticEnergy, 2))}` : '?'}
        <QACalculatorIconUnit className={color} unit="kineticEnergy" />
      </span>
    </p>
  );
}

FindKineticEnergy.propTypes = {
  kineticEnergy: PropTypes.number,
  mass: PropTypes.number,
  velocity: PropTypes.number,
};
