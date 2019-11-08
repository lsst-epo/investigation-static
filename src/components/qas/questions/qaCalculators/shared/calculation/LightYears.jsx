import React from 'react';
import PropTypes from 'prop-types';
import { addTheCommas } from '../../../../../../lib/utilities';

export default function LightYears({ value }) {
  return <p>Light Years (ly) = {value ? addTheCommas(+value) : '?'}</p>;
}

LightYears.propTypes = {
  value: PropTypes.number,
};
