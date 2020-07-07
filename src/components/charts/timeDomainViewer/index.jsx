import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import classnames from 'classnames';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { arrayify } from '../../../lib/utilities.js';
import Blinker from '../shared/blinker/index.jsx';
import Legend from './Legend';
import Point from './Point';

import { timeDomainViewer } from './time-domain-viewer.module.scss';

class TimeDomainViewer extends React.PureComponent {
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
    const { data, selectedData, preSelected, autoplay } = this.props;
    const { playing } = this.state;
    const isNewData = prevProps.data !== data;
    const isNewSelectedData = prevProps.selectedData !== selectedData;

    if (isNewData && autoplay) {
      this.startBlink();
    }

    if (isNewData || isNewSelectedData) {
      this.updatePoints();
      this.setSelection(preSelected ? data : selectedData);

      if (!playing) {
        this.stopBlink();
      } else if (playing || autoplay) {
        this.restartBlink();
      }
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
    const { selectionCallback } = this.props;
    if (d) selectionCallback();
  }

  getBlink(images, direction = 0) {
    const { activeImageIndex: currentIndex, data } = this.props;
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
    const activeAlert = find(data, { id: activeImageId });

    return { activeImageId, activeImageIndex, activeAlert };
  }

  restartBlink() {
    clearInterval(this.blinkerInterval);
    this.startBlink();
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
    const { data, preSelected } = this.props;
    const { loading } = this.state;

    if (!data) {
      return;
    }

    if (isEmpty(data) && preSelected && loading) {
      this.setState(prevState => ({
        ...prevState,
        loading: false,
      }));
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

    if (!preSelected) this.addEventListeners();
  }

  render() {
    const {
      width,
      height,
      images,
      xValueAccessor,
      yValueAccessor,
      name,
      activeImageId,
      activeAlert,
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
    const svgClasses = classnames('svg-chart', timeDomainViewer, {
      loading,
      loaded: !loading,
    });

    return (
      <>
        <Legend {...{ name, activeAlert, selectedData }} />
        <div className="svg-container supernova-selector-container">
          {loading && (
            <CircularProgress
              id={`${name}-loader`}
              className="chart-loader"
              scale={3}
            />
          )}
          <svg
            className={svgClasses}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${width} ${height}`}
            ref={this.svgEl}
          >
            <Point
              selectedData={selectedData}
              active={activeAlert}
              xScale={xScale}
              yScale={yScale}
              xValueAccessor={xValueAccessor}
              yValueAccessor={yValueAccessor}
            />
          </svg>
          {!loading && images && (
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

TimeDomainViewer.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  xDomain: [0, 1200],
  yDomain: [0, 1200],
  xValueAccessor: 'ra',
  yValueAccessor: 'dec',
};

TimeDomainViewer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  data: PropTypes.array,
  selectedData: PropTypes.array,
  activeAlert: PropTypes.object,
  images: PropTypes.array,
  activeImageId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  activeImageIndex: PropTypes.number,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  preSelected: PropTypes.bool,
  // multiple: PropTypes.bool,
  name: PropTypes.string,
  autoplay: PropTypes.bool,
  selectionCallback: PropTypes.func,
  blinkCallback: PropTypes.func,
};

export default TimeDomainViewer;
