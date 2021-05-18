import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import classnames from 'classnames';
import {
  select as d3Select,
  event as d3Event,
  clientPoint as d3ClientPoint,
  mouse as d3mouse,
} from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { zoom as d3Zoom } from 'd3-zoom';
import 'd3-transition';
import { drag as d3Drag } from 'd3-drag';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Trendline from './Trendline.jsx';
import Points from './Points';
import CursorPoint from './CursorPoint.jsx';
import AxisGrid from './AxisGrid.jsx';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import {
  hubblePlot,
  hubblePlotContainer,
  galaxyPoint,
  cursorPoint,
  invisible,
  message,
} from './hubble-plot.module.scss';

class HubblePlot extends React.Component {
  constructor(props) {
    super(props);
    const {
      options,
      xDomain,
      yDomain,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
    } = props;
    const { domain } = options || {};

    this.state = {
      loading: true,
      userData: null,
      selectedData: null,
      hoveredData: null,
      draggedPoint: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      mousePosX: null,
      mousePosY: null,
      showTooltip: false,
      xScale: this.getXScale(
        domain ? domain[0] : xDomain,
        width,
        padding,
        offsetRight
      ),
      yScale: this.getYScale(
        domain ? domain[1] : yDomain,
        height,
        padding,
        offsetTop
      ),
      hubbleConstant: null,
      activeDataIndex: null,
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

  rescale(transformEvent) {
    const {
      xDomain,
      yDomain,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      options,
    } = this.props;
    const { domain } = options || {};

    this.setState(prevState => ({
      ...prevState,
      showTooltip: false,
      xScale: transformEvent.rescaleX(
        this.getXScale(
          domain ? domain[0] : xDomain,
          width,
          padding,
          offsetRight
        )
      ),
      yScale: transformEvent.rescaleY(
        this.getYScale(domain ? domain[1] : yDomain, height, padding, offsetTop)
      ),
    }));
  }

  getXScale(domain, width, padding, offsetRight) {
    return d3ScaleLinear()
      .domain(domain)
      .range([padding, width - offsetRight]);
  }

  getYScale(domain, height, padding, offsetTop) {
    return d3ScaleLinear()
      .domain(domain)
      .range([height - padding, offsetTop]);
  }

  updateSelectedData() {
    const { activeGalaxy, data } = this.props;
    const dataIndex = findIndex(data, d => {
      return activeGalaxy.name === d.name;
    });

    const activeData = data[dataIndex];

    this.setState(prevState => ({
      ...prevState,
      selectedData: activeData ? arrayify(activeData) : prevState.selectedData,
      activeDataIndex: dataIndex,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
    }));
  }

  clearSelection() {
    this.setState(prevState => ({
      ...prevState,
      hoveredData: null,
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
      options,
    } = this.props;
    const { createUserHubblePlot } = options || {};
    const pointPos = d3mouse(this.svgEl.current);

    if (!this.showGhost()) {
      this.clearSelection();
    } else if (data) {
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
          hoveredData: null,
          showTooltip: false,
          selectedData: [targetDatum],
        }),
        () => {
          if (userHubblePlotCallback && createUserHubblePlot) {
            userHubblePlotCallback(createUserHubblePlot, userData);
          }
        }
      );
    } else {
      this.clearSelection();
    }
  }

  drag = d => {
    const {
      xValueAccessor,
      yValueAccessor,
      userHubblePlotCallback,
      options,
      data,
    } = this.props;
    const { createUserHubblePlot } = options || {};
    const { xScale, yScale, selectedData } = this.state;
    const {
      sourceEvent: { offsetX: startX, offsetY: startY },
    } = d3Event;
    const isActivePoint = selectedData
      ? selectedData[0].name === d.name
      : false;

    this.setState(
      prevState => ({
        ...prevState,
        tooltipPosX: startX,
        tooltipPosY: startY,
        showTooltip: true,
        hoveredData: null,
        selectedData: isActivePoint ? null : arrayify(d),
      }),
      () => {
        const { selectionCallback } = this.props;
        const { selectedData: newData } = this.state;

        if (selectionCallback) {
          selectionCallback(newData);
        }
      }
    );

    d3Event.on('drag', () => {
      const [dragPosX, dragPosY] = d3mouse(this.svgEl.current);
      const { draggedPoint: oldDraggedPoint } = this.state;

      const newState = {
        mousePosX: dragPosX,
        mousePosY: dragPosY,
      };

      if (oldDraggedPoint !== d) {
        newState.draggedPoint = d;
      }

      this.setState(prevState => ({
        ...prevState,
        ...newState,
      }));
    });

    d3Event.on('end', () => {
      const [mousePosX, mousePosY] = d3mouse(this.svgEl.current);
      const {
        sourceEvent: { offsetX: endX, offsetY: endY },
      } = d3Event;
      const xVal = xScale.invert(mousePosX);
      const yVal = yScale.invert(mousePosY);
      const updatedDatum = {
        ...d,
        [xValueAccessor]: xVal,
        [yValueAccessor]: yVal,
      };

      this.setState(
        prevState => ({
          ...prevState,
          draggedPoint: null,
          mousePosX: null,
          mousePosY: null,
          selectedData: arrayify(updatedDatum),
          tooltipPosX: endX,
          tooltipPosY: endY,
          showTooltip: true,
        }),
        () => {
          if (userHubblePlotCallback && createUserHubblePlot) {
            const updatedData = [...data];
            const draggedPointIndex = findIndex(updatedData, datum => {
              return d.name === datum.name;
            });

            updatedData[draggedPointIndex] = {
              ...d,
              [xValueAccessor]: xVal,
              [yValueAccessor]: yVal,
            };

            userHubblePlotCallback(createUserHubblePlot, updatedData);
          }
        }
      );
    });
    // }
  };

  // mouseover/focus handler for point
  onMouseOver = d => {
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);
    // add hover style on point and show tooltip
    this.setState(prevState => ({
      ...prevState,
      hoveredData: arrayify(d),
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
      hoveredData: null,
      showTooltip: !!selectedData,
    }));
  };

  onZoom = () => {
    this.rescale(d3Event.transform);
  };

  onTrendlineClick = () => {
    const { userTrendlineCallback, options } = this.props;
    const { userTrendline } = options || {};
    const { xScale, yScale } = this.state;
    const $hubblePlot = this.svgEl.current;
    const terminus = d3mouse($hubblePlot);
    const slope = yScale.invert(terminus[1]) / xScale.invert(terminus[0]);

    userTrendlineCallback(userTrendline, slope);
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    const {
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      options,
    } = this.props;
    const { preSelected, createUserHubblePlot, userTrendline, qaReview } =
      options || {};
    const $hubblePlot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    if (
      (!preSelected && userTrendline) ||
      !!qaReview ||
      (preSelected && !createUserHubblePlot)
    ) {
      $hubblePlot.on('click', () => {
        const pointData = d3Select(d3Event.target).datum();

        if (pointData) {
          this.toggleSelection(pointData);
        } else {
          this.clearSelection();
        }
      });

      $allPoints
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut);
    } else if (!preSelected && createUserHubblePlot) {
      $hubblePlot.on('click', () => {
        const pointData = d3Select(d3Event.target).datum();

        if (!pointData && createUserHubblePlot) {
          this.toggleUserPoint();
        }
      });

      const zoom = d3Zoom()
        .translateExtent([
          [padding, offsetTop],
          [width - offsetRight, height - padding],
        ])
        .scaleExtent([1, 5])
        .extent([
          [padding, offsetTop],
          [width - offsetRight, height - padding],
        ])
        .on('zoom', this.onZoom);

      $hubblePlot.call(zoom).on('mousedown.zoom', null);

      $hubblePlot.on('mousemove', () => {
        if (this.showGhost()) {
          const [mousePosX, mousePosY] = d3mouse(this.svgEl.current);

          this.setState(prevState => ({
            ...prevState,
            mousePosX,
            mousePosY,
          }));
        }
      });

      $hubblePlot.on('mouseout', () => {
        if (this.showGhost()) {
          this.setState(prevState => ({
            ...prevState,
            mousePosX: null,
            mousePosY: null,
          }));
        }
      });

      $allPoints
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut)
        .call(d3Drag().on('start', this.drag));
    }
  }

  // add event listeners to Scatterplot and Points
  removeEventListeners() {
    const $hubblePlot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    $hubblePlot
      .on('click', null)
      .on('mousemove', null)
      .on('mouseout', null);
    $allPoints
      .on('mouseover', null)
      .on('mouseout', null)
      .on('click', null)
      .on('drag', null);
  }

  updatePoints() {
    const { data, preSelected, options } = this.props;
    const { loading } = this.state;
    const { multiple } = options || {};

    if (!data) {
      return;
    }

    const $hubblePlot = d3Select(this.svgEl.current);

    if (isEmpty(data) && preSelected && loading) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else if (multiple) {
      data.forEach((set, i) => {
        $hubblePlot.selectAll(`.data-point.set-${i}`).data(set);
      });

      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else {
      $hubblePlot.selectAll('.data-point').data(data);

      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }
  }

  // bind data to elements and add styles and attributes
  updateHubblePlot() {
    this.updatePoints();

    this.addEventListeners();
  }

  showGhost() {
    const { xValueAccessor, yValueAccessor, activeGalaxy, data } = this.props;
    const activePlotted = find(data, { name: activeGalaxy.name }) || {};

    if (!data) return true;

    if (activePlotted[xValueAccessor] && activePlotted[yValueAccessor]) {
      return false;
    }

    return true;
  }

  render() {
    const {
      data,
      width,
      height,
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
      options,
      trendlineInteractable,
      color,
      isVisible,
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
      mousePosX,
      mousePosY,
      draggedPoint,
    } = this.state;

    const { userTrendline, multiple } = options || {};

    const svgClasses = classnames('svg-chart', hubblePlot, {
      'hide-plot': !isVisible,
      loading,
      loaded: !loading,
    });

    const calcHeight = height - padding;

    return (
      <div
        ref={this.svgContainer}
        className={`svg-container ${hubblePlotContainer}`}
        data-testid="hubble-plot"
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
          labels={tooltipLabels}
        />
        {!isVisible && (
          <div className={message}>
            Plot not available. Please complete all questions from previous
            pages.
          </div>
        )}
        <svg
          className={svgClasses}
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${width} ${height}`}
          ref={this.svgEl}
          data-testid="hubble-plot-svg"
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
          <AxisGrid
            {...{
              height,
              width,
              xScale,
              yScale,
              padding,
              offsetTop,
              offsetRight,
            }}
          />
          <XAxis
            label={xAxisLabel}
            scale={xScale}
            {...{
              height,
              width,
              padding,
              offsetTop,
              offsetRight,
            }}
          />
          <YAxis
            label={yAxisLabel}
            scale={yScale}
            {...{
              height,
              padding,
              offsetTop,
            }}
          />
          <g>
            <g clipPath="url('#clip')">
              <CursorPoint
                x={mousePosX}
                y={mousePosY}
                offsetTop={offsetTop}
                pointClasses={classnames(color, `${cursorPoint}`, {
                  [invisible]: !mousePosX && !mousePosY,
                })}
              />
            </g>
            {data &&
              multiple &&
              data.map((set, i) => {
                const key = `galaxy-${i}`;
                return (
                  <Points
                    key={key}
                    data={set}
                    {...{
                      draggedPoint,
                      xScale,
                      yScale,
                      xValueAccessor,
                      yValueAccessor,
                      selectedData,
                      hoveredData,
                      offsetTop,
                    }}
                    colorize={i !== 0}
                    pointClasses={`${color} set-${i} ${galaxyPoint}`}
                  />
                );
              })}
            {data && !multiple && (
              <Points
                {...{
                  draggedPoint,
                  data,
                  xScale,
                  yScale,
                  xValueAccessor,
                  yValueAccessor,
                  selectedData,
                  hoveredData,
                  offsetTop,
                }}
                colorize
                pointClasses={galaxyPoint}
              />
            )}
          </g>
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
    );
  }
}

HubblePlot.defaultProps = {
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
  yAxisLabel: 'Velocity (km/s)',
  tooltipAccessors: ['name', 'distance', 'velocity'],
  tooltipLabels: ['Galaxy', 'Distance', 'Velocity'],
  isVisible: true,
};

HubblePlot.propTypes = {
  isVisible: PropTypes.bool,
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
  hubbleConstant: PropTypes.number,
  name: PropTypes.string,
  selectionCallback: PropTypes.func,
  userHubblePlotCallback: PropTypes.func,
  userTrendlineCallback: PropTypes.func,
  trendlineInteractable: PropTypes.bool,
  color: PropTypes.string,
};

export default HubblePlot;
