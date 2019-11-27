import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';
import styles from './light-curve.module.scss';

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
          const { alert_id: id, error } = d;
          const key = `point-${id}-${i}`;
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const yVal = d[yValueAccessor];
          const xVal = d[xValueAccessor];
          const classes = classnames(
            `data-point-${id} data-point ${styles.dataPoint}`,
            {
              [pointClasses]: pointClasses,
              [styles.selected]: selected,
              [styles.hovered]: hovered,
              'not-active':
                (selectedData || hoveredData) && !selected && !hovered,
            }
          );

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(xVal)}
              y={yScale(yVal)}
              errorYPos={yScale(yVal + error)}
              errorYNeg={yScale(yVal - error)}
              error={yScale(error)}
              fill="#BEE7F5"
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
