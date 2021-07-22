import React from 'react';
import PropTypes from 'prop-types';
import { getElDims } from '../../../lib/utilities.js';

class Trendline extends React.Component {
  constructor(props) {
    super(props);
    this.label = React.createRef();
    this.offset = 5;
  }

  getMidPoint(a, b) {
    if (!a || !b) return null;
    return a.map((pos, i) => {
      return (pos + b[i]) / 2;
    });
  }

  getLineTransform(start, terminus) {
    const { pointUp } = this.props;

    if (pointUp) {
      return `rotate(180, ${this.getMidPoint(start, terminus)})`;
    }

    return `rotate(0)`;
  }

  getLabelPos(terminus, rectDims) {
    const [x, y] = terminus;
    const { width, height } = rectDims;
    return [x - width / 2, height / 2 + y / 2];
  }

  getStart() {
    const { xScale, domain, padding } = this.props;
    const offset = padding / 2;
    return [xScale(domain[0][1]) - offset, offset];
  }

  getTerminus() {
    const { xScale, yScale, domain, padding } = this.props;
    const offset = padding / 2;
    return [xScale(domain[0][1]) - offset, yScale(domain[0][0]) - offset];
  }

  render() {
    const { text } = this.props;
    const start = this.getStart();
    const terminus = this.getTerminus();
    const rectDims = getElDims(this.label.current);
    const textPos = this.getLabelPos(terminus, rectDims);

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
        <g>
          <line
            x1={start[0]}
            y1={start[1]}
            x2={terminus[0]}
            y2={terminus[1]}
            strokeWidth={2}
            stroke="#000000"
            strokeDasharray="10"
            markerEnd="url(#triangle)"
            transform={this.getLineTransform(start, terminus)}
          />
          <rect
            width={rectDims.width + 2 * this.offset}
            height={rectDims.height + 2 * this.offset}
            x={textPos[0] - this.offset}
            y={textPos[1] - rectDims.height}
            fill="#ffffff"
            strokeWidth="2"
            stroke="#000000"
          ></rect>

          <text ref={this.label} x={textPos[0]} y={textPos[1]}>
            {text}
          </text>
        </g>
      </svg>
    );
  }
}

Trendline.propTypes = {
  text: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  padding: PropTypes.number,
  domain: PropTypes.array,
  pointUp: PropTypes.bool,
};

export default Trendline;
