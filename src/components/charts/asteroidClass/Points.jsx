import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Point from './Point.jsx';

class Points extends React.PureComponent {
  render() {
    const { data, xScale, yScale, pointClasses, offsetTop } = this.props;

    return (
      <g className="data-points">
        {data.map(d => {
          const filters = ['r', 'i', 'z'];
          const { id } = d;
          const classes = classnames(`data-point-${id}`, 'data-point', {
            [pointClasses]: pointClasses,
          });

          return filters.map(filter => {
            return (
              <Point
                key={`point-${filter}-${id}`}
                classes={classes}
                x={xScale(filter)}
                y={yScale(d[filter]) + offsetTop}
              />
            );
          });
        })}
      </g>
    );
  }
}

Points.propTypes = {
  data: PropTypes.array,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  pointClasses: PropTypes.string,
  offsetTop: PropTypes.number,
};

export default Points;
