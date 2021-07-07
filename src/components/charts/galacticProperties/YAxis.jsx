import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisLeft as d3AxisLeft } from 'd3-axis';

class YAxis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.yAxisContainer = React.createRef();
  }

  componentDidMount() {
    this.updateAxis();
  }

  componentDidUpdate() {
    this.updateAxis();
  }

  updateAxis() {
    const { scale } = this.props;
    const yAxis = d3AxisLeft(scale);
    const $yAxis = d3Select(this.yAxisContainer.current);

    $yAxis.call(yAxis);
  }

  render() {
    const { height, padding, label, offsetTop } = this.props;

    return (
      <>
        {/* <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs> */}
        <g
          key="y-axis"
          className="y-axis axis"
          transform={`translate(${padding}, ${offsetTop})`}
          ref={this.yAxisContainer}
        />
        {/* <line
          x1={0}
          x2={0}
          y1={10}
          y2={10}
          transform={`translate(${padding - 10}, ${offsetTop +
            1}), rotate(-90)`}
          markerEnd="url(#arrowhead)"
        /> */}
        <text
          key="y-axis-label"
          className="y-axis-label"
          transform={`translate(${padding * 0.33},
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
