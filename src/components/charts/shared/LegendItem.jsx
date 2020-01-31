import React from 'react';
import PropTypes from 'prop-types';

class LegendItem extends React.PureComponent {
  render() {
    const { key, name, color } = this.props;

    return (
      <div key={key} className={`container-flex centered spaced ${name}`}>
        <div className="set-name">{name}</div>
        <div className="data-point" style={{ backgroundColor: color }}></div>
      </div>
    );
  }
}

LegendItem.propTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
};

export default LegendItem;
