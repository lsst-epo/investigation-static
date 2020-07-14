import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import find from 'lodash/find';
import { neo, selected } from './time-domain-viewer.module.scss';

class Point extends React.PureComponent {
  isSelected(data, id) {
    return !!find(data, { id });
  }

  render() {
    const {
      selectedData,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
      active,
      selectedColor,
    } = this.props;

    const { id } = active;
    const isSelected = this.isSelected(selectedData, id);
    const pointClasses = classnames(neo, 'data-point', `${id}-point`, {
      [selected]: isSelected,
    });

    return (
      <circle
        className={pointClasses}
        cx={xScale(active[xValueAccessor])}
        cy={yScale(active[yValueAccessor])}
        r={15}
        fill="transparent"
        strokeWidth={1}
        stroke={isSelected ? selectedColor : 'transparent'}
      />
    );
  }
}

Point.propTypes = {
  selectedData: PropTypes.array,
  active: PropTypes.object,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  selectedColor: PropTypes.string,
};

export default Point;
