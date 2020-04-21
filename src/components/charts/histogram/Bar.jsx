import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  dataBarWrapper,
  dataBarDiff,
  dataBar,
  selectedBar,
  hoveredBar,
  defaultColor,
} from './histogram.module.scss';

class Bar extends React.PureComponent {
  render() {
    const {
      x,
      y,
      absentY,
      width,
      height,
      absentHeight,
      selected,
      hovered,
      classes,
      colorClass,
    } = this.props;

    const barWrapperClasses = classnames(dataBarWrapper);
    const diffClasses = classnames(dataBarDiff, classes, {
      [selectedBar]: selected,
      [hoveredBar]: hovered,
    });
    const barClasses = classnames('data-bar-data', classes);
    const dataClasses = classnames(dataBar, colorClass || defaultColor, {
      [selectedBar]: selected,
      [hoveredBar]: hovered,
    });

    return (
      <g className={barWrapperClasses}>
        <rect
          className={dataClasses}
          x={x}
          y={y}
          height={height}
          width={width}
          strokeWidth={1}
          fill="transparent"
        />
        <rect
          className={diffClasses}
          x={x}
          y={absentY}
          height={absentHeight}
          width={width}
          fill="transparent"
          stroke="transparent"
        />
        <rect
          className={barClasses}
          x={x}
          y={absentY}
          height={absentHeight + height + 1}
          width={width}
          fill="transparent"
          stroke="transparent"
        />
      </g>
    );
  }
}

Bar.propTypes = {
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  absentY: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  absentHeight: PropTypes.number,
  classes: PropTypes.string,
  colorClass: PropTypes.string,
};

export default Bar;
