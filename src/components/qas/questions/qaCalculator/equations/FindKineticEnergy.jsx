import React from 'react';
import PropTypes from 'prop-types';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons.jsx';
import {
  addTheCommas,
  scientificNotation,
} from '../../../../../lib/utilities.js';
import {
  equation,
  color,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';

export default function FindKineticEnergy(props) {
  const { kineticEnergy, mass, velocity } = props;

  return (
    <p className={`equation ${equation}`} data-testid="qa-calc-kinetic-energy">
      <span>KE = </span>
      <span className={fraction}>
        <span className="numerator">1</span>
        <span className={denominator}>2</span>
      </span>
      <span> &times; </span>
      <span className={color}>
        {mass ? (
          <span>
            {addTheCommas(mass)}
            <QACalculatorIconUnit tiny unit="mass" />
          </span>
        ) : (
          'm'
        )}
      </span>
      <span> &times; </span>
      <span className={color}>
        {velocity ? (
          <span>
            {addTheCommas(velocity)}
            <QACalculatorIconUnit tiny unit="velocity" />
          </span>
        ) : (
          'v'
        )}
      </span>
      <span className={exponent}>2</span>
      <span>= </span>
      <span className={color}>
        {kineticEnergy ? (
          <span>
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={scientificNotation(+kineticEnergy, 3)}
            ></span>
            <QACalculatorIconUnit className={color} unit="kineticEnergy" />
          </span>
        ) : (
          '?'
        )}
      </span>
    </p>
  );
}

FindKineticEnergy.propTypes = {
  kineticEnergy: PropTypes.number,
  mass: PropTypes.string,
  velocity: PropTypes.string,
};
