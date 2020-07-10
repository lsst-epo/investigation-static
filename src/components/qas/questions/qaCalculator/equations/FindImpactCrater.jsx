import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../lib/utilities.js';
import { QACalculatorIcon, QACalculatorIconUnit } from '../qQaCalculatorIcons';
import {
  color,
  equation,
  fraction,
  denominator,
} from '../qaCalculator.module.scss';

export default function FindKineticEnergy(props) {
  const { asteroidDiameter, density, velocity, craterDiameter } = props;

  return (
    <p className={equation}>
      <span>
        <QACalculatorIcon content="D<sub>tc</sub> = " />
      </span>
      <span>1.161</span>
      <span>(</span>
      <span className={fraction}>
        <span className={`numerator ${color}`}>
          {!density ? 'p' : addTheCommas(density)}
          {density && (
            <QACalculatorIconUnit className={color} tiny unit="density" />
          )}
        </span>
        <span className={denominator}>2500</span>
      </span>
      <span>)</span>
      <span>
        <sup>
          <sup>1</sup>
          <span>/</span>
          <sub>3</sub>
        </sup>
      </span>
      <span> (</span>
      <span className={color}>
        {!asteroidDiameter ? 'D' : addTheCommas(asteroidDiameter)}
      </span>
      {asteroidDiameter && (
        <QACalculatorIconUnit className={color} tiny unit="diameter" />
      )}
      <sup>0.78</sup>
      <span>)(</span>
      <span className={color}>{!velocity ? 'v' : addTheCommas(velocity)}</span>
      {velocity && (
        <QACalculatorIconUnit className={color} tiny unit="velocity" />
      )}
      <sup>0.44</sup>
      <span>)(</span>
      <span>
        9.8
        <QACalculatorIconUnit tiny unit=" m/s" />
        <sup>-0.22</sup>
      </span>
      <span>)(</span>
      <span>
        sin
        <sup>
          <sup>1</sup>/<sub>3</sub>
        </sup>
        <span> 45˚</span>
      </span>
      <span>)</span>
      <br />
      <span>
        <QACalculatorIcon content="D<sub>tc</sub> = " />
        <span>
          {craterDiameter ? addTheCommas(formatValue(craterDiameter, 3)) : '?'}
          {craterDiameter && (
            <QACalculatorIconUnit tiny unit="craterDiameter" />
          )}
        </span>
      </span>
    </p>
  );
}

FindKineticEnergy.propTypes = {
  asteroidDiameter: PropTypes.number,
  density: PropTypes.number,
  velocity: PropTypes.number,
  craterDiameter: PropTypes.number,
};
