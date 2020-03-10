import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import {
  select as d3Select,
  event as d3Event,
  mouse as d3mouse,
} from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { line as d3Line, curveCardinal as d3CurveCardinal } from 'd3-shape';
import 'd3-transition';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import PeakMagnitude from './PeakMagnitude';
import { closestPoint } from './lightCurveUtilities.js';
import styles from './light-curve.module.scss';

class LightCurveTemplate extends React.PureComponent {
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
      xScale: this.getXScale(xDomain, width, padding, offsetRight),
      yScale: this.getYScale(yDomain, height, padding, offsetTop),
      peakMagX: null,
      peakMagY: null,
    };

    this.svgEl = React.createRef();
    this.linePath = React.createRef();
    this.background = React.createRef();
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
      active,
      transform,
    } = this.props;

    if (transform && active) {
      const { x, y, k } = transform;
      this.rescale(d3ZoomIdentity.translate(x, y).scale(k));
    } else {
      this.setState(prevState => ({
        ...prevState,
        xScale: this.getXScale(xDomain, width, padding, offsetRight),
        yScale: this.getYScale(yDomain, height, padding, offsetTop),
      }));
    }
  }

  componentDidUpdate(prevProps) {
    const { data, interactableTemplates } = this.props;

    if (interactableTemplates) {
      this.addEventListeners();
    } else this.removeEventListeners();

    if (!prevProps.data !== data || !isEmpty(data)) {
      this.updateTemplate();
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

  templateSelection(transformEvent) {
    const { zoomCallback, type, templateAnswerId } = this.props;

    if (zoomCallback) {
      zoomCallback(templateAnswerId, { type, data: transformEvent });
    }
  }

  lazyTemplateSelection = debounce(this.templateSelection, 500);

  onZoom = () => {
    this.rescale(d3Event.transform);
    this.lazyTemplateSelection(d3Event.transform);
  };

  updateMag(callback) {
    const { peakMagAnswerId } = this.props;
    const $template = this.svgEl.current;
    const $linePath = this.linePath.current;
    const e = d3mouse($template);
    const closest = closestPoint($linePath, e);

    this.setState(
      prevState => ({
        ...prevState,
        peakMagX: closest[0],
        peakMagY: closest[1],
      }),
      () => {
        const { peakMagScale } = this.props;
        const { peakMagX, peakMagY } = this.state;
        const magnitude = peakMagScale.invert(peakMagY);

        if (callback) {
          callback(peakMagAnswerId, { x: peakMagX, y: peakMagY, magnitude });
        }
      }
    );
  }

  onPeakMagMouseMove = () => {
    this.updateMag();
  };

  onPeakMagClick = () => {
    const { peakMagCallback } = this.props;
    this.updateMag(peakMagCallback);
  };

  // add event listeners to Scatterplot and Points
  addEventListeners() {
    const { width, height, padding, offsetTop, offsetRight } = this.props;
    const $template = d3Select(this.svgEl.current);

    const zoom = d3Zoom()
      // .translateExtent([
      //   [-Infinity, offsetTop],
      //   [width - offsetRight, Infinity],
      // ])
      .scaleExtent([1, 20])
      .extent([
        [padding, offsetTop],
        [width - offsetRight, height - padding],
      ])
      .on('zoom', this.onZoom);

    $template.call(zoom);
  }

  removeEventListeners() {
    const $template = d3Select(this.svgEl.current);

    const zoom = d3Zoom().on('zoom', null);

    $template.call(zoom);
  }

  // bind data to elements and add styles and attributes
  updateTemplate() {
    this.updateLine();
  }

  updateLine() {
    const { data } = this.props;
    const { xScale, yScale } = this.state;
    const $lineEl = d3Select(this.linePath.current);

    return $lineEl.datum(data).attr(
      'd',
      d3Line()
        .x(d => {
          return xScale(d.x);
        })
        .y(d => {
          return yScale(d.y);
        })
        .curve(d3CurveCardinal)
    );
  }

  render() {
    const {
      data,
      active,
      width,
      height,
      padding,
      offsetTop,
      offsetRight,
      interactablePeakMag,
      peakMagX: peakMagXProp,
      peakMagY: peakMagYProp,
    } = this.props;

    const { peakMagY, peakMagX } = this.state;

    const svgClasses = classnames(styles.template, {
      loading: !data,
      [styles.loaded]: data,
    });

    const calcWidth = width - padding - offsetRight;
    const calcHeight = height - padding;

    return (
      <>
        {!data && active && (
          <CircularProgress
            id="graph-loading-progress"
            key="loading"
            className="chart-loader"
            scale={3}
          />
        )}
        {active && (
          <svg
            key="light-curve-template"
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
                  width={calcWidth}
                  height={calcHeight}
                />
              </clipPath>
            </defs>
            <g clipPath="url('#clip')">
              {data && (
                <path ref={this.linePath} className={styles.templateLine} />
              )}
              <PeakMagnitude
                peakMagX={peakMagX || peakMagXProp}
                peakMagY={peakMagY || peakMagYProp}
                captureAreaHeight={calcHeight}
                captureAreaX={padding}
                captureAreaY={offsetTop}
                captureAreaWidth={width}
                isInteractable={interactablePeakMag}
                mouseMoveHandler={this.onPeakMagMouseMove}
                clickHandler={this.onPeakMagClick}
              />
            </g>
          </svg>
        )}
      </>
    );
  }
}

LightCurveTemplate.defaultProps = {
  width: 600,
  height: 600,
  padding: 70,
  offsetTop: 7,
  offsetRight: 7,
  xDomain: [-20, 90],
  yDomain: [8, 0],
};

LightCurveTemplate.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  active: PropTypes.bool,
  transform: PropTypes.object,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
  peakMagScale: PropTypes.func,
  peakMagX: PropTypes.number,
  peakMagY: PropTypes.number,
  zoomCallback: PropTypes.func,
  peakMagCallback: PropTypes.func,
  interactableTemplates: PropTypes.bool,
  interactablePeakMag: PropTypes.bool,
  peakMagAnswerId: PropTypes.string,
  templateAnswerId: PropTypes.string,
};

export default LightCurveTemplate;
