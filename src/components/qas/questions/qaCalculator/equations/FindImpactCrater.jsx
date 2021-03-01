import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addTheCommas, toSigFigs } from '../../../../../lib/utilities.js';
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
  qaReviewHighlight,
} from './equations.module.scss';

export default function FindImpactCrater(props) {
  const {
    asteroidDiameter,
    density,
    velocity,
    craterDiameter,
    craterDepth,
    qaReview,
  } = props;

  const addColorClass = classnames({
    [color]: !qaReview,
    [qaReviewHighlight]: qaReview,
  });

  return (
    <div className={findImpactCraterEquation} data-testid="qa-calc-impact">
      <p className={boldText}>Crater Diameter:</p>
      <p className={classnames(equation, craterDiameterStyle)}>
        <QACalculatorIcon content="D<sub>c</sub> = " />
        <span>0.0461 &times; </span>
        <span className={addColorClass}>
          {!density ? <span>&#x1D780;</span> : addTheCommas(density)}
          {density && (
            <QACalculatorIconUnit
              className={addColorClass}
              tiny
              unit="density"
            />
          )}
        </span>
        <sup>1/3</sup>
        <span> &times; </span>
        <span className={addColorClass}>
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
            className={addColorClass}
            tiny
            unit="diameter"
          />
        )}
        <sup>0.78</sup>
        <span> &times; </span>
        <span className={addColorClass}>
          {!velocity ? 'v' : addTheCommas(velocity)}
        </span>
        {velocity && (
          <QACalculatorIconUnit
            className={addColorClass}
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
      <div>
        <p className={boldText}>Crater Depth:</p>
        <p className={craterDepthStyle}>
          <QACalculatorIcon content="d<sub>c</sub> = " />
          <span className={fraction}>
            <span className={`numerator ${addColorClass}`}>
              {craterDiameter ? (
                <span>
                  {addTheCommas(toSigFigs(craterDiameter, 3))}
                  <QACalculatorIconUnit
                    className={addColorClass}
                    tiny
                    unit="craterDiameter"
                  />
                </span>
              ) : (
                <QACalculatorIcon
                  className={addColorClass}
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
  qaReview: PropTypes.bool,
};
