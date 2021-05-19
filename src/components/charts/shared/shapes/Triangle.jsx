import React from 'react';
import PropTypes from 'prop-types';

class Triangle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.padding = 4;
  }

  render() {
    const { width: initWidth, classes, fillColor } = this.props;
    const width = initWidth - this.padding / 2;

    const height = (1 / 2) * Math.sqrt(3) * width;

    return (
      <polygon
        className={classes}
        points={`${initWidth / 2},${this.padding / 2} ${width},${height} ${this
          .padding / 2},${height}`}
        fill={fillColor}
        stroke={fillColor}
        tabIndex="0"
      />
    );
  }
}

Triangle.propTypes = {
  width: PropTypes.number,
  classes: PropTypes.string,
  fillColor: PropTypes.string,
};

export default Triangle;
