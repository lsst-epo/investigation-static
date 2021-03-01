import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  addTheCommas,
  toSigFigs,
  formatValue,
} from '../../../../../lib/utilities.js';
import { QACalculatorIconUnit } from '../qQaCalculatorIcons';
import { marginTop, color } from '../qaCalculator.module.scss';
import {
  findImpactCraterEquation,
  boldText,
  // seismicDamageText,
  qaReviewHighlight,
} from './equations.module.scss';

export default function FindImpactDamage(props) {
  const {
    richterMagnitudeAtObserverDistance,
    // mercalliIntensity,
    overPressure,
    // airBlastDamage,
    qaReview,
  } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <div className={findImpactCraterEquation} data-testid="qa-calc-impact">
      <div className={marginTop}>
        <p>
          <span className={boldText}>Richter Magnitude = </span>
          <span className={addColorClass}>
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
        {/* <p>
          <span className={boldText}>Seismic damage:</span>
        </p>
        {mercalliIntensity &&
          mercalliIntensity.map((mi, index) => (
            <p
              key={`mercalli-intensity-${index}`}
              className={seismicDamageText}
            >
              {mi.description}
            </p>
          ))} */}
      </div>
      <div className={marginTop}>
        <p>
          <span className={boldText}>Air Blast Over Pressure = </span>
          <span className={addColorClass}>
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
        {/* <p className={boldText}>Air Blast Over Pressure damage:</p>
        <ul>
          {airBlastDamage &&
            airBlastDamage.map((damage, index) => (
              <li key={`damage-message-${index}`}>{damage}</li>
            ))}
        </ul> */}
      </div>
    </div>
  );
}

FindImpactDamage.propTypes = {
  richterMagnitudeAtObserverDistance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // mercalliIntensity: PropTypes.array,
  overPressure: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // airBlastDamage: PropTypes.array,
  qaReview: PropTypes.bool,
};
