import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import find from 'lodash/find';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import { getNameFromImage } from './supernovaSelectorUtilities.js';
import Blinker from './Blinker';
import BlinkerControls from './BlinkerControls';
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
      playing: false,
    };

    this.svgEl = React.createRef();
    this.blinkerInterval = null;
  }

  componentDidMount() {
    const { autoplay, preSelected, data } = this.props;

    this.updateSupernovaSelector();

    if (autoplay) {
      this.startBlink();
    }

    if (preSelected) {
      this.setSelection(data);
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedData } = this.state;
    const { data, isAnswered, preSelected } = this.props;

    if (prevProps.data !== data) {
      this.updateSupernovaSelector();
    }

    if (isAnswered && !selectedData) {
      this.toggleSelection(data);
    } else if (!isAnswered && !preSelected && selectedData) {
      this.clearSelection();
    }
  }

  componentWillUnmount() {
    clearInterval(this.blinkerInterval);
    this.removeEventListeners();
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
    this.setState(
      prevState => ({
        ...prevState,
        selectedData: arrayify(d),
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

  getAlertFromImageId(imageId, alerts) {
    const newAlert = find(alerts, alert => {
      return imageId === alert.image_id;
    });

    return newAlert;
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

    const activeImageId = getNameFromImage(images[activeImageIndex]);
    const activeAlert = this.getAlertFromImageId(activeImageId, alerts);
    return { activeImageId, activeImageIndex, activeAlert };
  }

  startBlink() {
    const { images } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        playing: true,
      }),
      () => {
        this.blinkerInterval = setInterval(() => {
          this.nextBlink(images);
        }, 200);
      }
    );
  }

  stopBlink() {
    this.setState(
      prevState => ({
        ...prevState,
        playing: false,
      }),
      () => {
        clearInterval(this.blinkerInterval);
      }
    );
  }

  nextBlink(images) {
    const { blinkCallback } = this.props;
    blinkCallback(this.getBlink(images, 1));
  }

  previousBlink(images) {
    const { blinkCallback } = this.props;
    blinkCallback(this.getBlink(images, -1));
  }

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
    this.nextBlink(images, this.stopBlink);
  };

  onPreviousBlink = () => {
    const { images } = this.props;

    this.stopBlink();
    this.previousBlink(images);
  };

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

  // add event listeners to Scatterplot and Points
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
            .data(supernova.data)
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
            .selectAll(`.data-point${supernova.className}`)
            .data(supernova.data);
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
  updateSupernovaSelector() {
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
      images,
      multiple,
      xValueAccessor,
      yValueAccessor,
      legend,
      name,
      activeImageId,
    } = this.props;

    const { xScale, yScale, loading, selectedData, playing } = this.state;

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
          <Blinker images={images} activeId={activeImageId} />
        </div>
        <BlinkerControls
          playing={playing}
          handleStartStop={this.startStopBlink}
          handleNext={this.onNextBlink}
          handlePrevious={this.onPreviousBlink}
        />
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
  alerts: PropTypes.array,
  images: PropTypes.array,
  activeImageId: PropTypes.string,
  activeImageIndex: PropTypes.number,
  isAnswered: PropTypes.bool,
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
  blinkCallback: PropTypes.func.isRequired,
};

export default SupernovaSelector;
