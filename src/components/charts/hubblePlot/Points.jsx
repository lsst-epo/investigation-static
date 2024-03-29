import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import classnames from 'classnames';
import { withTranslation } from 'gatsby-plugin-react-i18next';
import Point from './Point.jsx';
import { notActive, invisible } from './hubble-plot.module.scss';

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
      colorize,
      draggedPoint,
      t,
    } = this.props;

    return (
      <g className="data-points">
        {data.map((d, i) => {
          const { id, label } = d;
          const key = `point-${id}-${i}`;
          const x = d[xValueAccessor];
          const y = d[yValueAccessor];
          const selected = !!find(selectedData, d);
          const hovered = !!find(hoveredData, d);

          const classes = classnames('data-point', pointClasses, {
            [`color-${i + 1}-translucent-fill`]: colorize,
            [`color-${i + 1}-stroke`]: colorize,
            selected,
            hovered,
            [notActive]: (selectedData || hoveredData) && !selected && !hovered,
            [invisible]: x === null || y === null || draggedPoint === d,
          });

          return (
            <Point
              key={key}
              classes={classes}
              selected={selected}
              hovered={hovered}
              x={xScale(x)}
              y={yScale(y) + offsetTop}
              label={t(label)}
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
  draggedPoint: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation()(Points);
