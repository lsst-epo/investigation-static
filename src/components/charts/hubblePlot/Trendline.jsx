import React from 'react';
import PropTypes from 'prop-types';
import { select as d3Select, mouse as d3mouse } from 'd3-selection';
import { formatValue, getElDims } from '../../../lib/utilities.js';

class Trendline extends React.Component {
  constructor(props) {
    super(props);

    this.background = React.createRef();
    this.label = React.createRef();
    this.offset = 5;

    this.state = {
      terminus: null,
      trendlineSelected: false,
    };
  }

  componentDidMount() {
    this.handleEventListeners();
  }

  componentDidUpdate() {
    this.handleEventListeners();
  }

  componentWillUnmount() {
    const $background = d3Select(this.background.current);
    this.removeEventListeners($background);
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

    if (!trendlineSelected) {
      $background.on('mousemove', this.mouseMoveHandler);
    }

    $background.on('click', () => {
      if (trendlineSelected) {
        $background.on('mousemove', this.mouseMoveHandler);
        this.setState(
          prevState => ({
            ...prevState,
            trendlineSelected: false,
          }),
          clickHandler
        );
      } else {
        $background.on('mousemove', null);
        this.setState(
          prevState => ({
            ...prevState,
            trendlineSelected: true,
          }),
          clickHandler
        );
      }
    });
  }

  removeEventListeners($background) {
    $background.on('mousemove', null);
    $background.on('click', null);
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

    const { xScale, yScale } = this.props;
    const [low, high] = yScale.domain();
    const y = high - (high - low) * 0.05;
    const x = y / slope;

    return [xScale(x), yScale(y)];
  }

  // getLabelDims() {
  //   const $slopeLabel = this.label.current;

  //   if ($slopeLabel) {
  //     const { width, height } = $slopeLabel.getBBox();
  //     return { width, height };
  //   }

  //   return { width: 0, height: 0 };
  // }

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
              strokeWidth={1}
              stroke="#1d4a79"
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
                slope = {formatValue(slope || hubbleConstant, 1)}
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
