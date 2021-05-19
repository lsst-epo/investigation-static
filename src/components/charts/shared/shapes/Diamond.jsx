import React from 'react';
import PropTypes from 'prop-types';

class Diamond extends React.PureComponent {
  constructor(props) {
    super(props);

    this.padding = 5;
  }

  render() {
    const {
      height: initHeight,
      width: initWidth,
      classes,
      fillColor,
    } = this.props;

    const height = initHeight - 4.5 - this.padding;
    const width = initWidth - 4.5 - this.padding;

    const rotateWidth = this.padding + width / 2;
    const rotateHeight = this.padding + height / 2;

    return (
      <rect
        className={classes}
        x={this.padding}
        y={this.padding}
        height={height}
        width={width}
        fill={fillColor}
        transform={`rotate(45 ${rotateWidth} ${rotateHeight})`}
        stroke={fillColor}
        tabIndex="0"
      />
    );
  }
}

Diamond.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  classes: PropTypes.string,
  fillColor: PropTypes.string,
};

export default Diamond;
