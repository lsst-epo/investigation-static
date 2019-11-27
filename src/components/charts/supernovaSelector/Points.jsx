import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import Point from './Point.jsx';

class Points extends React.PureComponent {
  render() {
    const {
      selectedData,
      data,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
      pointClasses,
    } = this.props;
    return (
      <g className={`data-points ${pointClasses}`}>
        {data.map((d, i) => {
          const { id } = d;
          const key = `point-${id}-${i}`;
          const selected = includes(selectedData, d);

          return (
            <Point
              key={key}
              classes={pointClasses}
              x={xScale(d[xValueAccessor])}
              y={yScale(d[yValueAccessor])}
              selected={selected}
              tabIndex="0"
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
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  pointClasses: PropTypes.string,
};

export default Points;
