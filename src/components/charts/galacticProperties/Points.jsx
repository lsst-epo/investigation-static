import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import classnames from 'classnames';
import Point from '../shared/shapes';
import { getFluxRgba } from './galacticPropertiesUtilities.js';
import { invisible } from './galactic-properties.module.scss';

const dimension = 20;

class Points extends React.PureComponent {
  render() {
    const {
      data,
      svgShape,
      svgShapeIndex,
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
              height={dimension}
              width={dimension}
              svgShape={svgShape}
              svgShapeIndex={svgShapeIndex}
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
  svgShape: PropTypes.string,
  svgShapeIndex: PropTypes.number,
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
