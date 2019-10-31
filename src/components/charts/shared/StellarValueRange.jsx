import React from 'react';
import PropTypes from 'prop-types';
import { extentFromSet } from '../../../lib/utilities.js';
import StellarValue from './StellarValue';

class StellarValueRange extends React.PureComponent {
  render() {
    const { type, data } = this.props;
    const minMax = extentFromSet(data, type);

    return (
      <>
        <StellarValue type={type} value={minMax[0]} />
        ` – `
        <StellarValue type={type} value={minMax[1]} />
      </>
    );
  }
}

StellarValueRange.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
};

export default StellarValueRange;
