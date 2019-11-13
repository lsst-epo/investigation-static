import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import Button from '../../site/button';
import ArrowLeft from '../../site/icons/ArrowLeft';
import ArrowRight from '../../site/icons/ArrowRight';
import More from '../../site/icons/More';
import { arrayify } from '../../../lib/utilities.js';
import Blinker from './Blinker';
import Points from './Points';
import Legend from '../shared/Legend';
import styles from './styles.module.scss';

class SupernovaSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      xScale: d3ScaleLinear()
        .domain(props.xDomain)
        .range([props.padding, props.width]),
      yScale: d3ScaleLinear()
        .domain(props.yDomain)
        .range([props.height - props.padding, 0]),
      selectedData: null,
    };

    this.svgEl = React.createRef();
  }

  componentDidMount() {
    this.updateScatterPlot();
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.updateScatterPlot();
    }
  }

  toggleSelection(d) {
    const { selectedData } = this.state;

    this.setState(
      prevState => ({
        ...prevState,
        selectedData: selectedData ? null : arrayify(d),
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

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    d3Select(this.svgEl.current).on('click', () => {
      // remove styles and selections when click on non-point
      const pointData = d3Select(d3Event.target).datum();

      if (pointData) {
        this.toggleSelection(pointData);
      }
    });
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
      data.forEach((cluster, i) => {
        if (i === data.length - 1) {
          d3Select(this.svgEl.current)
            .selectAll(`.data-point.${cluster.className}`)
            .data(cluster.data)
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
            .selectAll(`.data-point${cluster.className}`)
            .data(cluster.data);
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
  updateScatterPlot() {
    const { preSelected } = this.props;
    this.updatePoints();

    if (!preSelected) {
      // console.log('adding event listeners');
      this.addEventListeners();
    }
  }

  render() {
    const {
      activeId,
      data,
      width,
      height,
      images,
      preSelected,
      multiple,
      selection,
      xValueAccessor,
      yValueAccessor,
      legend,
      name,
    } = this.props;
    const { xScale, yScale, loading, selectedData } = this.state;

    const svgClasses = classnames('svg-chart', styles.supernovaSelector, {
      loading,
      loaded: !loading,
    });

    return (
      <>
        <div className="svg-container supernova-selector-container">
          {loading && (
            <CircularProgress
              id={`${name}-loader`}
              className="chart-loader"
              scale={3}
            />
          )}
          {legend && !loading && <Legend content={legend} />}
          <svg
            className={svgClasses}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${width} ${height}`}
            ref={this.svgEl}
            style={{
              opacity: 0,
            }}
          >
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
                pointClasses={`supernova supernova-${name}`}
              />
            )}
          </svg>
          <Blinker images={images} activeId={activeId} />
        </div>
        <div className="controls">
          <Button icon iconEl={<ArrowLeft />} />
          <Button icon iconEl={<More />} />
          <Button icon iconEl={<ArrowRight />} />
        </div>
      </>
    );
  }
}

SupernovaSelector.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  xDomain: [0, 1200],
  yDomain: [0, 1200],
  xValueAccessor: 'x',
  yValueAccessor: 'y',
};

SupernovaSelector.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  data: PropTypes.array,
  images: PropTypes.array,
  activeId: PropTypes.string,
  selection: PropTypes.array,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
  name: PropTypes.string,
  selectionCallback: PropTypes.func,
};

export default SupernovaSelector;
