import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { easeElastic as d3EaseElastic } from 'd3-ease';
import Circle from './Circle';
import Square from './Square';
import Triangle from './Triangle';
import Diamond from './Diamond';
import chartColors from '../../../../assets/stylesheets/_variables.scss';
import { capitalize } from '../../../../lib/utilities.js';

class SvgShape extends React.PureComponent {
  constructor(props) {
    super(props);

    this.svgEl = React.createRef();

    this.shapeComponents = {
      Circle,
      Square,
      Triangle,
      Diamond,
    };
  }

  componentDidUpdate() {
    const { selected, hovered, x, y, height, width } = this.props;
    const $point = d3Select(this.svgEl.current);
    if (selected || hovered) {
      $point
        .transition()
        .duration(800)
        .ease(d3EaseElastic)
        .attr('x', x - height)
        .attr('y', y - width)
        .attr('height', height * 2)
        .attr('width', width * 2);
    } else {
      $point
        .transition()
        .duration(0)
        .attr('x', x - height / 2)
        .attr('y', y - width / 2)
        .attr('height', height)
        .attr('width', width);
    }
  }

  render() {
    const {
      x,
      y,
      height,
      width,
      classes,
      svgShape,
      svgShapeIndex,
      fill,
    } = this.props;

    const fillColor = fill || chartColors.chart0;
    const SVGShape = svgShape
      ? this.shapeComponents[capitalize(svgShape)] ||
        this.shapeComponents.Circle
      : Object.values(this.shapeComponents)[svgShapeIndex || 0];

    return (
      <svg
        ref={this.svgEl}
        viewBox={`0 0 ${width} ${height}`}
        height={height}
        width={width}
        x={x - height / 2}
        y={y - width / 2}
      >
        <SVGShape
          {...{
            classes,
            fillColor,
            height,
            width,
          }}
        />
      </svg>
    );
  }
}

SvgShape.propTypes = {
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  shape: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  classes: PropTypes.string,
  fill: PropTypes.string,
  svgShape: PropTypes.string,
  svgShapeIndex: PropTypes.number,
};

export default SvgShape;
