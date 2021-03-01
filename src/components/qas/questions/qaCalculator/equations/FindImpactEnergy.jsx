import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';
import { qaReviewHighlight } from './equations.module.scss';

export default function FindImpactEnergy(props) {
  const { diameter, density, velocity, kineticEnergy, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={equation} data-testid="qa-calc-impact">
      <span>KE = </span>
      <span className={fraction}>
        <span className="numerator">
          <span>&pi; &times; </span>
          <span className={addColorClass}>
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
          <span className={addColorClass}>
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
          <span className={addColorClass}>
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
      <span className={addColorClass}>
        {kineticEnergy ? (
          <span>
            {addTheCommas(toSigFigs(+kineticEnergy, 3))}
            <QACalculatorIconUnit
              className={addColorClass}
              unit="kineticEnergy"
            />
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
  qaReview: PropTypes.bool,
};
