import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './hubble-plot.module.scss';

class PointLabel extends React.PureComponent {
  render() {
    const { label, x, y, selected, hovered } = this.props;
    const labelClasses = classnames(styles.pointLabel, {
      [styles.activeLabel]: selected || hovered,
    });

    return (
      <text x={x} y={y} className={labelClasses}>
        {label}
      </text>
    );
  }
}

PointLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  label: PropTypes.string,
};

export default PointLabel;
