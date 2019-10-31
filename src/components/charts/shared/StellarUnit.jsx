import React from 'react';
import PropTypes from 'prop-types';

class StellarUnit extends React.PureComponent {
  renderSvgUnit(type) {
    if (type === 'temperature') {
      return <tspan className="unit">&nbsp;K</tspan>;
    }
    if (type === 'luminosity') {
      return (
        <tspan className="unit">
          &nbsp;L<tspan baselineShift="sub">&#8857;</tspan>
        </tspan>
      );
    }
    if (type === 'mass') {
      return (
        <tspan className="unit">
          &nbsp;M<tspan baselineShift="sub">&#8857;</tspan>
        </tspan>
      );
    }
    if (type === 'lifetime') {
      return <tspan className="unit">&nbsp;Gyr</tspan>;
    }
    if (type === 'radius') {
      return (
        <tspan className="unit">
          &nbsp;R<tspan baselineShift="sub">&#8857;</tspan>
        </tspan>
      );
    }
    if (type === 'count') {
      return <tspan className="unit">&nbsp;stars</tspan>;
    }

    return null;
  }

  renderUnit(type) {
    if (type === 'temperature') {
      return <span className="unit">&nbsp;K</span>;
    }
    if (type === 'luminosity') {
      return (
        <span className="unit">
          &nbsp;L<sub>&#8857;</sub>
        </span>
      );
    }
    if (type === 'mass') {
      return (
        <span className="unit">
          &nbsp;M<sub>&#8857;</sub>
        </span>
      );
    }
    if (type === 'lifetime') {
      return <span className="unit">&nbsp;Gyr</span>;
    }
    if (type === 'radius') {
      return (
        <span className="unit">
          &nbsp;R<sub>&#8857;</sub>
        </span>
      );
    }
    if (type === 'count') {
      return <span className="unit">&nbsp;stars</span>;
    }
    return null;
  }

  render() {
    const { type, isSvg } = this.props;
    if (isSvg) {
      return this.renderSvgUnit(type);
    }

    return this.renderUnit(type);
  }
}

StellarUnit.propTypes = {
  type: PropTypes.string,
  isSvg: PropTypes.bool,
};

export default StellarUnit;
