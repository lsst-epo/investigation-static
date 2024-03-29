import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import {
  select as d3Select,
  event as d3Event,
  clientPoint as d3ClientPoint,
} from 'd3-selection';
import { max as d3Max } from 'd3-array';
import {
  scalePoint as d3ScalePoint,
  scaleLinear as d3ScaleLinear,
} from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import Unit from '../shared/unit/index.jsx';
import NavDrawer from '../shared/navDrawer/index.jsx';
import ConditionalWrapper from '../../ConditionalWrapper';
import XAxis from './XAxis.jsx';
import YAxis from './YAxis.jsx';
import Bars from './Bars.jsx';
import Tooltip from '../shared/Tooltip.jsx';
import { capitalize } from '../../../lib/utilities';

import styles from './histogram.module.scss';

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
      activePlots: null,
    };

    this.svgEl = React.createRef();
    this.svgContainer = React.createRef();

    this.objectTypes = {
      neo: 'NEO',
      comets: 'Comet',
      mba: 'MBA',
      tno: 'TNO',
    };
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
      multiple,
    } = this.props;

    if (!isEmpty(data)) {
      const groupNames =
        multiple && data.map(set => this.objectTypes[set.group.toLowerCase()]);
      const activePlots = {};

      if (groupNames) {
        groupNames.forEach(name => {
          activePlots[name] = true;
        });
      }

      this.setState(prevState => ({
        ...prevState,
        data,
        xScale: this.getXScale(
          data.histogram,
          valueAccessor,
          width,
          padding,
          offsetRight,
          multiple
        ),
        groupNames,
        activePlots,
        yScale: this.getYScale(
          data.histogram,
          height,
          padding,
          offsetTop,
          multiple
        ),
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

  getPointXScale(data, width, padding, offsetRight) {
    const last = data[data.length - 1];
    const domain = data.map(d => {
      return d[0];
    });

    domain.push(last[1]);

    return d3ScalePoint()
      .domain(domain)
      .range([padding, width - offsetRight]);
  }

  getXScale(data, valueAccessor, width, padding, offsetRight, multiple) {
    if (multiple) {
      return this.getPointXScale(data[0], width, padding, offsetRight);
    }

    return this.getPointXScale(data, width, padding, offsetRight);
  }

  getLinearYScale(data, height, padding, offsetTop) {
    return d3ScaleLinear()
      .domain([
        0,
        d3Max(data, d => {
          return d[2];
        }) * 1.1,
      ])
      .range([height - padding, offsetTop]);
  }

  getYScale(data, height, padding, offsetTop, multiple) {
    if (multiple) {
      return this.getLinearYScale(data.flat(), height, padding, offsetTop);
    }

    return this.getLinearYScale(data, height, padding, offsetTop);
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

  getTooltipPos(data, pos) {
    return {
      tooltipPosX: pos[0],
      tooltipPosY: 1,
    };
  }

  toggleSelection(d, pos) {
    const { activeId, dataSelectionCallback } = this.props;
    const { selectedData } = this.state;

    const newState = {
      ...this.getTooltipPos(d, pos),
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
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);
    // add hover style on point and show tooltip
    this.setState(prevState => ({
      ...prevState,
      hoveredData: d,
      ...this.getTooltipPos(d, pointPos),
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
    const barData = d3Select(d3Event.target).datum();
    const pointPos = d3ClientPoint(this.svgContainer.current, d3Event);

    if (barData) {
      this.toggleSelection(barData, pointPos);
    } else {
      this.clearGraph();
    }
  };

  // add event listeners to Histogram and Bars
  addEventListeners() {
    const $histogram = d3Select(this.svgEl.current);
    const $bars = d3Select(this.svgEl.current).selectAll('.data-bar-data');

    $histogram.on('click', this.onClick);

    // add event listeners to bars
    $bars.on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut);
  }

  updateBars() {
    const { loading, data, groupNames } = this.state;
    const { histogram } = data || {};
    const { multiple } = this.props;
    const $histogram = d3Select(this.svgEl.current);

    if (!multiple) {
      $histogram.selectAll('.data-bar-data').data(histogram);

      if (loading) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
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
    const { multiple } = this.props;

    this.updateBars();
    if (!multiple) this.addEventListeners();
  }

  getActiveKeys(activePlots) {
    const keys = Object.keys(activePlots);
    const activeKeys = [];
    keys.forEach(key => {
      if (activePlots[key]) {
        activeKeys.push(key);
      }
    });

    return activeKeys;
  }

  updateActivePlots(id) {
    const { activePlots: oldActivePlots } = this.state;
    const activeKeys = this.getActiveKeys(oldActivePlots);
    const isLast = activeKeys.length <= 1;
    const isActive = oldActivePlots[id];

    this.setState(prevState => ({
      ...prevState,
      activePlots: {
        ...oldActivePlots,
        [id]: isLast ? true : !isActive,
      },
    }));
  }

  generateNavItems(navItems) {
    const { activePlots } = this.state;
    const { xAxisLabel: label } = this.props;

    return navItems.map((item, i) => {
      const avatarClasses = classnames(
        styles.barAvatar,
        `color-${i + 1}-background`
      );
      return {
        leftAvatar: (
          <div className={styles.avatarContainer}>
            <div className={avatarClasses}></div>
            <div className={styles.navAvatar}>{item}</div>
          </div>
        ),
        primaryText: `${item} ${label}`,
        className: classnames(styles.navItem, {
          [styles.linkActive]: activePlots[item],
        }),
        onClick: () => this.updateActivePlots(item),
      };
    });
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
      t,
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
      activePlots,
    } = this.state;

    const { histogram, total_number: totalNumber } = data || {};

    const svgClasses = classnames('histogram svg-chart', {
      loading,
      loaded: !loading,
    });

    return (
      <ConditionalWrapper
        condition={multiple && groupNames}
        wrapper={children => (
          <NavDrawer
            cardClasses={styles.container}
            navItems={this.generateNavItems(groupNames)}
            contentClasses={styles.paddedDrawerInner}
            toolbarStyles={{ display: 'none' }}
          >
            {children}
          </NavDrawer>
        )}
      >
        <div
          ref={this.svgContainer}
          className="svg-container histogram-container"
        >
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
            dataTotal={totalNumber || 0}
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
                  const colorIndex = i + 1;

                  return (
                    <g key={key}>
                      {activePlots[groupName] && (
                        <Bars
                          barClasses={groupName}
                          colorClass={`color-${colorIndex}-translucent-fill`}
                          data={dataset}
                          selectedData={selectedData}
                          hoveredData={hoveredData}
                          offsetTop={offsetTop}
                          xScale={xScale}
                          yScale={yScale}
                          graphHeight={height}
                          padding={padding}
                        />
                      )}
                    </g>
                  );
                })}
              </>
            )}
            {xScale && yScale && !multiple && (
              <>
                <Bars
                  data={histogram}
                  selectedData={selectedData}
                  hoveredData={hoveredData}
                  offsetTop={offsetTop}
                  xScale={xScale}
                  yScale={yScale}
                  graphHeight={height}
                  padding={padding}
                />
              </>
            )}
            {xScale && multiple && (
              <XAxis
                label={t(xAxisLabel) || this.getLabel(valueAccessor)}
                height={height}
                width={width}
                padding={padding}
                offsetTop={offsetTop}
                offsetRight={offsetRight}
                scale={xScale}
                valueAccessor={valueAccessor}
              />
            )}
            {xScale && !multiple && (
              <XAxis
                label={t(xAxisLabel) || this.getLabel(valueAccessor)}
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
                label={t(yAxisLabel)}
                height={height}
                padding={padding}
                offsetTop={offsetTop}
                scale={yScale}
              />
            )}
            {yScale && !multiple && (
              <YAxis
                label={t(yAxisLabel)}
                height={height}
                padding={padding}
                offsetTop={offsetTop}
                scale={yScale}
              />
            )}
          </svg>
        </div>
      </ConditionalWrapper>
    );
  }
}

Histogram.defaultProps = {
  width: 600,
  height: 600,
  padding: 80,
  offsetTop: 5,
  offsetRight: 7,
  yAxisLabel: 'Number of Stars',
  tooltipAccessors: ['temperature'],
  tooltipLabels: ['stars', 'Temperature'],
};

Histogram.propTypes = {
  data: PropTypes.object,
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
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  tooltipUnits: PropTypes.array,
  multiple: PropTypes.bool,
  t: PropTypes.func,
};

export default withTranslation()(Histogram);
