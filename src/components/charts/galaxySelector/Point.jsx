import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { galaxy, selected } from './galaxy-selector.module.scss';

class Point extends React.PureComponent {
  getRadius(id) {
    return (
      {
        supernova: 20,
        galaxy: 40,
      }[id] || 5
    );
  }

  render() {
    const { selected: isSelected, x, y, color, classes, id } = this.props;
    const pointClasses = classnames(
      galaxy,
      'data-point',
      `${id}-point`,
      classes,
      {
        [selected]: isSelected,
      }
    );

    return (
      <circle
        className={pointClasses}
        cx={x}
        cy={y}
        r={this.getRadius(id)}
        fill="transparent"
        stroke={!isSelected ? 'transparent' : color}
        strokeWidth={0}
      />
    );
  }
}

Point.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  classes: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Point;
