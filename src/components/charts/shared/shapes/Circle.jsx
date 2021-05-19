import React from 'react';
import PropTypes from 'prop-types';

class Circle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.padding = 5;
  }

  render() {
    const { height: initHeight, classes, fillColor } = this.props;
    const height = initHeight - this.padding;
    const origin = initHeight / 2;
    const radius = height / 2.5;
    return (
      <circle
        ref={this.svgEl}
        className={classes}
        cx={origin}
        cy={origin}
        r={radius}
        fill={fillColor}
        stroke={fillColor}
        tabIndex="0"
      />
    );
  }
}

Circle.propTypes = {
  height: PropTypes.number,
  classes: PropTypes.string,
  fillColor: PropTypes.string,
};

export default Circle;
