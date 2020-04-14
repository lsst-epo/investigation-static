import React from 'react';
import PropTypes from 'prop-types';
import { max as d3Max } from 'd3-array';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { getMean } from '../../../lib/utilities';
import Unit from '../shared/unit/index.jsx';

class MeanBar extends React.PureComponent {
  getXScale() {
    const { bins, graphWidth, padding, offsetRight } = this.props;

    return d3ScaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([padding, graphWidth - offsetRight]);
  }

  maxHeight(data) {
    return d3Max(data, d => {
      return d.length;
    });
  }

  render() {
    const { bins, valueAccessor, yScale, offsetTop, data } = this.props;
    const width = 3;
    const modifier = 8;
    const mean = getMean(data, valueAccessor);
    const xScale = this.getXScale();
    const yMax = yScale(this.maxHeight(bins));
    const x = xScale(mean) - width / 2;
    const y = yMax + offsetTop - modifier;

    return (
      <g>
        <rect
          className="mean-bar"
          x={x}
          y={y}
          height={yScale(0) - yMax + modifier}
          width={width}
          fill="transparent"
        />
        <text className="mean-text" x={x} y={y - width} textAnchor="middle">
          <tspan className="inner-text">
            Mean: <Unit value={mean} type={valueAccessor} isSvg />
          </tspan>
        </text>
      </g>
    );
  }
}

MeanBar.propTypes = {
  data: PropTypes.array,
  bins: PropTypes.array,
  graphWidth: PropTypes.number,
  padding: PropTypes.number,
  yScale: PropTypes.func,
  valueAccessor: PropTypes.string,
  offsetTop: PropTypes.number,
  offsetRight: PropTypes.number,
};

export default MeanBar;
