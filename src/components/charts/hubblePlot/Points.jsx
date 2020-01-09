import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';
import styles from './hubble-plot.module.scss';

class Points extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }

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
          const { source_id: id, name } = d;
          const key = `point-${id}-${i}`;
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const temp = d[xValueAccessor];
          const classes = classnames(`data-point-${name} data-point`, {
            [pointClasses]: pointClasses,
            [styles.selected]: selected,
            [styles.hovered]: hovered,
            'not-active':
              (selectedData || hoveredData) && !selected && !hovered,
          });

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(temp)}
              y={yScale(d[yValueAccessor])}
              fill="#000000"
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
