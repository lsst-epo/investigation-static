import React from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import { getValue, addTheCommas } from '../../../lib/utilities.js';
import Unit from './unit/index.jsx';

class StellarValue extends React.PureComponent {
  render() {
    const { type, value, isSvg } = this.props;
    const preformatted = getValue(type, value);
    const formatted = isNumber(preformatted)
      ? addTheCommas(preformatted)
      : preformatted;

    return (
      <>
        {!isSvg && <span>{formatted}</span>}
        {isSvg && <tspan>{formatted}</tspan>}
        {formatted && <Unit type={type} isSvg={isSvg} />}
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
