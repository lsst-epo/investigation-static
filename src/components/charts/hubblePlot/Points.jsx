import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classnames from 'classnames';
import Point from './Point.jsx';
import { notActive, invisible } from './hubble-plot.module.scss';

class Points extends React.PureComponent {
  classify(name) {
    name
      .toLowerCase()
      .split(' ')
      .join('-');
  }

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
      colorize,
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { id, name, label } = d;
          const key = `point-${id}-${i}`;
          const x = d[xValueAccessor];
          const y = d[yValueAccessor];
          const selected = includes(selectedData, d);
          const hovered = includes(hoveredData, d);
          const classes = classnames('data-point', pointClasses, {
            [`data-point-${this.classify(name || ' ')}`]: !!name,
            [`color-${i + 1}-translucent-fill`]: colorize,
            [`color-${i + 1}-stroke`]: colorize,
            selected,
            hovered,
            [notActive]: (selectedData || hoveredData) && !selected && !hovered,
            [invisible]: x === null || y === null,
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
  colorize: PropTypes.bool,
};

export default Points;
