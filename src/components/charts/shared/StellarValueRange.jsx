import React from 'react';
import PropTypes from 'prop-types';
import StellarValue from './StellarValue';

class StellarValueRange extends React.PureComponent {
  render() {
    const { type, data } = this.props;

    return (
      <>
        <StellarValue type={type} value={data[0]} />
        <span> – </span>
        <StellarValue type={type} value={data[1]} />
      </>
    );
  }
}

StellarValueRange.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
};

export default StellarValueRange;
