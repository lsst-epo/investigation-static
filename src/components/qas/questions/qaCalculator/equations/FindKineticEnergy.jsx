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
  const { kineticEnergy, density, velocity, diameter } = props;

  return (
    <p className={equation} data-testid="qa-calc-kinetic-energy">
      <span>KE = </span>
      <span className={fraction}>
        <span className="numerator">
          &pi; &times;{' '}
          <span>
            <span className={color}>
              {density ? (
                <span>
                  {addTheCommas(density)}
                  <QACalculatorIconUnit tiny unit="density" />
                </span>
              ) : (
                <span>&#x1D780;</span>
              )}
            </span>{' '}
            &times;{' '}
            <span className={color}>
              {diameter ? (
                <span>
                  {addTheCommas(diameter)}
                  <QACalculatorIconUnit tiny unit="diameter" />
                </span>
              ) : (
                <span>D</span>
              )}
            </span>
            <span className={exponent}>3</span>
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
          </span>
        </span>
        <span className={denominator}>12</span>
      </span>

      <span> = </span>
      <span className={color}>
        {kineticEnergy ? (
          <span>
            {addTheCommas(formatValue(+kineticEnergy, 3))}
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
  density: PropTypes.string,
  velocity: PropTypes.string,
  diameter: PropTypes.string,
};
