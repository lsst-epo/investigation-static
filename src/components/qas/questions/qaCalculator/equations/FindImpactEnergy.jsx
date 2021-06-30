import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';

export default function FindImpactEnergy(props) {
  const { diameter, density, velocity, kineticEnergy } = props;

  return (
    <p className={`equation ${equation}`} data-testid="qa-calc-impact">
      <span>KE = </span>
      <span className={fraction}>
        <span className="numerator">
          <span>&pi; &times; </span>
          <span className={color}>
            {density ? (
              <span>
                {addTheCommas(density)}
                <QACalculatorIconUnit tiny unit="density" />
              </span>
            ) : (
              <span>&#x1D780;</span>
            )}
          </span>
          <span> &times; </span>
          <span className={color}>
            {diameter ? (
              <span>
                {addTheCommas(diameter)}
                <QACalculatorIconUnit tiny unit="diameter" />
              </span>
            ) : (
              <span>
                D<sub>a</sub>
              </span>
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
        <span className={denominator}>12</span>
      </span>
      <span> = </span>
      <span className={color}>
        {kineticEnergy ? (
          <span>
            {addTheCommas(toSigFigs(+kineticEnergy, 3))}
            <QACalculatorIconUnit className={color} unit="kineticEnergy" />
          </span>
        ) : (
          '?'
        )}
      </span>
    </p>
  );
}

FindImpactEnergy.propTypes = {
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  density: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  velocity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  kineticEnergy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
