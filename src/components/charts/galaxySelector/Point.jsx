import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { select as d3Select } from 'd3-selection';
import { easeElastic as d3EaseElastic } from 'd3-ease';
import { galaxy, selected } from './galaxy-selector.module.scss';

class Point extends React.PureComponent {
  constructor(props) {
    super(props);

    this.svgEl = React.createRef();
  }

  componentDidUpdate() {
    const { isActive, id, radius } = this.props;
    const $point = d3Select(this.svgEl.current);
    const baseRadius = this.getRadius(id, radius);

    if (isActive) {
      $point
        .transition()
        .duration(800)
        .ease(d3EaseElastic)
        .attr('r', baseRadius < 10 ? 10 : baseRadius * 1.2);
    } else {
      $point
        .transition()
        .duration(400)
        .attr('r', baseRadius);
    }
  }

  getRadius(id, radius) {
    if (radius) {
      return Math.abs(radius);
    }

    return (
      {
        supernova: 20,
        galaxy: 40,
      }[id] || 8
    );
  }

  getStroke(isActive, isSelected, color) {
    if (isActive) {
      return '#fed828';
    }

    if (isSelected) {
      return color;
    }

    return 'transparent';
  }

  render() {
    const {
      isActive,
      isSelected,
      x,
      y,
      radius,
      color,
      classes,
      id,
    } = this.props;
    const pointClasses = classnames(
      galaxy,
      'data-point',
      `${id}-point`,
      classes,
      {
        [selected]: isSelected,
      }
    );

    return (
      <circle
        ref={this.svgEl}
        className={pointClasses}
        cx={x}
        cy={y}
        r={this.getRadius(id, radius)}
        fill="transparent"
        stroke={this.getStroke(isActive, isSelected, color)}
        strokeWidth={0}
      />
    );
  }
}

Point.propTypes = {
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  isActive: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  radius: PropTypes.number,
  classes: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Point;
