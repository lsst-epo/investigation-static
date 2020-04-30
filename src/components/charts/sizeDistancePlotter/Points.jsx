import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
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
      offsetTop,
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { id, name, label } = d;
          const key = `point-${id}-${i}`;
          const selected = !!find(selectedData, { id });
          const hovered = !!find(hoveredData, { id });
          const classes = classnames(`data-point-${name || id}`, 'data-point', {
            [pointClasses]: pointClasses,
            selected,
            hovered,
          });

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(d[xValueAccessor])}
              y={yScale(d[yValueAccessor]) + offsetTop}
              label={label}
              fill={null}
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
