import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    } = this.props;
    // const barClasses = classnames(`data-bar-wrapper ${classes || ""}`, {
    //   selected,
    //   hovered,
    // });

    const barWrapperClasses = classnames('data-bar-wrapper', {
      selected,
      hovered,
    });

    return (
      <g className={barWrapperClasses}>
        <rect
          className="data-bar"
          x={x}
          y={y}
          height={height}
          width={width}
          strokeWidth={1}
          fill="transparent"
        />
        <rect
          className={`data-bar-diff ${classes || ''}`}
          x={x}
          y={absentY}
          height={absentHeight}
          width={width}
          fill="transparent"
          stroke="transparent"
        />
        <rect
          className="data-bar-data"
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
};

export default Bar;
