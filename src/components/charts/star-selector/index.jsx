import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import Points from './Points.jsx';
import Legend from '../charts/shared/legend/index.jsx';
import Lasso from '../charts/shared/Lasso.jsx';

class StarSelector extends React.Component {
  static defaultProps = {
    width: 600,
    height: 600,
    padding: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      showLasso: false,
      dragLine: [],
      dragLoop: [],
      loading: true,
      xScale: d3ScaleLinear()
        .domain(props.xDomain)
        .range([props.padding, props.width]),
      yScale: d3ScaleLinear()
        .domain(props.yDomain)
        .range([props.height - props.padding, 0]),
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

  onDragStart = () => {
    this.setState(
      prevState => ({
        ...prevState,
        showLasso: false,
      }),
      () => {
        const { activeId, dataLassoCallback } = this.props;

        if (dataLassoCallback) {
          dataLassoCallback(activeId, []);
        }
      }
    );
  };

  onDrag = () => {
    const { showLasso } = this.state;

    if (!showLasso) {
      this.setState(prevState => ({
        ...prevState,
        showLasso: true,
      }));
    }
  };

  onDragEnd = d => {
    const { activeId, dataLassoCallback } = this.props;

    if (dataLassoCallback) {
      dataLassoCallback(activeId, d);
    }
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    d3Select(this.svgEl.current).on('click', () => {
      if (d3Event.target.classList[0] !== 'data-point') {
        const { activeId, dataLassoCallback } = this.props;

        if (dataLassoCallback) {
          dataLassoCallback(activeId, []);
        }
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
      data,
      width,
      height,
      backgroundImage,
      preSelected,
      multiple,
      selection,
      xValueAccessor,
      yValueAccessor,
      legend,
    } = this.props;
    const { showLasso, xScale, yScale, loading } = this.state;

    const svgClasses = classnames('svg-chart star-selector', {
      loading,
      loaded: !loading,
    });

    return (
      <div className="svg-container star-selector-container">
        {loading && (
          <CircularProgress
            className="chart-loader"
            scale={3}
            value={loading}
          />
        )}
        {legend && !loading && <Legend content={legend} />}
        <svg
          key="scatter-plot svg-chart"
          className={svgClasses}
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${width} ${height}`}
          ref={this.svgEl}
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {data &&
            multiple &&
            data.map((cluster, i) => {
              const key = `points-${cluster.className}-${i}`;
              return (
                <Points
                  key={key}
                  pointClasses={cluster.className}
                  data={cluster.data}
                  selectedData={preSelected ? cluster.data : selection}
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
              selectedData={preSelected ? data : selection}
              xScale={xScale}
              yScale={yScale}
              xValueAccessor={xValueAccessor}
              yValueAccessor={yValueAccessor}
            />
          )}
          {!preSelected && (
            <Lasso
              active={showLasso}
              lassoableEl={this.svgEl}
              dragCallback={this.onDrag}
              dragStartCallback={this.onDragStart}
              dragEndCallback={this.onDragEnd}
            />
          )}
        </svg>
      </div>
    );
  }
}

StarSelector.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  data: PropTypes.array,
  activeId: PropTypes.string,
  selection: PropTypes.array,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  dataLassoCallback: PropTypes.func,
  backgroundImage: PropTypes.any,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
};

export default StarSelector;
