import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons.jsx';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';
import { qaReviewHighlight } from './equations.module.scss';

export default function FindKineticEnergy(props) {
  const { kineticEnergy, mass, velocity, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={equation} data-testid="qa-calc-kinetic-energy">
      <span>KE = </span>
      <span className={fraction}>
        <span className="numerator">1</span>
        <span className={denominator}>2</span>
      </span>
      <span> &times; </span>
      <span className={addColorClass}>
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
      <span>= </span>
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

FindKineticEnergy.propTypes = {
  kineticEnergy: PropTypes.number,
  mass: PropTypes.string,
  velocity: PropTypes.string,
  qaReview: PropTypes.bool,
};
