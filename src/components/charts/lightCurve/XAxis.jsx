import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisBottom as d3AxisBottom } from 'd3-axis';
import { mjdToUTC } from '../../../lib/utilities';

class XAxis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.xAxisContainer = React.createRef();
  }

  componentDidUpdate() {
    const { scale } = this.props;
    const xAxis = d3AxisBottom(scale);
    const $xAxis = d3Select(this.xAxisContainer.current);

    $xAxis
      .call(xAxis)
      .selectAll('.tick text')
      .each(function renderTick(d) {
        d3Select(this).text(mjdToUTC(d, 'MDY'));
      })
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '-0.03em')
      .attr('transform', 'rotate(-65)');
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
           ${height - padding * 0.08})`}
          style={{ textAnchor: 'middle' }}
        >
          {label}
        </text>
      </>
    );
  }
}

XAxis.propTypes = {
  label: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  scale: PropTypes.any,
};

export default XAxis;
