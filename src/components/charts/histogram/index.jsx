import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import {
  histogram as d3Histogram,
  thresholdScott as d3ThresholdScott,
  // threshholdFreedmanDiaconis as d3ThresholdFreedmanDiaconis,
  // thresholdSturges as d3ThresholdSturges,
  max as d3Max,
} from 'd3-array';
import {
  scalePoint as d3ScalePoint,
  scaleLinear as d3ScaleLinear,
} from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { capitalize } from '../../../lib/utilities';
import Unit from '../shared/unit/index.jsx';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Bars from './Bars.jsx';
// import MeanBar from './MeanBar.jsx';
import Tooltip from '../shared/Tooltip.jsx';

class Histogram extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      selectedData: null,
      hoverDataBar: null,
      tooltipPosX: 0,
      tooltipPosY: 0,
      showTooltip: false,
      xScale: null,
      yScale: null,
      loading: true,
      groupNames: null,
    };

    this.svgEl = React.createRef();
  }

  componentDidMount() {
    const {
      data,
      width,
      padding,
      offsetRight,
      offsetTop,
      height,
      valueAccessor,
      domain,
      multiple,
    } = this.props;

    if (!isEmpty(data)) {
      const histData = this.histogramData(
        data,
        valueAccessor,
        domain,
        multiple
      );

      this.setState(prevState => ({
        ...prevState,
        data: histData,
        xScale: this.getXScale(
          histData,
          valueAccessor,
          width,
          padding,
          offsetRight,
          multiple
        ),
        groupNames: multiple && data.map(set => set.group.toLowerCase()),
        yScale: this.getYScale(histData, height, padding, offsetTop, multiple),
      }));
    }
  }

  componentDidUpdate(prevProps) {
    const { activeData } = this.props;
    const { loading, data } = this.state;

    if (!isEmpty(data) && loading) {
      this.updateHistogram();
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

  histogramData(data, valueAccessor, domain, multiple) {
    if (valueAccessor === 'luminosity') {
      return d3Histogram()
        .value(d => {
          return Math.log10(d[valueAccessor]); // eslint-disable-line dot-notation
        })
        .thresholds(d3ThresholdScott)(data);
    }

    // if (valueAccessor === 'radius') {
    //   return d3Histogram()
    //     .value(d => {
    //       return d[valueAccessor]; // eslint-disable-line dot-notation
    //     })
    //     .thresholds(10)(data);
    // }

    if (domain && multiple) {
      return data.map(set => {
        const { data: dataset } = set;

        return d3Histogram()
          .value(d => {
            return d[valueAccessor]; // eslint-disable-line dot-notation
          })
          .thresholds(20)
          .domain(domain)(dataset);
      });
    }

    if (domain) {
      return d3Histogram()
        .value(d => {
          return d[valueAccessor]; // eslint-disable-line dot-notation
        })
        .domain(domain)(data);
    }

    return d3Histogram().value(d => {
      return d[valueAccessor]; // eslint-disable-line dot-notation
    })(data);
  }

  getLuminosityXScale(data, width, padding, offsetRight) {
    const last = data[data.length - 1];
    const domain = data.map(d => {
      return d.x0;
    });

    domain.push(last.x1);

    return d3ScalePoint()
      .domain(domain)
      .range([padding, width - offsetRight]);
  }

  getPointXScale(data, width, padding, offsetRight) {
    const last = data[data.length - 1];
    const domain = data.map(d => {
      return d.x0;
    });

    domain.push(last.x1);

    return d3ScalePoint()
      .domain(domain)
      .range([padding, width - offsetRight]);
  }

  getXScale(data, valueAccessor, width, padding, offsetRight, multiple) {
    if (!multiple) {
      if (valueAccessor === 'luminosity') {
        return this.getLuminosityXScale(data, width, padding, offsetRight);
      }

      return this.getPointXScale(data, width, padding, offsetRight);
    }

    return data.map(set => {
      if (valueAccessor === 'luminosity') {
        return this.getLuminosityXScale(set, width, padding, offsetRight);
      }

      return this.getPointXScale(set, width, padding, offsetRight);
    });
  }

  getLinearYScale(data, height, padding, offsetTop) {
    return d3ScaleLinear()
      .domain([
        0,
        d3Max(data, d => {
          return d.length;
        }) * 1.1,
      ])
      .range([height - padding, offsetTop]);
  }

  getYScale(data, height, padding, offsetTop, multiple) {
    if (!multiple) {
      return this.getLinearYScale(data, height, padding, offsetTop);
    }

    return data.map(set => {
      return this.getLinearYScale(set, height, padding, offsetTop);
    });
  }

  getLabel(type) {
    return (
      <tspan>
        {capitalize(type)} (<Unit type={type} isSvg />)
      </tspan>
    );
  }

  clearGraph() {
    this.setState(prevState => ({
      ...prevState,
      hoveredData: null,
      showTooltip: false,
      selectedData: null,
    }));
  }

  toggleSelection(d) {
    const { activeId, dataSelectionCallback } = this.props;
    const { selectedData, xScale, yScale } = this.state;

    const newState = {
      tooltipPosX: xScale(d.x0),
      tooltipPosY: yScale(d.length),
      showTooltip: true,
      selectedData: d,
    };

    if (d === selectedData) {
      newState.selectedData = null;
      newState.showTooltip = false;
    }

    this.setState(prevState => ({
      ...prevState,
      ...newState,
    }));

    dataSelectionCallback(activeId, d);
  }

  // mouseover/focus handler for point
  onMouseOver = d => {
    const { xScale, yScale } = this.state;
    // add hover style on point and show tooltip
    this.setState(prevState => ({
      ...prevState,
      hoveredData: d,
      tooltipPosX: xScale(d.x0),
      tooltipPosY: yScale(d.length),
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

  // add event listeners to Histogram and Bars
  addEventListeners() {
    const $histogram = d3Select(this.svgEl.current);
    const $bars = d3Select(this.svgEl.current).selectAll('.data-bar-data');

    $histogram.on('click', () => {
      // remove styles and selections when click on non-bar
      const barData = d3Select(d3Event.target).datum();

      if (barData) {
        this.toggleSelection(barData);
      } else {
        this.clearGraph();
      }
    });

    // add event listeners to bars
    $bars.on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut);
  }

  updateBars() {
    const { loading, data, groupNames } = this.state;
    const { multiple } = this.props;
    const $histogram = d3Select(this.svgEl.current);

    if (!multiple) {
      $histogram
        .selectAll('.data-bar-data')
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
    } else if (multiple && groupNames) {
      groupNames.forEach((groupName, i) => {
        $histogram.selectAll(`.data-bar-data.${groupName}`).data(data[i]);
      });

      if (loading) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  }

  updateHistogram() {
    const { preSelected, multiple } = this.props;

    this.updateBars();
    if (!preSelected && !multiple) this.addEventListeners();
  }

  render() {
    const {
      // data: meanData,
      width,
      height,
      padding,
      xAxisLabel,
      yAxisLabel,
      offsetTop,
      offsetRight,
      valueAccessor,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      multiple,
    } = this.props;

    const {
      data,
      hoveredData,
      selectedData,
      loading,
      showTooltip,
      tooltipPosY,
      tooltipPosX,
      xScale,
      yScale,
      groupNames,
    } = this.state;

    const svgClasses = classnames('histogram svg-chart', {
      loading,
      loaded: !loading,
    });

    return (
      <div className="svg-container histogram-container">
        {loading && (
          <CircularProgress
            id="graph-loading-progress"
            className="chart-loader"
            scale={3}
          />
        )}
        <Tooltip
          key="tooltip"
          graph="histogram"
          data={selectedData || hoveredData}
          posX={tooltipPosX}
          posY={tooltipPosY}
          show={showTooltip}
          accessors={tooltipAccessors}
          units={tooltipUnits}
          labels={tooltipLabels}
        />
        <svg
          key={valueAccessor}
          className={svgClasses}
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${width} ${height}`}
          ref={this.svgEl}
        >
          {xScale && yScale && multiple && (
            <>
              {data.map((dataset, i) => {
                const groupName = groupNames[i];
                const key = groupName + i;

                return (
                  <Bars
                    barClasses={groupName}
                    colorClass={`color-set-${i + 1}`}
                    key={key}
                    data={dataset}
                    selectedData={selectedData}
                    hoveredData={hoveredData}
                    offsetTop={offsetTop}
                    xScale={xScale[i]}
                    yScale={yScale[i]}
                    graphHeight={height}
                    padding={padding}
                  />
                );
              })}
            </>
          )}
          {xScale && yScale && !multiple && (
            <>
              <Bars
                data={data}
                selectedData={selectedData}
                hoveredData={hoveredData}
                offsetTop={offsetTop}
                xScale={xScale}
                yScale={yScale}
                graphHeight={height}
                padding={padding}
              />
              {/* {meanData && valueAccessor && (
                <MeanBar
                  data={meanData}
                  bins={data}
                  valueAccessor={valueAccessor}
                  yScale={yScale}
                  graphWidth={width}
                  offsetTop={offsetTop}
                  offsetRight={offsetRight}
                  padding={padding}
                />
              )} */}
            </>
          )}
          {xScale && multiple && (
            <XAxis
              label={xAxisLabel || this.getLabel(valueAccessor)}
              height={height}
              width={width}
              padding={padding}
              offsetTop={offsetTop}
              offsetRight={offsetRight}
              scale={xScale[0]}
              valueAccessor={valueAccessor}
            />
          )}
          {xScale && !multiple && (
            <XAxis
              label={xAxisLabel || this.getLabel(valueAccessor)}
              height={height}
              width={width}
              padding={padding}
              offsetTop={offsetTop}
              offsetRight={offsetRight}
              scale={xScale}
              valueAccessor={valueAccessor}
            />
          )}
          {yScale && multiple && (
            <YAxis
              label={yAxisLabel}
              height={height}
              padding={padding}
              offsetTop={offsetTop}
              scale={yScale[0]}
            />
          )}
          {yScale && !multiple && (
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
    );
  }
}

Histogram.defaultProps = {
  width: 600,
  height: 600,
  padding: 80,
  offsetTop: 0,
  offsetRight: 7,
  yAxisLabel: 'Number of Stars',
  tooltipAccessors: ['temperature'],
  tooltipLabels: ['stars', 'Temperature'],
};

Histogram.propTypes = {
  data: PropTypes.array,
  activeId: PropTypes.string,
  activeData: PropTypes.any,
  dataSelectionCallback: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetRight: PropTypes.number,
  offsetTop: PropTypes.number,
  xAxisLabel: PropTypes.node,
  yAxisLabel: PropTypes.string,
  valueAccessor: PropTypes.string,
  domain: PropTypes.array,
  preSelected: PropTypes.bool,
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  tooltipUnits: PropTypes.array,
  multiple: PropTypes.bool,
};

export default Histogram;
