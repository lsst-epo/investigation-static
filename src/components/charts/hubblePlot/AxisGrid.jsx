import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from 'd3-axis';
import { axisGrid } from './hubble-plot.module.scss';

class AxisGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.yAxisGridContainer = React.createRef();
    this.xAxisGridContainer = React.createRef();
  }

  componentDidMount() {
    this.updateAxis();
  }

  componentDidUpdate() {
    this.updateAxis();
  }

  updateAxis() {
    const {
      xScale,
      yScale,
      height,
      width,
      xNumGridLines,
      yNumGridLines,
    } = this.props;

    const yAxisGrid = d3AxisLeft(yScale)
      .tickSize(-width)
      .tickFormat('')
      .ticks(yNumGridLines);
    const xAxisGrid = d3AxisBottom(xScale)
      .tickSize(-height)
      .tickFormat('')
      .ticks(xNumGridLines);

    const $yAxisGrid = d3Select(this.yAxisGridContainer.current);
    const $xAxisGrid = d3Select(this.xAxisGridContainer.current);

    $yAxisGrid.call(yAxisGrid);
    $xAxisGrid.call(xAxisGrid);
  }

  render() {
    const { height, padding, offsetTop } = this.props;

    return (
      <>
        <g
          key="y-axis-grid"
          className={`y-axis-grid ${axisGrid}`}
          transform={`translate(${padding}, ${offsetTop})`}
          ref={this.yAxisGridContainer}
        />
        <g
          key="x-axis-grid"
          className={`x-axis-grid ${axisGrid}`}
          transform={`translate(0, ${height - padding + offsetTop})`}
          ref={this.xAxisGridContainer}
        />
      </>
    );
  }
}

AxisGrid.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  xNumGridLines: PropTypes.number,
  yNumGridLines: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
};

export default AxisGrid;
