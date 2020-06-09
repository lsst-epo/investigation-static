import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { select as d3Select } from 'd3-selection';

import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3OrdinalScale,
} from 'd3-scale';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { extentFromSet, getMean } from '../../../lib/utilities.js';
import Points from './Points';
import Point from './Point';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import Region from '../shared/region/index.jsx';

import styles from './asteroid-class.module.scss';

class AsteroidClass extends React.Component {
  constructor(props) {
    super(props);

    this.filters = ['g', 'r', 'i', 'z'];

    this.state = {
      loading: true,
      userData: null,
      selectedData: null,
      hoveredData: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
      xScale: this.getXScale(),
      yScale: this.getYScale(),
      mins: null,
      maxs: null,
      means: null,
    };

    this.svgEl = React.createRef();
    this.svgContainer = React.createRef();
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.getSetSummary(data, this.updatePoints);
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    const isNewData = prevProps.data !== data;

    if (isNewData) {
      this.getSetSummary(data, this.updatePoints);
    }
  }

  getSetSummary(data, callback) {
    this.setState(
      prevState => ({
        ...prevState,
        ...this.getSummary(data),
      }),
      callback
    );
  }

  getSummary(data) {
    const summary = { mins: {}, maxs: {}, means: {} };
    this.filters.forEach(filter => {
      const extent = extentFromSet(data, filter);
      summary.mins[filter] = extent[0];
      summary.maxs[filter] = extent[1];
      summary.means[filter] = getMean(data, filter);
    });

    return summary;
  }

  getXScale() {
    const { width, padding } = this.props;
    const rangeDist = width + padding;
    const increment = rangeDist / this.filters.length;
    const range = this.filters.map((d, i) => {
      return padding + i * increment;
    });

    return d3OrdinalScale()
      .domain(this.filters)
      .range(range);
  }

  getYScale(min = 1.0, max = 4.0) {
    const { height, padding } = this.props;
    return d3ScaleLinear()
      .domain([min, max])
      .range([height - padding, 0]);
  }

  updatePoints() {
    // const { data, preSelected, options } = this.props;
    const { data, preSelected } = this.props;
    const { loading } = this.state;
    // const { multiple } = options || {};

    if (!data) {
      return;
    }

    const $asteroidClass = d3Select(this.svgEl.current);

    if (isEmpty(data) && preSelected && loading) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else {
      $asteroidClass.selectAll('.data-point').data(data);

      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }
  }

  getRegionPoints() {
    const { mins, maxs } = this.state;
    const points = [];
    [mins, maxs].forEach((summarySet, i) => {
      this.filters.forEach(filter => {
        if (i > 0) {
          points.unshift({ x: filter, y: summarySet[filter] });
        } else {
          points.push({ x: filter, y: summarySet[filter] });
        }
      });
    });

    return points;
  }

  render() {
    const {
      data,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      xAxisLabel,
      yAxisLabel,
      name,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      // options,
    } = this.props;

    const {
      xScale,
      yScale,
      loading,
      selectedData,
      hoveredData,
      tooltipPosX,
      tooltipPosY,
      showTooltip,
      maxs,
      mins,
      means,
    } = this.state;

    // const { multiple } = options || {};
    const svgClasses = classnames('svg-chart', styles.asteroidClass, {
      loading,
      loaded: !loading,
    });

    return (
      <>
        <div
          ref={this.svgContainer}
          className={`svg-container ${styles.asteroidClassContainer}`}
        >
          {loading && (
            <CircularProgress
              id={`${name}-loader`}
              className="chart-loader"
              scale={3}
            />
          )}
          <Tooltip
            key="tooltip"
            data={selectedData || hoveredData}
            posX={tooltipPosX}
            posY={tooltipPosY}
            show={showTooltip}
            accessors={tooltipAccessors}
            units={tooltipUnits}
            labels={tooltipLabels}
          />
          <svg
            className={svgClasses}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${width} ${height}`}
            ref={this.svgEl}
            style={{
              opacity: 0,
            }}
          >
            <defs>
              <clipPath id="clip">
                <rect
                  x={padding}
                  y={offsetTop}
                  width={width - padding - offsetRight}
                  height={height - padding}
                />
              </clipPath>
            </defs>
            <XAxis
              label={xAxisLabel}
              height={height}
              width={width}
              padding={padding}
              offsetTop={offsetTop}
              offsetRight={offsetRight}
              scale={xScale}
            />
            <YAxis
              label={yAxisLabel}
              height={height}
              padding={padding}
              offsetTop={offsetTop}
              scale={yScale}
            />
            {maxs && mins && (
              <Region
                type="summary"
                points={this.getRegionPoints()}
                xValueAccessor="x"
                yValueAccessor="y"
                {...{ xScale, yScale, offsetTop, offsetRight }}
              />
            )}
            {data && (
              <Points
                {...{
                  data,
                  xScale,
                  yScale,
                  selectedData,
                  hoveredData,
                  offsetTop,
                }}
                pointClasses={classnames(styles.point)}
              />
            )}
            {mins &&
              maxs &&
              means &&
              this.filters.map(filter => {
                return (
                  <g key={`${filter}-summary-points`}>
                    <Point
                      x={xScale(filter)}
                      y={yScale(mins[filter]) + offsetTop}
                      fill="#074a9c"
                    />
                    <Point
                      x={xScale(filter)}
                      y={yScale(means[filter]) + offsetTop}
                      fill="#074a9c"
                    />
                    <Point
                      x={xScale(filter)}
                      y={yScale(maxs[filter]) + offsetTop}
                      fill="#074a9c"
                    />
                  </g>
                );
              })}
            {means &&
              this.filters.map((filter, i) => {
                const nextFilter = this.filters[i + 1];
                if (!nextFilter) return null;
                return (
                  <line
                    key={`summary-line-${filter}-${nextFilter}`}
                    x1={xScale(filter)}
                    y1={yScale(means[filter]) + offsetTop}
                    x2={xScale(nextFilter)}
                    y2={yScale(means[nextFilter]) + offsetTop}
                    strokeWidth={1}
                    stroke="#074a9c"
                  />
                );
              })}
          </svg>
        </div>
      </>
    );
  }
}

AsteroidClass.defaultProps = {
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 0,
  xDomain: [0, 28],
  yDomain: [0, 200],
  xValueAccessor: 'distance',
  yValueAccessor: 'brightness',
  xAxisLabel: 'Distance (Billion LY)',
  yAxisLabel: 'Observed Brightness',
  tooltipAccessors: ['distance', 'brightness'],
  tooltipUnits: ['Billion Ly'],
  tooltipLabels: ['Distance', 'Brightness'],
};

AsteroidClass.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  data: PropTypes.array,
  activeGalaxy: PropTypes.object,
  options: PropTypes.object,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  tooltipAccessors: PropTypes.array,
  tooltipUnits: PropTypes.array,
  tooltipLabels: PropTypes.array,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  domain: PropTypes.array,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  preSelected: PropTypes.bool,
  name: PropTypes.string,
  selectionCallback: PropTypes.func,
};

export default AsteroidClass;
