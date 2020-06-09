import React from 'react';
import PropTypes from 'prop-types';

class CursorPoint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.svgEl = React.createRef();
  }

  render() {
    const { x, y, pointClasses, fill, offsetTop } = this.props;

    return (
      <circle
        ref={this.svgEl}
        className={pointClasses}
        cx={x}
        cy={y + offsetTop}
        r={12}
        fill={fill || '#828287'}
        stroke="transparent"
        tabIndex="0"
      />
    );
  }
}

CursorPoint.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  pointClasses: PropTypes.string,
  offsetTop: PropTypes.number,
};

export default CursorPoint;
