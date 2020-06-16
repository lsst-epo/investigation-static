import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../lib/utilities.js';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from '../qaCalculator.module.scss';

export default function FindVolume(props) {
  const { radius, volume } = props;
  const solution = volume ? addTheCommas(formatValue(volume, 2)) : '?';

  return (
    <p className={equation}>
      <span>V = </span>
      <span className={fraction}>
        <span className="numerator">4</span>
        <span className={denominator}>3</span>
      </span>
      <span>
        <span> π</span>
        <span> * </span>
        <span className={color}>
          {radius ? addTheCommas(radius) : 'v'}&nbsp;
        </span>
        <span className={exponent}>3</span>
      </span>
      <span>= </span>
      <span className={color}>
        {solution}
        {solution !== '?' && (
          <span>
            {' '}
            m<sup>3</sup>
          </span>
        )}
      </span>
    </p>
  );
}

FindVolume.propTypes = {
  volume: PropTypes.number,
  radius: PropTypes.number,
};
