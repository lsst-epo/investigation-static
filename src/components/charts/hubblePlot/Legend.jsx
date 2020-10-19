import React from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '../../../lib/utilities.js';
import { legend, name } from './hubble-plot.module.scss';

class Legend extends React.PureComponent {
  render() {
    const { slope, hubbleConstant } = this.props;

    return (
      <div className={legend}>
        {slope && (
          <div className={name}>
            Slope: {formatValue(slope || hubbleConstant, 1)}
          </div>
        )}
      </div>
    );
  }
}

Legend.propTypes = {
  slope: PropTypes.number,
  hubbleConstant: PropTypes.number,
};

export default Legend;
