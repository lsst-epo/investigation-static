import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import { getAlertFromImageId } from './galaxySelectorUtilities.js';
import Blinker from '../shared/blinker/index.jsx';
import Points from './Points';
import Legend from '../shared/legend/index.jsx';

import { galaxySelector, singleImage } from './galaxy-selector.module.scss';

class GalaxySelector extends React.PureComponent {
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
      playing: false,
    };

    this.svgEl = React.createRef();
    this.blinkerInterval = 0;
  }

  componentDidMount() {
    const { autoplay, preSelected, selectedData, data } = this.props;
    if (data) {
      this.updatePoints();

      if (autoplay) {
        this.startBlink();
      }

      if (preSelected) {
        this.setSelection(data);
      }
    } else if (selectedData) {
      this.setSelection(selectedData);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      activeGalaxy,
      data,
      selectedData,
      preSelected,
      xDomain,
      yDomain,
    } = this.props;
    const { playing } = this.state;
    // const isNewData = prevProps.data !== data;
    const isNewActiveGalaxy = prevProps.activeGalaxy !== activeGalaxy;
    const isNewSelectedData = prevProps.selectedData !== selectedData;

    if (isNewActiveGalaxy || isNewSelectedData) {
      this.updatePoints();
      this.setSelection(preSelected ? data : selectedData);
      if (!playing) {
        this.stopBlink();
      } else if (playing) {
        this.startBlink();
      }
    }

    if (xDomain !== prevProps.xDomain || yDomain !== prevProps.yDomain) {
      this.updateScale();
    }
  }

  componentWillUnmount() {
    clearInterval(this.blinkerInterval);
    this.removeEventListeners();
  }

  updateScale() {
    const { xDomain, yDomain, padding, width, height } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        xScale: d3ScaleLinear()
          .domain(xDomain)
          .range([padding, width]),
        yScale: d3ScaleLinear()
          .domain(yDomain)
          .range([height - padding, 0]),
      }),
      this.updatePoints
    );
  }

  clearSelection() {
    this.setState(prevState => ({
      ...prevState,
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
    const { selectedData: oldData } = this.state;
    const { selectionCallback, preSelected } = this.props;

    if (!find(oldData, d) && !!d && !preSelected) {
      const selectedData = !oldData ? [d] : [...oldData, d];

      this.setState(
        prevState => ({
          ...prevState,
          selectedData,
        }),
        () => {
          const { selectedData: newData } = this.state;
          if (selectionCallback) {
            selectionCallback(newData, d);
          }
        }
      );
    } else if (selectionCallback) {
      selectionCallback(null, d);
    }
  }

  getBlink(images, direction = 0) {
    const { activeImageIndex: currentIndex, alerts } = this.props;
    const index = currentIndex + direction;
    const lastIndex = images.length - 1;
    let activeImageIndex = index;

    if (index > lastIndex) {
      activeImageIndex = 0;
    }

    if (index < 0) {
      activeImageIndex = lastIndex;
    }

    const activeImageId = images[activeImageIndex].id;
    const activeAlert = getAlertFromImageId(activeImageId, alerts);
    return { activeImageId, activeImageIndex, activeAlert };
  }

  startBlink() {
    clearInterval(this.blinkerInterval);
    this.blinkerInterval = setInterval(this.nextBlink, 200);

    this.setState(prevState => ({
      ...prevState,
      playing: true,
    }));
  }

  stopBlink() {
    clearInterval(this.blinkerInterval);
    this.setState(prevState => ({
      ...prevState,
      playing: false,
    }));
  }

  nextBlink = () => {
    const { blinkCallback, images } = this.props;
    blinkCallback(this.getBlink(images, 1));
  };

  previousBlink = () => {
    const { blinkCallback, images } = this.props;
    blinkCallback(this.getBlink(images, -1));
  };

  startStopBlink = () => {
    const { playing } = this.state;

    if (playing) {
      this.stopBlink();
    } else {
      this.startBlink();
    }
  };

  onNextBlink = () => {
    const { images } = this.props;

    this.stopBlink();
    this.nextBlink(images);
  };

  onPreviousBlink = () => {
    const { images } = this.props;

    this.stopBlink();
    this.previousBlink(images);
  };

  // add event listeners to plot
  addEventListeners() {
    d3Select(this.svgEl.current).on('click', () => {
      const pointData = d3Select(d3Event.target).datum();

      this.toggleSelection(pointData || null);
    });
  }

  // remove event listeners from plot
  removeEventListeners() {
    d3Select(this.svgEl.current).on('click', null);
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
      if (loading) {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    }

    this.addEventListeners();
  }

  render() {
    const {
      data,
      width,
      height,
      image,
      images,
      name,
      multiple,
      xValueAccessor,
      yValueAccessor,
      legend,
      activeImageId,
      activeGalaxy,
      selectedData: selectedDataProp,
    } = this.props;

    const {
      xScale,
      yScale,
      loading,
      selectedData: selectedDataState,
      playing,
    } = this.state;

    const selectedData = selectedDataState || selectedDataProp;
    const svgClasses = classnames('svg-chart', galaxySelector, {
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
          >
            {data &&
              multiple &&
              data.map((set, i) => {
                const key = `points-${set.className}-${i}`;
                return (
                  <Points
                    key={key}
                    data={set.data}
                    {...{
                      selectedData,
                      xScale,
                      yScale,
                      xValueAccessor,
                      yValueAccessor,
                    }}
                    pointClasses={set.className}
                    active={activeGalaxy}
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
                pointClasses={`galaxy galaxy-${data.name}`}
                active={activeGalaxy}
              />
            )}
          </svg>
          {image ? (
            <img
              className={singleImage}
              src={image.mediaPath}
              alt={image.altText}
            />
          ) : (
            <Blinker
              images={images}
              activeId={activeImageId}
              playing={playing}
              handleStartStop={this.startStopBlink}
              handleNext={this.onNextBlink}
              handlePrevious={this.onPreviousBlink}
            />
          )}
        </div>
      </>
    );
  }
}

GalaxySelector.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  xDomain: [0, 1200],
  yDomain: [0, 1200],
  xValueAccessor: 'ra',
  yValueAccessor: 'dec',
};

GalaxySelector.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  data: PropTypes.array,
  selectedData: PropTypes.array,
  activeGalaxy: PropTypes.object,
  alerts: PropTypes.array,
  image: PropTypes.object,
  images: PropTypes.array,
  activeImageId: PropTypes.number,
  activeImageIndex: PropTypes.number,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  preSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  legend: PropTypes.node,
  name: PropTypes.string,
  autoplay: PropTypes.bool,
  selectionCallback: PropTypes.func,
  blinkCallback: PropTypes.func,
};

export default GalaxySelector;
