import React from 'react';
import PropTypes from 'prop-types';
import StellarValue from './StellarValue';

class StellarValueRange extends React.PureComponent {
  render() {
    const { type, data, className } = this.props;

    return (
      <div className={className}>
        <StellarValue type={type} value={data[0]} />
        <span> – </span>
        <StellarValue type={type} value={data[1]} />
      </div>
    );
  }
}

StellarValueRange.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  className: PropTypes.string,
};

export default StellarValueRange;
