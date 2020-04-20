import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import classnames from 'classnames';
import Point from './Point.jsx';
import { getFluxRgba } from './sizeDistancePlotterUtilities.js';
import { invisible } from './size-distance-plotter.module.scss';

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
          const { id, name, label, color, use_color: useColor } = d;
          const key = `point-${id}-${i}`;
          const useFluxColor = yValueAccessor === 'color';
          const selected = !!find(selectedData, { id });
          const hovered = !!find(hoveredData, { id });
          const classes = classnames(`data-point-${name || id}`, 'data-point', {
            [pointClasses]: pointClasses,
            selected,
            hovered,
            [invisible]: !useColor && useFluxColor,
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
              fill={useFluxColor ? getFluxRgba(color) : null}
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
