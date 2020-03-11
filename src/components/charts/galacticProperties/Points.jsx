import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';
import { invisible } from './galactic-properties.module.scss';

class Points extends React.PureComponent {
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
      offsetTop,
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { id, name, label, color, use_color: useColor } = d;
          const key = `point-${id}-${i}`;
          const plottingColor = yValueAccessor === 'color';
          const x = d[xValueAccessor];
          const y = d[yValueAccessor];
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const classes = classnames(`data-point-${name || id}`, 'data-point', {
            [pointClasses]: pointClasses,
            selected,
            hovered,
            [invisible]: !useColor && plottingColor,
          });
          const blueColorPercent = Math.floor((color / 2) * 100);
          const redColorPercent = 100 - blueColorPercent;
          const colorShift = `rgb(${redColorPercent}%, 0%, ${blueColorPercent}%)`;

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(x)}
              y={yScale(y) + offsetTop}
              label={label}
              fill={plottingColor ? colorShift : null}
            />
          );
        })}
      </g>
    );
  }
}

Points.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
  hoveredData: PropTypes.array,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  pointClasses: PropTypes.string,
  offsetTop: PropTypes.number,
};

export default Points;
