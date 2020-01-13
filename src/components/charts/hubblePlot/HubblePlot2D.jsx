import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import classnames from 'classnames';
import {
  select as d3Select,
  event as d3Event,
  clientPoint as d3ClientPoint,
} from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Points from './Points';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import Legend from '../shared/Legend';
import styles from './hubble-plot.module.scss';

class HubblePlot2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selectedData: null,
      hoverPointData: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
      xScale: d3ScaleLinear()
        .domain(props.xDomain)
        .range([props.padding, props.width]),
      yScale: d3ScaleLinear()
        .domain(props.yDomain)
        .range([props.height - props.padding, 0]),
    };

    this.svgEl = React.createRef();
    this.svgContainer = React.createRef();
  }

  componentDidMount() {
    this.updateHubblePlot();
  }

  componentDidUpdate(prevProps) {
    // const { selectedData } = this.state;
    // const { data, isAnswered, preSelected } = this.props;
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.updateHubblePlot();
    }

    // if (isAnswered && !selectedData) {
    //   this.toggleSelection(data);
    // } else if (!isAnswered && !preSelected && selectedData) {
    //   this.clearSelection();
    // }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  clearGraph() {
    this.setState(prevState => ({
      ...prevState,
      hoverPointData: null,
      showTooltip: false,
      selectedData: null,
    }));
  }

  setSelection(d) {
    this.setState(prevState => ({
      ...prevState,
      selectedData: arrayify(d),
    }));
  }

  toggleSelection(d) {
    const { selectedData } = this.state;
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);

    const newState = {
      tooltipPosX: pointPos[0],
      tooltipPosY: pointPos[1],
      showLasso: false,
      showEraser: false,
      showTooltip: true,
      selectedData: arrayify(d),
    };

    if (includes(selectedData, d)) {
      newState.selectedData = null;
      newState.showTooltip = false;
    }

    this.setState(
      prevState => ({
        ...prevState,
        ...newState,
      }),
      () => {
        const { selectionCallback } = this.props;
        const { selectedData: newData } = this.state;

        if (selectionCallback) {
          selectionCallback(newData);
        }
      }
    );
  }

  // mouseover/focus handler for point
  onMouseOver = d => {
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);

    // add hover style on point and show tooltip
    this.setState(prevState => ({
      ...prevState,
      hoverPointData: arrayify(d),
      tooltipPosX: pointPos[0],
      tooltipPosY: pointPos[1],
      showTooltip: true,
    }));
  };

  // mouseout/blur handler for point
  onMouseOut = () => {
    const { selectedData } = this.state;

    // remove hover style on point but don't hide tooltip
    this.setState(prevState => ({
      ...prevState,
      hoverPointData: null,
      showTooltip: !!selectedData,
    }));
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    const $hubblePlot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    $hubblePlot.on('click', () => {
      // remove styles and selections when click on non-point
      const pointData = d3Select(d3Event.target).datum();

      if (pointData) {
        this.toggleSelection(pointData);
      } else {
        this.clearGraph();
      }
    });

    // add event listeners to points
    $allPoints
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);
  }

  // add event listeners to Scatterplot and Points
  removeEventListeners() {
    const $hubblePlot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');
    $hubblePlot.on('click', null);

    $allPoints.on('mouseover', null).on('mouseout', null);
  }

  updatePoints() {
    const { data, preSelected, multiple } = this.props;
    const { loading } = this.state;

    if (!data) {
      return;
    }

    if (isEmpty(data) && preSelected && loading) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else if (multiple) {
      data.forEach((supernova, i) => {
        if (i === data.length - 1) {
          d3Select(this.svgEl.current)
            .selectAll(`.data-point.${supernova.className}`)
            .data(supernova.data)
            .transition()
            .end()
            .then(() => {
              if (loading) {
                this.setState(prevState => ({
                  ...prevState,
                  loading: false,
                }));
              }
            });
        } else {
          d3Select(this.svgEl.current)
            .selectAll(`.data-point${supernova.className}`)
            .data(supernova.data);
        }
      });
    } else {
      d3Select(this.svgEl.current)
        .selectAll('.data-point')
        .data(data)
        .transition()
        .end()
        .then(() => {
          if (loading) {
            this.setState(prevState => ({
              ...prevState,
              loading: false,
            }));
          }
        });
    }
  }

  // bind data to elements and add styles and attributes
  updateHubblePlot() {
    const { preSelected } = this.props;
    this.updatePoints();

    if (!preSelected) {
      this.addEventListeners();
    }
  }

  render() {
    const {
      data,
      width,
      height,
      multiple,
      padding,
      offsetTop,
      offsetRight,
      xValueAccessor,
      yValueAccessor,
      xAxisLabel,
      yAxisLabel,
      legend,
      name,
      tooltipAccessors,
      tooltipLabels,
    } = this.props;

    const {
      xScale,
      yScale,
      loading,
      selectedData,
      hoverPointData,
      tooltipPosX,
      tooltipPosY,
      showTooltip,
    } = this.state;

    const svgClasses = classnames('svg-chart', styles.hubblePlot, {
      loading,
      loaded: !loading,
    });

    return (
      <>
        <h2 className="space-bottom">Hubble Plot</h2>
        <div
          ref={this.svgContainer}
          className={`svg-container ${styles.hubblePlotContainer}`}
        >
          {loading && (
            <CircularProgress
              id={`${name}-loader`}
              className="chart-loader"
              scale={3}
            />
          )}
          {legend && !loading && <Legend content={legend} />}
          <Tooltip
            key="tooltip"
            data={selectedData || hoverPointData}
            posX={tooltipPosX}
            posY={tooltipPosY}
            show={showTooltip}
            accessors={tooltipAccessors}
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
            <g clipPath="url('#clip')" className="data-points">
              {data &&
                multiple &&
                data.map((set, i) => {
                  const key = `points-${set.className}-${i}`;
                  return (
                    <Points
                      key={key}
                      pointClasses={set.className}
                      data={set.data}
                      selectedData={selectedData}
                      xScale={xScale}
                      yScale={yScale}
                      xValueAccessor={xValueAccessor}
                      yValueAccessor={yValueAccessor}
                    />
                  );
                })}
              {data && !multiple && (
                <Points
                  data={data}
                  selectedData={selectedData}
                  xScale={xScale}
                  yScale={yScale}
                  xValueAccessor={xValueAccessor}
                  yValueAccessor={yValueAccessor}
                  pointClasses={styles.galaxyPoint}
                />
              )}
            </g>
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
          </svg>
        </div>
      </>
    );
  }
}

HubblePlot2D.defaultProps = {
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 0,
  xDomain: [0, 300],
  yDomain: [0, 18000],
  xValueAccessor: 'distance',
  yValueAccessor: 'velocity',
  xAxisLabel: 'Distance (Mpc)',
  yAxisLabel: 'Velocity (Km/s)',
  tooltipAccessors: ['name', 'distance', 'velocity'],
  tooltipLabels: ['Galaxy', 'Distance', 'Velocity'],
};

HubblePlot2D.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  data: PropTypes.array,
  // isAnswered: PropTypes.bool,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
  name: PropTypes.string,
  selectionCallback: PropTypes.func,
};

export default HubblePlot2D;
