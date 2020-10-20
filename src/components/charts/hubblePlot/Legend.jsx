import React from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '../../../lib/utilities.js';
import { legend, name } from './hubble-plot.module.scss';

class Legend extends React.PureComponent {
  render() {
    const { slope, hubbleConstant } = this.props;
    const legendSlope =
      slope || hubbleConstant
        ? `Slope ${formatValue(slope || hubbleConstant, 1)}`
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
