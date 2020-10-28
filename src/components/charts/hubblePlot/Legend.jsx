import React from 'react';
import PropTypes from 'prop-types';
import Unit from '../shared/unit/index.jsx';
import { formatValue } from '../../../lib/utilities.js';
import { legend, name } from './hubble-plot.module.scss';

class Legend extends React.PureComponent {
  formatSlope(value) {
    return (
      <span>
        Slope {formatValue(value, 1)} <Unit type="hubbleConstant" />
      </span>
    );
  }

  render() {
    const { slope, hubbleConstant } = this.props;
    const legendSlope =
      slope || hubbleConstant
        ? this.formatSlope(slope || hubbleConstant)
        : 'Click & Drag To Add A TrendLine';

    return (
      <div className={legend}>
        <div className={name}>{legendSlope}</div>
      </div>
    );
  }
}

Legend.propTypes = {
  slope: PropTypes.number,
  hubbleConstant: PropTypes.number,
};

export default Legend;
