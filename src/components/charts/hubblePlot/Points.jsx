import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';

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
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { source_id: id, name, label, color } = d;
          const xVal = d[xValueAccessor];
          const yVal = d[yValueAccessor];
          if (!xVal || !yVal) return null;
          const key = `point-${id}-${i}`;
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const classes = classnames(`data-point-${name}`, 'data-point', {
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
              x={xScale(d[xValueAccessor])}
              y={yScale(d[yValueAccessor])}
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
};

export default Points;
