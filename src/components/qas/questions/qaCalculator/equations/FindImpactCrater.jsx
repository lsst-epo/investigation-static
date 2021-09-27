/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  addTheCommas,
  toSigFigs,
  scientificNotation,
} from '../../../../../lib/utilities.js';
import { QACalculatorIcon, QACalculatorIconUnit } from '../qQaCalculatorIcons';
import {
  color,
  equation,
  fraction,
  denominator,
} from '../qaCalculator.module.scss';
import {
  findImpactCraterEquation,
  boldText,
  craterDiameterStyle,
  craterDepthStyle,
} from './equations.module.scss';

export default function FindImpactCrater(props) {
  const {
    asteroidDiameter,
    density,
    velocity,
    craterDiameter,
    craterDepth,
    kineticEnergy,
  } = props;

  return (
    <div className={findImpactCraterEquation} data-testid="qa-calc-impact">
      <p>
        <span className={boldText}>KE = </span>
        {kineticEnergy ? (
          <>
            <span
              className={`highlight ${color}`}
              dangerouslySetInnerHTML={scientificNotation(+kineticEnergy, 3)}
            ></span>
            <QACalculatorIconUnit unit="kineticEnergy" />
          </>
        ) : (
          <span>?</span>
        )}
      </p>
      <div>
        <p className={boldText}>Crater Diameter:</p>
        <p className={classnames('equation', equation, craterDiameterStyle)}>
          <QACalculatorIcon content="D<sub>c</sub> = " />
          <span>0.0461 &times; </span>
          <span className={`highlight ${color}`}>
            {!density ? <span>&#x1D780;</span> : addTheCommas(density)}
            {density && (
              <QACalculatorIconUnit
                className={`highlight ${color}`}
                tiny
                unit="density"
              />
            )}
          </span>
          <sup>1/3</sup>
          <span> &times; </span>
          <span className={`highlight ${color}`}>
            {!asteroidDiameter ? (
              <span>
                D<sub>a</sub>
              </span>
            ) : (
              addTheCommas(asteroidDiameter)
            )}
          </span>
          {asteroidDiameter && (
            <QACalculatorIconUnit
              className={`highlight ${color}`}
              tiny
              unit="diameter"
            />
          )}
          <sup>0.78</sup>
          <span> &times; </span>
          <span className={`highlight ${color}`}>
            {!velocity ? 'v' : addTheCommas(velocity)}
          </span>
          {velocity && (
            <QACalculatorIconUnit
              className={`highlight ${color}`}
              tiny
              unit="velocity"
            />
          )}
          <sup>0.44</sup>
          <span> = </span>
          <span>
            {craterDiameter ? (
              <span>
                {addTheCommas(toSigFigs(craterDiameter, 3))}
                <QACalculatorIconUnit unit="craterDiameter" />
              </span>
            ) : (
              <span>?</span>
            )}
          </span>
        </p>
      </div>
      <div>
        <p className={boldText}>Crater Depth:</p>
        <p className={craterDepthStyle}>
          <QACalculatorIcon content="d<sub>c</sub> = " />
          <span className={fraction}>
            <span className={`highlight numerator ${color}`}>
              {craterDiameter ? (
                <span>
                  {addTheCommas(toSigFigs(craterDiameter, 3))}
                  <QACalculatorIconUnit
                    className={`highlight ${color}`}
                    tiny
                    unit="craterDiameter"
                  />
                </span>
              ) : (
                <QACalculatorIcon
                  className={`highlight ${color}`}
                  content="D<sub>c</sub>"
                />
              )}
            </span>
            <span className={denominator}>2 &radic; 2</span>
          </span>
          <span> = </span>
          <span>
            {craterDepth ? (
              <span>
                {addTheCommas(toSigFigs(craterDepth, 3))}
                <QACalculatorIconUnit tiny unit="craterDiameter" />
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

FindImpactCrater.propTypes = {
  asteroidDiameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  density: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  velocity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  craterDiameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  craterDepth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  kineticEnergy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
