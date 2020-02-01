import React from 'react';
import PropTypes from 'prop-types';

import { setName, dataPoint } from './legend.module.scss';

class LegendItem extends React.PureComponent {
  render() {
    const { name, color } = this.props;

    return (
      <div className={`container-flex centered spaced ${name}`}>
        <div className={setName}>{name}</div>
        <div className={dataPoint} style={{ backgroundColor: color }}></div>
      </div>
    );
  }
}

LegendItem.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
};

export default LegendItem;
