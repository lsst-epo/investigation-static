import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

class Point extends React.PureComponent {
  render() {
    const { selected, x, y, color, classes } = this.props;
    const pointClasses = classnames(styles.galaxy, 'data-point', classes, {
      [styles.selected]: selected,
    });

    return (
      <circle
        className={pointClasses}
        cx={x}
        cy={y}
        r={20}
        fill="transparent"
        stroke={!selected ? 'transparent' : color}
        strokeWidth={0}
      />
    );
  }
}

Point.propTypes = {
  selected: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  classes: PropTypes.string,
  color: PropTypes.string,
};

export default Point;
