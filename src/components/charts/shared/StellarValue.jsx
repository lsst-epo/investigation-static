import React from 'react';
import PropTypes from 'prop-types';
import { getValue } from '../../../lib/utilities.js';
import Unit from './unit/index.jsx';

class StellarValue extends React.PureComponent {
  render() {
    const { type, value, isSvg } = this.props;
    const tempValue = getValue(type, value);
    const formattedValue = isNaN(tempValue) ? value : tempValue; // eslint-disable-line no-restricted-globals

    return (
      <>
        {!isSvg && <span>{formattedValue}</span>}
        {isSvg && <tspan>{formattedValue}</tspan>}
        {/* eslint-disable no-restricted-globals */}
        {!isNaN(formattedValue) && <Unit type={type} isSvg={isSvg} />}
        {/* eslint-enable no-restricted-globals */}
      </>
    );
  }
}

StellarValue.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any,
  isSvg: PropTypes.bool,
};

export default StellarValue;
