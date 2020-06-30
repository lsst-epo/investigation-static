import React from 'react';
import PropTypes from 'prop-types';

class Point extends React.PureComponent {
  render() {
    const { x, y, classes } = this.props;

    return (
      <circle
        ref={this.svgEl}
        className={classes}
        cx={x}
        cy={y}
        r={2}
        tabIndex="0"
      />
    );
  }
}

Point.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  classes: PropTypes.string,
};

export default Point;
