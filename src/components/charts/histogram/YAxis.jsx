import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisLeft as d3AxisLeft } from 'd3-axis';

class YAxis extends React.Component {
  constructor(props) {
    super(props);

    this.yAxisContainer = React.createRef();
  }

  componentDidMount() {
    const { scale } = this.props;
    const yAxis = d3AxisLeft(scale).ticks(10);
    const $yAxis = d3Select(this.yAxisContainer.current);

    $yAxis.call(yAxis);
  }

  render() {
    const { height, padding, label, offsetTop } = this.props;

    return (
      <>
        <g
          key="y-axis"
          className="y-axis axis"
          transform={`translate(${padding}, ${offsetTop})`}
          ref={this.yAxisContainer}
        />
        <text
          key="y-axis-label"
          className="y-axis-label"
          transform={`translate(${15},
           ${(height - padding + offsetTop) / 2}) rotate(-90)`}
          style={{ textAnchor: 'middle' }}
        >
          {label}
        </text>
      </>
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
