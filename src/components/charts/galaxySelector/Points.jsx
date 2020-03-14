import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import isNumber from 'lodash/isNumber';
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
      active,
    } = this.props;

    return (
      <g className={`data-points ${pointClasses}`}>
        {data.map(d => {
          const { id, color } = d;
          const isSelected = !!find(selectedData, { id: d.id });
          const isActive = active ? active.id === d.id : false;

          return (
            <Point
              key={`point-${id}`}
              {...{ id, isSelected, isActive }}
              classes={pointClasses}
              x={xScale(d[xValueAccessor])}
              y={yScale(d[yValueAccessor])}
              color={isNumber(color) ? '#c82960' : color}
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
  active: PropTypes.object,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  pointClasses: PropTypes.string,
};

export default Points;
