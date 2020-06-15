import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas, formatValue } from '../../../../../../lib/utilities';
import {
  color,
  equation,
  fraction,
  denominator,
  exponent,
} from './equation.module.scss';

export default function FindVolume(props) {
  const { radius, volume } = props;

  return (
    <p className={equation}>
      <span>V = </span>
      <span>(</span>
      <span className={fraction}>
        <span className="numerator">4</span>
        <span className={denominator}>3</span>
      </span>
      {` * `}
      <span>
        <span className={color}> π</span>
        <span>)</span>
        {` * `}
        <span className={color}>
          {radius ? addTheCommas(radius) : 'v'}&nbsp;
        </span>
        <span className={exponent}>3</span>
      </span>
      <span>= </span>
      <span className={color}>
        {volume ? addTheCommas(formatValue(volume, 2)) : '?'}
      </span>
    </p>
  );
}

FindVolume.propTypes = {
  volume: PropTypes.number,
  radius: PropTypes.number,
};
