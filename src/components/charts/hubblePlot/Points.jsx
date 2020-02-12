import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';
import { notActive, invisible } from './hubble-plot.module.scss';

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
          const { id, name, label, color } = d;
          const key = `point-${id}-${i}`;
          const x = d[xValueAccessor];
          const y = d[yValueAccessor];
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const classes = classnames(`data-point-${name}`, 'data-point', {
            [pointClasses]: pointClasses,
            selected,
            hovered,
            [notActive]: (selectedData || hoveredData) && !selected && !hovered,
            [invisible]: !x || !y,
          });

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(x)}
              y={yScale(y) + offsetTop}
              label={label}
              fill={color}
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
