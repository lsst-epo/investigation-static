import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisLeft as d3AxisLeft } from 'd3-axis';
import { axis } from './hubble-plot.module.scss';

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
        <g
          key="y-axis"
          className={`y-axis ${axis}`}
          transform={`translate(${padding}, ${offsetTop})`}
          ref={this.yAxisContainer}
        />
        <text
          key="y-axis-label"
          className="y-axis-label"
          transform={`translate(${padding * 0.18},
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
