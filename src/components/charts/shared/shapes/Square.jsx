import React from 'react';
import PropTypes from 'prop-types';

class Square extends React.PureComponent {
  constructor(props) {
    super(props);

    this.padding = 4;
  }

  render() {
    const { height, width, classes, fillColor } = this.props;
    return (
      <rect
        className={classes}
        x={this.padding}
        y={this.padding}
        height={height / 1.6}
        width={width / 1.6}
        fill={fillColor}
        stroke={fillColor}
        tabIndex="0"
      />
    );
  }
}

Square.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  classes: PropTypes.string,
  fillColor: PropTypes.string,
};

export default Square;
