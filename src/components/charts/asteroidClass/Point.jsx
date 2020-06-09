import React from 'react';
import PropTypes from 'prop-types';

class Point extends React.PureComponent {
  render() {
    const { x, y, classes, fill } = this.props;
    const fillColor = fill || '#828287';

    return (
      <circle
        ref={this.svgEl}
        className={classes}
        cx={x}
        cy={y}
        r={2}
        fill={fillColor}
        stroke={fillColor}
        tabIndex="0"
      />
    );
  }
}

Point.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  classes: PropTypes.string,
  fill: PropTypes.string,
};

export default Point;
