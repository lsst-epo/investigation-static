import React from 'react';
import PropTypes from 'prop-types';
import { galaxyPoint } from './hubble-plot.module.scss';
import classnames from 'classnames';
import { invisible, notActive } from './hubble-plot.module.scss';

class CursorPoint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.baseRadius = 6;
    this.baseDiameter = this.baseRadius * 2;
    this.svgEl = React.createRef();
  }

  render() {
    const { x, y, pointClasses, index, fill, } = this.props;

    return (
      <g>
        <circle
          ref={this.svgEl}
          className={pointClasses}
          cx={x}
          cy={y}
          r={this.baseRadius}
          fill={fill || '#828287'}
          stroke="transparent"
          tabIndex="0"
        />
      </g>
    );
  }
}

CursorPoint.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  index: PropTypes.number,
  pointClasses: PropTypes.string,
};

export default CursorPoint;
