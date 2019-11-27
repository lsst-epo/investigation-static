import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
// import { easeElastic as d3EaseElastic } from 'd3-ease';
import styles from './light-curve.module.scss';

class Point extends React.PureComponent {
  constructor(props) {
    super(props);

    this.baseSize = 3;
    this.svgEl = React.createRef();
  }

  componentDidUpdate() {
    this.updatePoint();
  }

  updatePoint() {
    const { selected, hovered } = this.props;
    const $point = d3Select(this.svgEl.current);

    if (selected || hovered) {
      $point.raise().attr('r', this.baseSize * 5);
    } else {
      $point
        .transition()
        .duration(400)
        .attr('r', this.baseSize);
    }
  }

  render() {
    const { x, y, errorYPos, errorYNeg, classes, fill } = this.props;

    return (
      <g>
        <line
          className="end-cap"
          x1={x - 4}
          y1={errorYPos}
          x2={x + 4}
          y2={errorYPos}
          stroke="#000000"
          strokeWidth="1"
        />
        <line
          className="error-range"
          x1={x}
          y1={errorYPos}
          x2={x}
          y2={errorYNeg}
          stroke="#000000"
          strokeWidth="1"
          strokeDasharray="3 1"
        />
        <line
          className="end-cap"
          x1={x - 4}
          y1={errorYNeg}
          x2={x + 4}
          y2={errorYNeg}
          stroke="#000000"
          strokeWidth="1"
        />
        <circle
          className={styles.proxyPoint}
          cx={x}
          cy={y}
          r={this.baseSize}
          strokeWidth={1}
          fill={fill}
          tabIndex="0"
        />
        <circle
          ref={this.svgEl}
          className={classes}
          cx={x}
          cy={y}
          r={this.baseSize * 5}
          strokeWidth={1}
          fill="transparent"
        />
      </g>
    );
  }
}

Point.propTypes = {
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  errorYPos: PropTypes.number,
  errorYNeg: PropTypes.number,
  classes: PropTypes.string,
  fill: PropTypes.string,
};

export default Point;
