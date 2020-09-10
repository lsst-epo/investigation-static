/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addTheCommas, formatValue } from '../../../../../lib/utilities.js';
import { QACalculatorIcon, QACalculatorIconUnit } from '../qQaCalculatorIcons';
import {
  color,
  equation,
  fraction,
  denominator,
  marginTop,
} from '../qaCalculator.module.scss';
import {
  findImpactCraterEquation,
  boldText,
  // seismicDamageText,
  craterDiameterStyle,
  craterDiameterAnswerStyle,
  craterDepthStyle,
} from './equations.module.scss';

export default function FindImpactCrater(props) {
  const {
    asteroidDiameter,
    density,
    velocity,
    craterDiameter,
    craterDepth,
    richterMagnitudeAtObserverDistance,
    // mercalliIntensity,
    overPressure,
    // airBlastDamage,
    observerDistance,
  } = props;

  return (
    <div className={findImpactCraterEquation} data-testid="qa-calc-impact">
      <p className={boldText}>Crater Diameter:</p>
      <p className={classnames(equation, craterDiameterStyle)}>
        <QACalculatorIcon content="D<sub>tc</sub> = " />
        <span>1.161</span>
        <span> ( </span>
        <span className={fraction}>
          <span className={`numerator ${color}`}>
            {!density ? <span>&#x1D780;</span> : addTheCommas(density)}
            {density && (
              <QACalculatorIconUnit className={color} tiny unit="density" />
            )}
          </span>
          <span className={denominator}>2500</span>
        </span>
        <span> )</span>
        <span>
          <sup>1/3</sup>
        </span>
        <span> </span>
        <span className={color}>
          {!asteroidDiameter ? 'D' : addTheCommas(asteroidDiameter)}
        </span>
        {asteroidDiameter && (
          <QACalculatorIconUnit className={color} tiny unit="diameter" />
        )}
        <sup>0.78</sup>
        <span> </span>
        <span className={color}>
          {!velocity ? 'v' : addTheCommas(velocity)}
        </span>
        {velocity && (
          <QACalculatorIconUnit className={color} tiny unit="velocity" />
        )}
        <sup>0.44</sup>
        <span> </span>
        <span>
          9.8
          <QACalculatorIconUnit tiny unit=" m/s" />
          <sup>-0.22</sup>
        </span>
        <span> </span>
        <span>
          sin
          <sup>1/3</sup>
          <span> 45˚</span>
        </span>
      </p>
      <p className={craterDiameterAnswerStyle}>
        <QACalculatorIcon content="D<sub>tc</sub> = " />
        <span className={boldText}>
          {craterDiameter ? addTheCommas(formatValue(craterDiameter, 3)) : '?'}
          <QACalculatorIconUnit unit="craterDiameter" />
        </span>
      </p>
      {craterDepth && (
        <div>
          <p className={boldText}>Crater Depth:</p>
          <p className={craterDepthStyle}>
            <QACalculatorIcon content="d<sub>tc</sub> = " />
            <span className={fraction}>
              <span className={`numerator ${color}`}>
                {craterDiameter ? (
                  addTheCommas(formatValue(craterDiameter, 3))
                ) : (
                  <QACalculatorIcon content="D<sub>tc</sub> = " />
                )}
                <QACalculatorIconUnit
                  className={color}
                  tiny
                  unit="craterDiameter"
                />
              </span>
              <span className={denominator}>2 &radic; 2</span>
            </span>
            <span> = </span>
            <span>
              {craterDepth ? addTheCommas(formatValue(craterDepth, 3)) : '?'}
              <QACalculatorIconUnit tiny unit="craterDiameter" />
            </span>
          </p>
        </div>
      )}
      {!!observerDistance && (
        <div className={marginTop}>
          <hr />
          <p>
            <span className={boldText}>
              Richter Magnitude at {addTheCommas(observerDistance)}{' '}
              {<QACalculatorIconUnit unit="diameter" />} from impact:{' '}
            </span>
            <span>{richterMagnitudeAtObserverDistance}</span>
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
      )}
      {!!observerDistance && (
        <div className={marginTop}>
          <hr />
          <p>
            <span className={boldText}>
              Air Blast Over Pressure at {addTheCommas(observerDistance)}{' '}
              {<QACalculatorIconUnit unit="diameter" />}:{' '}
            </span>
            {addTheCommas(formatValue(overPressure, 1))}
            <QACalculatorIconUnit unit="overPressure" />
          </p>
          {/* <p className={boldText}>Air Blast Over Pressure damage:</p>
          <ul>
            {airBlastDamage &&
              airBlastDamage.map((damage, index) => (
                <li key={`damage-message-${index}`}>{damage}</li>
              ))}
          </ul> */}
        </div>
      )}
    </div>
  );
}

FindImpactCrater.propTypes = {
  asteroidDiameter: PropTypes.number,
  density: PropTypes.number,
  velocity: PropTypes.number,
  craterDiameter: PropTypes.number,
  craterDepth: PropTypes.number,
  richterMagnitudeAtObserverDistance: PropTypes.number,
  // mercalliIntensity: PropTypes.array,
  overPressure: PropTypes.number,
  // airBlastDamage: PropTypes.array,
  observerDistance: PropTypes.number,
};
