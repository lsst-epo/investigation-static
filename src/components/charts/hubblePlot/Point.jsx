import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { easeElastic as d3EaseElastic } from 'd3-ease';
import PointLabel from './PointLabel';

class Point extends React.PureComponent {
  constructor(props) {
    super(props);

    this.baseRadius = 6;
    this.baseDiameter = this.baseRadius * 2;
    this.svgEl = React.createRef();
  }

  componentDidUpdate() {
    const { selected, hovered } = this.props;
    const $point = d3Select(this.svgEl.current);
    if (selected || hovered) {
      $point
        .raise()
        .transition()
        .duration(800)
        .ease(d3EaseElastic)
        .attr('r', this.baseDiameter);
    } else {
      $point
        .transition()
        .duration(400)
        .attr('r', this.baseRadius);
    }
  }

  render() {
    const { x, y, classes, fill, label, selected, hovered } = this.props;

    return (
      <g>
        <circle
          ref={this.svgEl}
          className={classes}
          cx={x}
          cy={y}
          r={this.baseRadius}
          strokeWidth={1}
          fill={fill || '#525459'}
          stroke="transparent"
          tabIndex="0"
        />
        {label && (
          <PointLabel
            {...{ label, selected, hovered }}
            x={x + this.baseDiameter + this.baseRadius}
            y={y + this.baseRadius}
          />
        )}
      </g>
    );
  }
}

Point.propTypes = {
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  classes: PropTypes.string,
  fill: PropTypes.string,
  label: PropTypes.string,
};

export default Point;
