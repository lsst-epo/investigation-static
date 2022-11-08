import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select, mouse as d3mouse } from 'd3-selection';
import { Trans } from 'gatsby-plugin-react-i18next';
import { formatValue, getElDims } from '../../../lib/utilities.js';

class Trendline extends React.Component {
  constructor(props) {
    super(props);

    this.background = React.createRef();
    this.label = React.createRef();
    this.offset = 5;

    this.state = {
      slope: null,
      terminus: null,
      trendlineSelected: false,
    };
  }

  componentDidMount() {
    this.handleEventListeners();
  }

  componentDidUpdate(prevProps) {
    const { hubbleConstant } = this.props;
    const { hubbleConstant: prevHubbleConstant } = prevProps;

    if (!hubbleConstant && prevHubbleConstant) {
      this.resetSlope();
    }

    this.handleEventListeners();
  }

  componentWillUnmount() {
    const $background = d3Select(this.background.current);
    this.removeEventListeners($background);
  }

  resetSlope() {
    this.setState(prevState => ({
      ...prevState,
      slope: null,
      terminus: null,
      trendlineSelected: false,
    }));
  }

  mouseMoveHandler = () => {
    const { xScale, yScale } = this.props;
    const $background = this.background.current;
    const terminus = d3mouse($background);
    const slope = yScale.invert(terminus[1]) / xScale.invert(terminus[0]);

    this.setState(prevState => ({
      ...prevState,
      terminus,
      slope: formatValue(slope, 1),
    }));
  };

  addEventListeners($background) {
    const { clickHandler } = this.props;
    const { trendlineSelected } = this.state;

    $background.on('mousedown', () => {
      if (trendlineSelected) {
        this.setState(prevState => ({
          ...prevState,
          trendlineSelected: false,
        }));
      }

      $background.on('mousemove', this.mouseMoveHandler);
    });

    $background.on('mouseup', () => {
      $background.on('mousemove', null);

      this.setState(
        prevState => ({
          ...prevState,
          trendlineSelected: true,
        }),
        () => {
          if (!trendlineSelected) {
            clickHandler();
          }
        }
      );
    });
  }

  removeEventListeners($background) {
    $background.on('mousemove', null);
    $background.on('mousedown', null);
    $background.on('mouseup', null);
  }

  handleEventListeners() {
    const { isInteractable } = this.props;
    const $background = d3Select(this.background.current);

    if (isInteractable) {
      this.addEventListeners($background);
    } else {
      this.removeEventListeners($background);
    }
  }

  terminusFromSlope(slope) {
    if (!slope) return null;
    const bufferPercent = 0.08;
    const { xScale, yScale } = this.props;
    const [minY, maxY] = yScale.domain();
    const [minX, maxX] = xScale.domain();
    const bufferedMaxX = maxX - (maxX - minX) * bufferPercent;

    let y = maxY - (maxY - minY) * bufferPercent;
    let x = y / slope;

    if (x > bufferedMaxX) {
      x = bufferedMaxX;
      y = slope * x;
    }

    return [xScale(x), yScale(y)];
  }

  getMidPoint(a, b) {
    if (!a || !b) return null;
    return a.map((pos, i) => {
      return (pos + b[i]) / 2;
    });
  }

  render() {
    const { terminus: terminusState, slope } = this.state;
    const {
      hubbleConstant,
      captureAreaX,
      captureAreaY,
      captureAreaWidth,
      captureAreaHeight,
      xScale,
      yScale,
      isInteractable,
    } = this.props;

    const start = [xScale(0), yScale(0)];
    const terminus = terminusState || this.terminusFromSlope(hubbleConstant);
    const textPos = this.getMidPoint(terminus, start);
    const rectDims = getElDims(this.label.current);

    return (
      <svg>
        <defs>
          <marker
            id="triangle"
            viewBox="0 0 10 10"
            refX="1"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="15"
            markerHeight="15"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        {terminus && (
          <g>
            <line
              x1={start[0]}
              x2={terminus[0]}
              y1={captureAreaY + start[1]}
              y2={terminus[1]}
              strokeWidth={2}
              stroke="#000000"
              strokeDasharray="10"
              markerEnd="url(#triangle)"
            />
            {textPos && rectDims && (
              <rect
                width={rectDims.width + 2 * this.offset}
                height={rectDims.height + 2 * this.offset}
                x={textPos[0] - this.offset}
                y={textPos[1] - rectDims.height}
                fill="#ffffff"
                strokeWidth="2"
                stroke="#000000"
              ></rect>
            )}
            {textPos && (
              <text ref={this.label} x={textPos[0]} y={textPos[1]}>
                <Trans
                  values={{ slope: formatValue(slope || hubbleConstant, 1) }}
                >
                  widgets::hubble_plotter.labels.trendline
                </Trans>
              </text>
            )}
          </g>
        )}
        {isInteractable && (
          <rect
            ref={this.background}
            x={captureAreaX}
            y={captureAreaY}
            width={captureAreaWidth}
            height={captureAreaHeight}
            fill="transparent"
          />
        )}
      </svg>
    );
  }
}

Trendline.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  captureAreaX: PropTypes.number,
  captureAreaY: PropTypes.number,
  captureAreaWidth: PropTypes.number,
  captureAreaHeight: PropTypes.number,
  isInteractable: PropTypes.bool,
  hubbleConstant: PropTypes.number,
  clickHandler: PropTypes.func,
};

export default Trendline;
