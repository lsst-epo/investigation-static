import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import isNumber from 'lodash/isNumber';
import Point from './Point.jsx';

import chartColors from '../../../assets/stylesheets/_variables.scss';

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
          const { id, color, radius } = d;
          const xVal = d[xValueAccessor];
          const modR = 0.6 * radius;
          const isSelected = !!find(selectedData, { id: d.id });
          const isActive = active ? active.id === d.id : false;

          return (
            <Point
              key={`point-${id}`}
              {...{ id, isActive, isSelected }}
              radius={xScale(xVal - modR) - xScale(xVal + modR)}
              classes={pointClasses}
              x={xScale(xVal)}
              y={yScale(d[yValueAccessor])}
              color={isNumber(color) ? chartColors.chart6 : color}
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
