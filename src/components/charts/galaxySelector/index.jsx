import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import 'd3-transition';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import { getAlertFromImageId } from './galaxySelectorUtilities.js';
import Blinker from '../shared/blinker/index.jsx';
import ElapsedTime from '../shared/elapsedTime/index.jsx';
import Points from './Points';
import Message from './Message';
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
      messageVisible: false,
      messageResponse: '',
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
    const { selectionCallback, preSelected, t } = this.props;

    if (!find(oldData, d) && !!d && !preSelected) {
      const selectedData = !oldData ? [d] : [...oldData, d];

      this.setState(
        prevState => ({
          ...prevState,
          selectedData,
          messageResponse: t(
            'widgets::supernova_selector_with_light_curve.messages.found'
          ),
          messageVisible: true,
        }),
        () => {
          const { selectedData: newData } = this.state;
          if (selectionCallback) {
            selectionCallback(newData, d);
          }
        }
      );
    } else if (find(oldData, d) && !!d && !preSelected) {
      this.setState(
        prevState => ({
          ...prevState,
          messageResponse: t(
            'widgets::supernova_selector_with_light_curve.messages.correct'
          ),
          messageVisible: false,
        }),
        () => {
          const { selectedData: newData } = this.state;
          if (selectionCallback) {
            selectionCallback(newData, d);
          }
        }
      );
    } else if (!d && !preSelected) {
      this.setState(
        prevState => ({
          ...prevState,
          messageResponse: t(
            'widgets::supernova_selector_with_light_curve.messages.incorrect'
          ),
          messageVisible: true,
        }),
        () => {
          if (selectionCallback) {
            selectionCallback(null, d);
          }
        }
      );
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
    const { blinkCallback, images, loop } = this.props;

    const nextBlink = this.getBlink(images, 1);
    const { activeImageIndex: nextActiveImageIndex } = nextBlink || {};

    if (loop === false && nextActiveImageIndex === images.length - 1) {
      this.stopBlink();
    }

    blinkCallback(nextBlink);
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

  toggleMessageVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      messageVisible: false,
    }));
  };

  getAlertDaysAndHours = (id, alerts) => {
    const currentAlert = getAlertFromImageId(id, alerts);
    const dateDiff = currentAlert.date - alerts[0].date;

    return {
      days: Math.round(dateDiff),
      hours: Math.round((24 / dateDiff) % 24),
    };
  };

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
      alerts,
      selectedData: selectedDataProp,
      color,
    } = this.props;

    const {
      xScale,
      yScale,
      loading,
      selectedData: selectedDataState,
      playing,
      messageResponse,
      messageVisible,
    } = this.state;

    const selectedData = selectedDataState || selectedDataProp;
    const svgClasses = classnames('svg-chart', galaxySelector, {
      loading,
      loaded: !loading,
    });

    return (
      <div className="supernova-selector-container">
        <div className="svg-container">
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
                color={color}
                active={activeGalaxy}
              />
            )}
          </svg>
          <Message
            response={messageResponse}
            visible={messageVisible}
            toggler={this.toggleMessageVisibility}
          />
          {image ? (
            <img
              className={singleImage}
              src={image.mediaPath}
              alt={image.altText}
            />
          ) : (
            <>
              <Blinker
                images={images}
                activeId={activeImageId}
                playing={playing}
                handleStartStop={this.startStopBlink}
                handleNext={this.onNextBlink}
                handlePrevious={this.onPreviousBlink}
              />
              {alerts && (
                <ElapsedTime
                  {...this.getAlertDaysAndHours(activeImageId, alerts)}
                />
              )}
            </>
          )}
        </div>
      </div>
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
  color: PropTypes.string,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  selectionCallback: PropTypes.func,
  blinkCallback: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation()(GalaxySelector);
