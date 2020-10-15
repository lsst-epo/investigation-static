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
import { zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { extent as d3Extent } from 'd3-array';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Points from './Points.jsx';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import Templates from './Templates.jsx';
import NavDrawer from '../shared/navDrawer/index.jsx';

import styles from './light-curve.module.scss';
import { paddedDrawerInner } from '../shared/navDrawer/nav-drawer.module.scss';

class LightCurve extends React.PureComponent {
  constructor(props) {
    super(props);

    const { activeTemplate } = props;

    this.state = {
      selectedData: null,
      hoverPointData: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
      loading: true,
      lightCurveType: activeTemplate || '',
    };

    this.svgContainer = React.createRef();
    this.svgEl = React.createRef();
  }

  componentDidMount() {
    const {
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      activeData,
      data,
      multiple,
      xValueAccessor,
      yValueAccessor,
    } = this.props;

    const xDomain = this.getDomain(data, multiple, xValueAccessor, 1);
    const yDomain = this.getDomain(data, multiple, yValueAccessor, -1);

    this.setState(prevState => ({
      ...prevState,
      xScale: this.getXScale(xDomain, width, padding, offsetRight),
      yScale: this.getYScale(yDomain, height, padding, offsetTop),
      selectedData: activeData,
    }));
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.state;
    const { data, activeData } = this.props;

    if (prevProps.data !== data || (!isEmpty(data) && loading)) {
      this.updateLightCurve();
    }

    this.checkActive(activeData, prevProps.activeData);
  }

  getDomain(data, multiple, accessor, direction) {
    let min;
    let max;

    if (multiple) {
      data.forEach(datum => {
        const ext = d3Extent(datum.alerts, d => d[accessor]);
        if (!min || !max) {
          min = ext[0];
          max = ext[1];
        } else {
          if (ext[0] < min) {
            min = ext[0];
          }

          if (ext[1] > max) {
            max = ext[1];
          }
        }
      });
    } else {
      const domain = d3Extent(data, d => d[accessor]);
      min = domain[0];
      max = domain[1];
    }

    let extent = [Math.floor(min), Math.ceil(max)];
    if (accessor === 'magnitude') {
      const buffer = (max - min) * 0.1;
      extent = [Math.floor(extent[0] - buffer), extent[1]];
    }

    if (direction < 0) {
      return extent.reverse();
    }

    return extent;
  }

  checkActive(data, prevData) {
    if (data !== null && data !== prevData) {
      this.setState(prevState => ({
        ...prevState,
        selectedData: data,
      }));
    } else if (data === null && data !== prevData) {
      this.clearGraph();
    }
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

  getSelectedId(selectedData) {
    if (!selectedData) return null;
    if (selectedData.length >= 1) return selectedData[0].source_id;

    return null;
  }

  clearGraph() {
    this.setState(prevState => ({
      ...prevState,
      hoverPointData: null,
      showTooltip: false,
      selectedData: null,
    }));
  }

  toggleSelection(d) {
    const { activeAlertId, dataSelectionCallback } = this.props;
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

    this.setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    if (activeAlertId && dataSelectionCallback) {
      dataSelectionCallback(activeAlertId, arrayify(d));
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

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    // const { width, height, padding, offsetTop, offsetRight } = this.props;
    const $lightCurve = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    $lightCurve.on('click', () => {
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

  // bind data to points
  updatePoints() {
    const { data, preSelected, multiple } = this.props;
    const { loading } = this.state;
    const $lightCurve = d3Select(this.svgEl.current);

    if (isEmpty(data) && preSelected) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else if (multiple) {
      data.forEach((curve, i) => {
        $lightCurve
          .selectAll(`.data-point.${curve.name}-${i}`)
          .data(curve.alerts);
      });

      if (loading) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    } else {
      $lightCurve.selectAll('.data-point').data(data);
      if (loading) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  }

  updateLightCurveType = value => {
    const {
      templateZoomCallback,
      templateTransform,
      templateAnswerId,
    } = this.props;
    // const { value } = item || e.target;

    if (value) {
      this.setState(prevState => ({
        ...prevState,
        lightCurveType: value,
      }));

      templateZoomCallback(templateAnswerId, {
        type: value,
        data: templateTransform || d3ZoomIdentity,
      });
    }
  };

  // bind data to elements and add styles and attributes
  updateLightCurve() {
    const {
      preSelected,
      interactableTemplates,
      interactablePeakMag,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      multiple,
      xValueAccessor,
      yValueAccessor,
      data,
    } = this.props;

    const xDomain = this.getDomain(data, multiple, xValueAccessor, 1);
    const yDomain = this.getDomain(data, multiple, yValueAccessor, -1);

    this.setState(
      prevState => ({
        ...prevState,
        xScale: this.getXScale(xDomain, width, padding, offsetRight),
        yScale: this.getYScale(yDomain, height, padding, offsetTop),
      }),
      () => {
        this.updatePoints();

        if (!preSelected && !interactableTemplates && !interactablePeakMag) {
          this.addEventListeners();
        }
      }
    );

    // this.updatePoints();
  }

  generateNavItems(navItems) {
    const { activeTemplate, interactableTemplates } = this.props;

    return navItems.map(item => {
      return {
        leftAvatar: <span className={styles.navAvatar}>{item}</span>,
        primaryText: `Type ${item} template`,
        className: classnames(styles.templateItem, {
          [styles.linkActive]: activeTemplate === item,
          [styles.linkIsDisabled]: !interactableTemplates,
        }),
        onClick: interactableTemplates
          ? () => this.updateLightCurveType(item)
          : null,
      };
    });
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
      xValueAccessor,
      yValueAccessor,
      multiple,
      legend,
      templatesData,
      templates,
      tooltipAccessors,
      tooltipLabels,
      templateZoomCallback,
      peakMagCallback,
      templateTransform,
      chooseLightCurveTemplate,
      pointsAreVisible,
      interactableTemplates,
      interactablePeakMag,
      activePeakMag,
      peakMagAnswerId,
      templateAnswerId,
      pointColor,
    } = this.props;

    const {
      hoverPointData,
      tooltipPosX,
      tooltipPosY,
      showTooltip,
      selectedData,
      loading,
      xScale,
      yScale,
      lightCurveType,
    } = this.state;

    const svgClasses = classnames('svg-chart light-curve', {
      loading,
      loaded: !loading,
    });

    return (
      <>
        {legend}
        <NavDrawer
          cardClasses={styles.container}
          interactableToolbar={interactableTemplates}
          navItems={this.generateNavItems(templates || [])}
          toolbarTitle={
            `${lightCurveType} Template Selected` || 'No Template Selected'
          }
          showNavDrawer={chooseLightCurveTemplate}
          contentClasses={paddedDrawerInner}
        >
          <div
            key="svg-container"
            ref={this.svgContainer}
            className="svg-container scatter-plot-container"
            data-testid="light-curve"
          >
            {loading && (
              <CircularProgress
                id="graph-loading-progress"
                key="loading"
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
            {templates && (
              <Templates
                activeTemplate={lightCurveType}
                activePeakMag={activePeakMag}
                transform={templateTransform}
                types={templates}
                data={templatesData}
                zoomCallback={templateZoomCallback}
                peakMagScale={yScale}
                {...{
                  peakMagCallback,
                  interactableTemplates,
                  interactablePeakMag,
                  peakMagAnswerId,
                  templateAnswerId,
                }}
              />
            )}
            <svg
              key="scatter-plot"
              className={svgClasses}
              preserveAspectRatio="xMidYMid meet"
              viewBox={`0 0 ${width} ${height}`}
              ref={this.svgEl}
              data-testid="light-curve-svg"
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
              <g
                clipPath="url('#clip')"
                style={{ visibility: pointsAreVisible ? 'visible' : 'hidden' }}
              >
                {data &&
                  xScale &&
                  yScale &&
                  multiple &&
                  data.map((curve, i) => {
                    const { alerts, name, color } = curve;
                    if (!curve.alerts) return null;
                    const key = `${name}-${i}`;

                    return (
                      <Points
                        key={key}
                        pointClasses={key}
                        data={alerts}
                        pointColor={color}
                        selectedData={selectedData}
                        hoveredData={hoverPointData}
                        xScale={xScale}
                        yScale={yScale}
                        xValueAccessor={xValueAccessor}
                        yValueAccessor={yValueAccessor}
                      />
                    );
                  })}
                {data && xScale && yScale && !multiple && (
                  <Points
                    data={data}
                    pointColor={pointColor}
                    selectedData={selectedData}
                    hoveredData={hoverPointData}
                    xScale={xScale}
                    yScale={yScale}
                    xValueAccessor={xValueAccessor}
                    yValueAccessor={yValueAccessor}
                  />
                )}
              </g>
              {xScale && (
                <XAxis
                  label={xAxisLabel}
                  height={height}
                  width={width}
                  padding={padding}
                  offsetTop={offsetTop}
                  offsetRight={offsetRight}
                  scale={xScale}
                />
              )}
              {yScale && (
                <YAxis
                  label={yAxisLabel}
                  height={height}
                  padding={padding}
                  offsetTop={offsetTop}
                  scale={yScale}
                />
              )}
            </svg>
          </div>
        </NavDrawer>
      </>
    );
  }
}

LightCurve.defaultProps = {
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 7,
  xDomain: [58690, 58780],
  yDomain: [24, 14],
  xValueAccessor: 'date',
  yValueAccessor: 'magnitude',
  xAxisLabel: 'Days',
  yAxisLabel: 'Apparent Magnitude (m)',
  tooltipAccessors: ['date', 'magnitude'],
  tooltipLabels: ['Time', 'Apparent Magnitude (m)'],
  chooseLightCurveTemplate: false,
};

LightCurve.propTypes = {
  data: PropTypes.array.isRequired,
  templates: PropTypes.array,
  templatesData: PropTypes.object,
  chooseLightCurveTemplate: PropTypes.bool,
  interactableTemplates: PropTypes.bool,
  interactablePeakMag: PropTypes.bool,
  activeAlertId: PropTypes.string,
  activeData: PropTypes.any,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  dataSelectionCallback: PropTypes.func,
  templateZoomCallback: PropTypes.func,
  peakMagCallback: PropTypes.func,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
  activeTemplate: PropTypes.string,
  templateTransform: PropTypes.object,
  pointsAreVisible: PropTypes.bool,
  activePeakMag: PropTypes.object,
  peakMagAnswerId: PropTypes.string,
  templateAnswerId: PropTypes.string,
  pointColor: PropTypes.string,
};

export default LightCurve;
