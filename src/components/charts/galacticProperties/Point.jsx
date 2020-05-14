import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { easeElastic as d3EaseElastic } from 'd3-ease';

class Point extends React.PureComponent {
  constructor(props) {
    super(props);

    this.baseRadius = 6;
    this.svgEl = React.createRef();
  }

  componentDidUpdate() {
    const { selected, hovered } = this.props;
    const $point = d3Select(this.svgEl.current);
    if (selected || hovered) {
      $point
        .transition()
        .duration(800)
        .ease(d3EaseElastic)
        .attr('r', this.baseRadius * 2);
    } else {
      $point
        .transition()
        .duration(400)
        .attr('r', this.baseRadius);
    }
  }

  render() {
    const { x, y, classes, fill } = this.props;
    const fillColor = fill || '#828287';

    return (
      <circle
        ref={this.svgEl}
        className={classes}
        cx={x}
        cy={y}
        r={this.baseRadius}
        fill={fillColor}
        stroke={fillColor}
        tabIndex="0"
      />
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
};

export default Point;
