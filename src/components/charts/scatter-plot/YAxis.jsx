import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisLeft as d3AxisLeft } from 'd3-axis';

class YAxis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.yAxisContainer = React.createRef();
  }

  componentDidUpdate() {
    const { scale } = this.props;
    const numTicks = scale.domain().reduce(this.reducer);
    const yAxis = d3AxisLeft(scale).ticks(numTicks);
    const $yAxis = d3Select(this.yAxisContainer.current);

    $yAxis
      .call(yAxis)
      .selectAll('.tick')
      .each(function renderTick(d) {
        const base = Math.log10(d) === 0 ? 1 : 10;
        const exponent = Math.log10(d);

        if (base % 1 === 0 && exponent % 1 === 0) {
          d3Select(this)
            .select('text')
            .text(function renderTickBase() {
              return base;
            })
            .append('tspan')
            .attr('dy', '-1%')
            .classed('sup-text', true)
            .text(function renderTickExp() {
              return exponent === 0 ? '' : exponent;
            });
        } else {
          d3Select(this).remove();
        }
      });
  }

  getAbsPow(value) {
    return Math.abs(Math.log10(value));
  }

  reducer = (accumulator, current) => {
    return this.getAbsPow(accumulator) + this.getAbsPow(current);
  };

  render() {
    const { height, padding, label, offsetTop } = this.props;

    return (
      <React.Fragment>
        <g
          key="y-axis"
          className="y-axis axis"
          transform={`translate(${padding}, ${offsetTop})`}
          ref={this.yAxisContainer}
        />
        <text
          key="y-axis-label"
          className="y-axis-label"
          transform={`translate(${padding * 0.33},
           ${(height - padding + offsetTop) / 2}) rotate(-90)`}
          style={{ textAnchor: 'middle' }}
        >
          {label}
          <tspan className="sub-text">&#x2299;</tspan>
        </text>
      </React.Fragment>
    );
  }
}

YAxis.propTypes = {
  label: PropTypes.string,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  scale: PropTypes.any,
};

export default YAxis;
