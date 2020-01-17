import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
// import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import classnames from 'classnames';
import {
  select as d3Select,
  event as d3Event,
  clientPoint as d3ClientPoint,
  mouse as d3mouse,
} from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Trendline from './Trendline.jsx';
import Points from './Points';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
// import Legend from '../shared/Legend';
import styles from './hubble-plot.module.scss';

class HubblePlot2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userData: null,
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
      hubbleConstant: null,
    };

    this.svgEl = React.createRef();
    this.svgContainer = React.createRef();
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.updateHubblePlot();
    }
  }

  componentDidUpdate(prevProps) {
    const { data, activeGalaxy } = this.props;
    const isNewData = prevProps.data !== data;
    const isNewActiveGalaxy = prevProps.activeGalaxy !== activeGalaxy;

    if (isNewData) {
      this.updateHubblePlot();
    }

    if (isNewActiveGalaxy) {
      this.updateSelectedData();
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  updateSelectedData() {
    const { activeGalaxy, data } = this.props;
    const activeData = find(data, d => {
      return activeGalaxy.name === d.name;
    });

    this.setState(prevState => ({
      ...prevState,
      selectedData: arrayify(activeData) || prevState.selectedData,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
    }));
  }

  clearSelection() {
    this.setState(prevState => ({
      ...prevState,
      hoverPointData: null,
      showTooltip: false,
      tooltipPosX: 0,
      tooltipPosY: 0,
      selectedData: null,
    }));
  }

  toggleSelection(d) {
    const { selectedData } = this.state;
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);

    const newState = {
      tooltipPosX: pointPos[0],
      tooltipPosY: pointPos[1],
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

  toggleUserPoint() {
    const { xScale, yScale } = this.state;
    const {
      xValueAccessor,
      yValueAccessor,
      activeGalaxy,
      userHubblePlotCallback,
      data,
      options: { userHubblePlot },
    } = this.props;
    const pointPos = d3mouse(this.svgEl.current);

    if (data) {
      const userData = [...data];
      let targetDatum = userData[userData.length - 1];
      const userDatum = find(userData, d => {
        return activeGalaxy.name === d.name;
      });

      const xVal = xScale.invert(pointPos[0]);
      const yVal = yScale.invert(pointPos[1]);

      if (userDatum) {
        targetDatum = userDatum;
        targetDatum[xValueAccessor] = xVal;
        targetDatum[yValueAccessor] = yVal;
      } else {
        const firstEmptyDatum = find(userData, d => {
          return d[xValueAccessor] === null;
        });
        targetDatum = firstEmptyDatum || targetDatum;
        targetDatum[xValueAccessor] = xVal;
        targetDatum[yValueAccessor] = yVal;
      }

      this.setState(
        prevState => ({
          ...prevState,
          hoverPointData: null,
          showTooltip: false,
          selectedData: [targetDatum],
        }),
        () => {
          if (userHubblePlotCallback) {
            userHubblePlotCallback(userHubblePlot, userData);
          }
        }
      );
    } else {
      this.clearSelection();
    }
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

  onTrendlineClick = () => {
    const {
      userTrendlineCallback,
      options: { userTrendline },
    } = this.props;
    const { xScale, yScale } = this.state;
    const $hubblePlot = this.svgEl.current;
    const terminus = d3mouse($hubblePlot);
    const slope = yScale.invert(terminus[1]) / xScale.invert(terminus[0]);

    userTrendlineCallback(userTrendline, slope);
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    const {
      options: { preSelected, userHubblePlot, userTrendline },
    } = this.props;
    const $hubblePlot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    if (!preSelected && userTrendline) {
      $hubblePlot.on('click', () => {
        const pointData = d3Select(d3Event.target).datum();

        if (pointData) {
          this.toggleSelection(pointData);
        } else {
          this.clearSelection();
        }
      });
    } else if (!preSelected && userHubblePlot) {
      $hubblePlot.on('click', () => {
        const pointData = d3Select(d3Event.target).datum();

        if (pointData) {
          this.toggleSelection(pointData);
        } else if (userHubblePlot) {
          this.toggleUserPoint();
        } else {
          this.clearSelection();
        }
      });
    } else if (preSelected) {
      $hubblePlot.on('click', () => {
        const pointData = d3Select(d3Event.target).datum();

        if (pointData) {
          this.toggleSelection(pointData);
        } else {
          this.clearSelection();
        }
      });
    }

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
            .data(supernova.data);
          if (loading) {
            this.setState(prevState => ({
              ...prevState,
              loading: false,
            }));
          }
        } else {
          d3Select(this.svgEl.current)
            .selectAll(`.data-point${supernova.className}`)
            .data(supernova.data);
        }
      });
    } else {
      d3Select(this.svgEl.current)
        .selectAll('.data-point')
        .data(data);
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
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
      name,
      tooltipAccessors,
      tooltipLabels,
      hubbleConstant,
      options: { userTrendline },
      trendlineInteractable,
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

    const calcHeight = height - padding;

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
                  height={calcHeight}
                />
              </clipPath>
            </defs>
            <g clipPath="url('#clip')">
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
            {(userTrendline || hubbleConstant) && xScale && yScale && (
              <Trendline
                {...{ xScale, yScale, hubbleConstant }}
                captureAreaX={padding}
                captureAreaY={offsetTop}
                captureAreaWidth={width}
                captureAreaHeight={calcHeight}
                clickHandler={this.onTrendlineClick}
                isInteractable={trendlineInteractable}
              />
            )}
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
  activeGalaxy: PropTypes.object,
  options: PropTypes.object,
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
  hubbleConstant: PropTypes.number,
  name: PropTypes.string,
  selectionCallback: PropTypes.func,
  userHubblePlotCallback: PropTypes.func,
  userTrendlineCallback: PropTypes.func,
  trendlineInteractable: PropTypes.bool,
};

export default HubblePlot2D;
