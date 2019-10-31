import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
// import { datumInData } from '../../lib/utilities.js';
import Point from './Point.jsx';
// import Sun from './Sun.jsx';

class Points extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      colors: [
        { temp: 3000, color: '#ff0000' },
        { temp: 6000, color: '#ffff00' },
        { temp: 8000, color: '#ffffff' },
        { temp: 25000, color: '#0000ff' },
      ],
    };
  }

  rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); // eslint-disable-line
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
    }

    return null;
  }

  getRange(temp) {
    const { colors } = this.state;
    const length = colors.length; // eslint-disable-line

    let i = 0;
    let range = null;

    while (i < length) {
      if (temp <= colors[i].temp) {
        range = [colors[i - 1], colors[i]];
        i = length;
      }

      i += 1;
    }

    return range;
  }

  getFill(temp) {
    const range = this.getRange(temp);
    const modifier = (range[1].temp - temp) / (range[1].temp - range[0].temp);
    const rgb1 = this.hexToRgb(range[0].color);
    const rgb2 = this.hexToRgb(range[1].color);

    const w = modifier * 2 - 1;
    const w1 = (w + 1) / 2.0;
    const w2 = 1 - w1;

    const rgb = {
      r: parseInt(rgb1.r * w1 + rgb2.r * w2, 10),
      g: parseInt(rgb1.g * w1 + rgb2.g * w2, 10),
      b: parseInt(rgb1.b * w1 + rgb2.b * w2, 10),
    };

    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  render() {
    const {
      data,
      selectedData,
      hoveredData,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
      pointClasses,
      // includeSun,
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { source_id: id } = d;
          const key = `point-${id}-${i}`;
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const temp = d[xValueAccessor];
          const classes = classnames(`data-point-${id} data-point`, {
            [pointClasses]: pointClasses,
            selected,
            hovered,
            'not-active':
              (selectedData || hoveredData) && !selected && !hovered,
          });

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(temp)}
              y={yScale(d[yValueAccessor])}
              fill={this.getFill(temp)}
            />
          );
        })}
        {/*        {includeSun && (
          <Sun
            selectedData={selectedData}
            hoveredData={hoveredData}
            xScale={xScale}
            yScale={yScale}
            tabIndex="0"
          />
        )} */}
      </g>
    );
  }
}

Points.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.bool,
  hoveredData: PropTypes.bool,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.string,
  yScale: PropTypes.string,
  pointClasses: PropTypes.string,
  // includeSun: PropTypes.bool,
};

export default Points;
