import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisBottom as d3AxisBottom } from 'd3-axis';
import { format as d3Format } from 'd3-format';

class XAxis extends React.Component {
  constructor(props) {
    super(props);

    this.xAxisContainer = React.createRef();
  }

  componentDidMount() {
    const { scale, valueAccessor } = this.props;
    const $xAxis = d3Select(this.xAxisContainer.current);

    if (valueAccessor === 'luminosity') {
      const scaleCopy = scale.copy();
      const oldDomain = scaleCopy.domain();
      const newDomain = [
        ...new Set(
          oldDomain.map((d, i) => {
            if (i === 0) {
              return Math.floor(d);
            }

            if (i === oldDomain.length - 1) {
              return Math.ceil(d);
            }

            return Math.round(d);
          })
        ),
      ];

      const augScale = scaleCopy.domain(newDomain);
      const xAxis = this.getAxis(augScale, valueAccessor);

      $xAxis
        .call(xAxis)
        .selectAll('.tick text')
        .text(d => {
          return d === 0 ? 1 : 10;
        })
        .append('tspan')
        .attr('baseline-shift', 'super')
        .text(d => {
          return d === 0 ? '' : d;
        });
    } else if (valueAccessor === 'lifetime') {
      const xAxis = this.getAxis(scale, valueAccessor);

      $xAxis
        .call(xAxis)
        .selectAll('.tick text')
        .text(d => {
          return Math.round(d / 1000000000);
        });
    } else {
      const xAxis = this.getAxis(scale, valueAccessor);

      $xAxis
        .call(xAxis)
        .selectAll('.tick text')
        .style('text-anchor', 'end')
        .attr('dx', '-0.8em')
        .attr('dy', '-0.03em')
        .attr('transform', 'rotate(-65)');
    }
  }

  getAxis(scale, valueAccessor) {
    if (valueAccessor === 'luminosity') {
      return d3AxisBottom(scale);
    }

    if (valueAccessor === 'mass') {
      return d3AxisBottom(scale).tickFormat(d3Format('0.01f'));
    }

    if (valueAccessor === 'eccentricity') {
      return d3AxisBottom(scale).tickFormat(d3Format('0.02f'));
    }

    return d3AxisBottom(scale);
  }

  render() {
    const {
      height,
      width,
      padding,
      label,
      offsetRight,
      offsetTop,
    } = this.props;

    return (
      <>
        <g
          key="x-axis"
          className="x-axis axis"
          transform={`translate(0, ${height - padding + offsetTop})`}
          ref={this.xAxisContainer}
        />
        <text
          key="x-axis-label"
          className="x-axis-label"
          transform={`translate(${(width + padding + offsetRight) / 2},
           ${height - padding * 0.15})`}
          style={{ textAnchor: 'middle' }}
        >
          {label}
        </text>
      </>
    );
  }
}

XAxis.propTypes = {
  label: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  scale: PropTypes.any,
  valueAccessor: PropTypes.string,
};

export default XAxis;
