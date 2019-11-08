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
import { zoom as d3Zoom } from 'd3-zoom';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Points from './Points.jsx';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import Legend from '../shared/Legend.jsx';

class LightCurve extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      xDomain,
      yDomain,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
    } = props;

    this.state = {
      selectedData: null,
      hoverPointData: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
      loading: true,
      xScale: this.getXScale(xDomain, width, padding, offsetRight),
      yScale: this.getYScale(yDomain, height, padding, offsetTop),
    };

    this.svgContainer = React.createRef();
    this.svgEl = React.createRef();
  }

  componentDidMount() {
    const {
      xDomain,
      yDomain,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      activeData,
    } = this.props;

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
      this.updateScatterPlot();
    }

    this.checkActive(activeData, prevProps.activeData);
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

  rescale(transformEvent) {
    const {
      xDomain,
      yDomain,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
    } = this.props;

    this.setState(prevState => ({
      ...prevState,
      xScale: transformEvent.rescaleX(
        this.getXScale(xDomain, width, padding, offsetRight)
      ),
      yScale: transformEvent.rescaleY(
        this.getYScale(yDomain, height, padding, offsetTop)
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
      // showLasso: false,
      // showEraser: false,
    }));
  }

  toggleSelection(d) {
    const { activeId, dataSelectionCallback } = this.props;
    const { selectedData } = this.state;
    // const selectedPointId = this.getSelectedId(selectedData);
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

    this.setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    if (activeId && dataSelectionCallback) {
      dataSelectionCallback(activeId, arrayify(d));
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

  onZoom = () => {
    this.rescale(d3Event.transform);
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    const { width, height, padding, offsetTop, offsetRight } = this.props;
    const $scatterplot = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    $scatterplot.on('click', () => {
      // remove styles and selections when click on non-point
      const pointData = d3Select(d3Event.target).datum();

      if (pointData) {
        this.toggleSelection(pointData);
      } else {
        this.clearGraph();
      }
    });

    const zoom = d3Zoom()
      .translateExtent([
        [padding, offsetTop],
        [width - offsetRight, height - padding],
      ])
      .scaleExtent([1, 5])
      .extent([[padding, offsetTop], [width - offsetRight, height - padding]])
      .on('zoom', this.onZoom);

    $scatterplot.call(zoom);

    // add event listeners to points
    $allPoints
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);
  }

  // bind data to points
  updatePoints() {
    const { data, preSelected, multiple } = this.props;
    const { loading } = this.state;
    const $scatterplot = d3Select(this.svgEl.current);

    if (isEmpty(data) && preSelected) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else if (multiple) {
      data.forEach((selection, i) => {
        if (i === data.length - 1) {
          $scatterplot
            .selectAll(`.data-point.${selection.className}`)
            .data(selection.data)
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
          $scatterplot
            .selectAll(`.data-point${selection.className}`)
            .data(selection.data);
        }
      });
    } else {
      $scatterplot
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
  updateScatterPlot() {
    const { preSelected } = this.props;
    this.updatePoints();

    if (!preSelected) this.addEventListeners();
  }

  renderColorLegendContent() {
    return (
      <div className="container-flex centered spaced">
        <div className="description">Colors approximate star colors</div>
        <div className="data-point" style={{ backgroundColor: '#f9d71c' }} />
      </div>
    );
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
      showColorLegend,
      tooltipAccessors,
      tooltipLabels,
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
    } = this.state;

    const svgClasses = classnames('hrd svg-chart scatter-plot', {
      loading,
      loaded: !loading,
    });

    return (
      <>
        {showColorLegend && !loading && (
          <Legend
            key="color-legend"
            content={this.renderColorLegendContent()}
          />
        )}
        <div
          key="svg-container"
          ref={this.svgContainer}
          className="svg-container scatter-plot-container"
        >
          {loading && (
            <CircularProgress
              id="graph-loading-progress"
              key="loading"
              className="chart-loader"
              scale={3}
            />
          )}
          {legend && !loading && <Legend key="legend" content={legend} />}
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
            key="scatter-plot"
            className={svgClasses}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${width} ${height}`}
            ref={this.svgEl}
            style={{ opacity: 0 }}
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
            <g clipPath="url('#clip')">
              {data &&
                multiple &&
                data.map((selection, i) => {
                  const key = `${selection.className}-${i}`;

                  return (
                    <Points
                      key={key}
                      pointClasses={selection.className}
                      data={selection.data}
                      selectedData={selectedData}
                      hoveredData={hoverPointData}
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
                  hoveredData={hoverPointData}
                  xScale={xScale}
                  yScale={yScale}
                  xValueAccessor={xValueAccessor}
                  yValueAccessor={yValueAccessor}
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

LightCurve.defaultProps = {
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 7,
  xDomain: [58690, 58780],
  yDomain: [21, 17],
  xValueAccessor: 'date',
  yValueAccessor: 'magnitude',
  xAxisLabel: 'Time',
  yAxisLabel: 'Magnitude',
  tooltipAccessors: ['date', 'magnitude'],
  tooltipLabels: ['Time', 'Magnitude'],
};

LightCurve.propTypes = {
  data: PropTypes.array,
  activeId: PropTypes.string,
  activeData: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  dataSelectionCallback: PropTypes.func,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
  showColorLegend: PropTypes.bool,
};

export default LightCurve;
