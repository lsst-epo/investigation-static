/* eslint-disable react/no-danger */
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
import { boldText } from './equations.module.scss';

export default function FindKineticEnergy(props) {
  const { kineticEnergy, mass, velocity } = props;

  console.log({ mass });

  return (
    <p className={`equation ${equation}`} data-testid="qa-calc-kinetic-energy">
      <span className={boldText}>KE = </span>
      <span className={fraction}>
        <span className="numerator">1</span>
        <span className={denominator}>2</span>
      </span>
      <span> &times; </span>
      <span className={`highlight ${color}`}>
        {mass ? (
          <>
            <span dangerouslySetInnerHTML={scientificNotation(mass, 3)} />
            <QACalculatorIconUnit tiny unit="mass" />
          </>
        ) : (
          'm'
        )}
      </span>
      <span> &times; </span>
      <span className={`highlight ${color}`}>
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
      <span className={`highlight ${color}`}>
        {kineticEnergy ? (
          <>
            <span
              dangerouslySetInnerHTML={scientificNotation(+kineticEnergy, 3)}
            ></span>
            <QACalculatorIconUnit unit="kineticEnergy" />
          </>
        ) : (
          <span>?</span>
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
