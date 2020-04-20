import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisBottom as d3AxisBottom } from 'd3-axis';
import styles from './size-distance-plotter.module.scss';

class XAxis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.xAxisContainer = React.createRef();
  }

  componentDidMount() {
    this.updateAxis();
  }

  componentDidUpdate() {
    this.updateAxis();
  }

  updateAxis() {
    const { scale } = this.props;
    const xAxis = d3AxisBottom(scale);
    const $xAxis = d3Select(this.xAxisContainer.current);

    $xAxis.call(xAxis);
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
          className={styles.xAxisLabel}
          transform={`translate(${(width + padding + offsetRight) / 2},
           ${height - padding * 0.08})`}
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
