import React from 'react';
import PropTypes from 'prop-types';
import Point from './Point.jsx';

class Line extends React.PureComponent {
  render() {
    const {
      filters,
      filterValues,
      offsetTop,
      xScale,
      yScale,
      lineClasses,
      pointClasses,
    } = this.props;

    return (
      <g>
        {filters.map((filter, i) => {
          const nextFilter = filters[i + 1];
          if (!nextFilter) {
            return (
              <g key={`point-${filter}-${nextFilter}`}>
                <Point
                  classes={pointClasses}
                  x={xScale(filter)}
                  y={yScale(filterValues[filter]) + offsetTop}
                />
              </g>
            );
          }

          return (
            <g key={`line-${filter}-${nextFilter}`}>
              <line
                className={lineClasses}
                x1={xScale(filter)}
                y1={yScale(filterValues[filter]) + offsetTop}
                x2={xScale(nextFilter)}
                y2={yScale(filterValues[nextFilter]) + offsetTop}
                strokeWidth={2}
              />
              <Point
                classes={pointClasses}
                x={xScale(filter)}
                y={yScale(filterValues[filter]) + offsetTop}
              />
            </g>
          );
        })}
      </g>
    );
  }
}

Line.propTypes = {
  filterValues: PropTypes.object,
  filters: PropTypes.array,
  offsetTop: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  lineClasses: PropTypes.string,
  pointClasses: PropTypes.string,
};

export default Line;
