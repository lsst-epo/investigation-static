import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons.jsx';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';
import {
  color,
  fraction,
  denominator,
  equation,
  exponent,
} from '../qaCalculator.module.scss';
import { qaReviewHighlight } from './equations.module.scss';

export default function FindMass(props) {
  const { density, mass, diameter, qaReview } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <p className={equation}>
      <span>
        m<sub>a</sub> ={' '}
      </span>
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
      <span className={fraction}>
        <span className="numerator">4</span>
        <span className={denominator}>3</span>
      </span>
      &nbsp;&times; &pi; &times; <span>( </span>
      <span className={fraction}>
        <span className={`numerator ${addColorClass}`}>
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
        <span className={denominator}>2</span>
      </span>
      <span> )</span>
      <span className={exponent}> 3</span>
      <span> = </span>
      <span className={addColorClass}>
        {mass ? (
          <span>
            {addTheCommas(toSigFigs(mass, 3))}
            <QACalculatorIconUnit tiny unit="mass" />
          </span>
        ) : (
          '?'
        )}
      </span>
    </p>
  );
}

FindMass.propTypes = {
  density: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mass: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  qaReview: PropTypes.bool,
};
