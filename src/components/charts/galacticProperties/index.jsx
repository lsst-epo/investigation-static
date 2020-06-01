import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
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
import LegendMultiple from './LegendMultiple.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import styles from './galactic-properties.module.scss';

class GalacticProperties extends React.Component {
  constructor(props) {
    super(props);

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
    };

    this.svgEl = React.createRef();
    this.svgContainer = React.createRef();
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.updatePoints();
    }
  }

  componentDidUpdate(prevProps) {
    const { data, activeGalaxy } = this.props;
    const isNewData = prevProps.data !== data;
    const isNewActiveGalaxy = prevProps.activeGalaxy !== activeGalaxy;
    const shouldUpdateScales = this.shouldUpdateScales(prevProps, this.props);

    if (isNewData && !shouldUpdateScales) {
      this.updatePoints();
    }

    if (shouldUpdateScales) {
      this.updateScales();
    }

    if (isNewActiveGalaxy) {
      this.updateSelectedData(activeGalaxy);
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  shouldUpdateScales(prevProps, props) {
    const { height, width, padding, domain, xDomain, yDomain } = props;
    const {
      height: prevHeight,
      width: prevWidth,
      padding: prevPadding,
      domain: prevDomain,
      xDomain: prevXDomain,
      yDomain: prevYDomain,
    } = prevProps;

    const diffDims =
      height !== prevHeight || width !== prevWidth || padding !== prevPadding;
    const diffDomains =
      !isEqual(domain, prevDomain) ||
      !isEqual(xDomain, prevXDomain) ||
      !isEqual(yDomain, prevYDomain);
    return diffDims || diffDomains;
  }

  getXScale() {
    const { width, padding, xDomain, options } = this.props;
    const { domain } = options || {};
    return d3ScaleLinear()
      .domain(domain ? domain[0] : xDomain)
      .range([padding, width]);
  }

  getYScale() {
    const { height, padding, yDomain, options } = this.props;
    const { domain } = options || {};
    return d3ScaleLinear()
      .domain(domain ? domain[1] : yDomain)
      .range([height - padding, 0]);
  }

  updateScales() {
    this.setState(
      prevState => ({
        ...prevState,
        xScale: this.getXScale(),
        yScale: this.getYScale(),
      }),
      this.updatePoints
    );
  }

  updateSelectedData(activeGalaxy) {
    this.setState(prevState => ({
      ...prevState,
      selectedData: activeGalaxy ? [activeGalaxy] : null,
    }));
  }

  clearSelection() {
    const { selectionCallback } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        hoveredData: null,
        showTooltip: false,
        tooltipPosX: 0,
        tooltipPosY: 0,
        selectedData: null,
      }),
      () => {
        if (selectionCallback) {
          selectionCallback(null, null);
        }
      }
    );
  }

  toggleSelection(d, pointPos) {
    const { selectedData } = this.state;
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

  onClick = () => {
    const pointData = d3Select(d3Event.target).datum();
    if (pointData) {
      const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);
      this.toggleSelection(pointData, pointPos);
    } else {
      this.clearSelection();
    }
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    this.removeEventListeners();
    const $galacticProperties = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');

    $galacticProperties.on('click', this.onClick);

    // add event listeners to points
    $allPoints
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);
  }

  // add event listeners to Scatterplot and Points
  removeEventListeners() {
    const $galacticProperties = d3Select(this.svgEl.current);
    const $allPoints = d3Select(this.svgEl.current).selectAll('.data-point');
    $galacticProperties.on('click', null);

    $allPoints.on('mouseover', null).on('mouseout', null);
  }

  updatePoints() {
    const { data, preSelected, options } = this.props;
    const { loading } = this.state;
    const { multiple } = options || {};

    if (!data) {
      return;
    }

    const $galacticProperties = d3Select(this.svgEl.current);

    if (isEmpty(data) && preSelected && loading) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else if (multiple) {
      data.forEach((set, i) => {
        $galacticProperties.selectAll(`.data-point.set-${i}`).data(set);
      });

      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } else {
      $galacticProperties.selectAll('.data-point').data(data);

      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }

    this.addEventListeners();
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
      tooltipUnits,
      tooltipLabels,
      options,
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
    } = this.state;

    const { multiple } = options || {};
    const svgClasses = classnames('svg-chart', styles.galacticProperties, {
      loading,
      loaded: !loading,
    });

    return (
      <>
        {multiple && data && (
          <LegendMultiple
            yValueAccessor={yValueAccessor}
            numOfSets={data.length}
          />
        )}
        <div
          ref={this.svgContainer}
          className={`svg-container ${styles.galacticPropertiesContainer}`}
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
            <g>
              {data &&
                multiple &&
                data.map((set, i) => {
                  const setId = `set-${i}`;
                  const pointClasses = classnames(setId, styles.groupPoint, {
                    [`color-${i}-fill`]: i > 0,
                  });

                  return (
                    <Points
                      key={setId}
                      data={set}
                      {...{
                        xScale,
                        yScale,
                        xValueAccessor,
                        yValueAccessor,
                        selectedData,
                        hoveredData,
                        offsetTop,
                      }}
                      pointClasses={pointClasses}
                    />
                  );
                })}
              {data && !multiple && (
                <Points
                  {...{
                    data,
                    xScale,
                    yScale,
                    xValueAccessor,
                    yValueAccessor,
                    selectedData,
                    hoveredData,
                    offsetTop,
                  }}
                  pointClasses={classnames(styles.groupPoint, {
                    'color-1-fill': yValueAccessor !== 'color',
                  })}
                />
              )}
            </g>
          </svg>
        </div>
      </>
    );
  }
}

GalacticProperties.defaultProps = {
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

GalacticProperties.propTypes = {
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

export default GalacticProperties;
