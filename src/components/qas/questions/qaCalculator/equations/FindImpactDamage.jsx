import React from 'react';
import PropTypes from 'prop-types';
import {
  addTheCommas,
  toSigFigs,
  formatValue,
} from '../../../../../lib/utilities.js';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons';
import { marginTop, color } from '../qaCalculator.module.scss';
import { findImpactCraterEquation, boldText } from './equations.module.scss';

export default function FindImpactDamage(props) {
  const { richterMagnitudeAtObserverDistance, overPressure } = props;

  return (
    <div className={findImpactCraterEquation} data-testid="qa-calc-impact">
      <div className={marginTop}>
        <p className="equation">
          <span className={boldText}>Richter Magnitude = </span>
          <span className={`highlight ${color}`}>
            {richterMagnitudeAtObserverDistance > 0 ? (
              <span>
                {addTheCommas(
                  formatValue(richterMagnitudeAtObserverDistance, 1)
                )}
              </span>
            ) : (
              <span>?</span>
            )}
          </span>
        </p>
      </div>
      <div className={marginTop}>
        <p className="equation">
          <span className={boldText}>Air Blast Pressure = </span>
          <span className={`highlight ${color}`}>
            {overPressure ? (
              <span>
                {addTheCommas(toSigFigs(overPressure, 3))}
                <QACalculatorIconUnit unit="overPressure" />
              </span>
            ) : (
              <span>?</span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

FindImpactDamage.propTypes = {
  richterMagnitudeAtObserverDistance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  overPressure: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
