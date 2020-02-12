import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getElDims } from '../../../lib/utilities.js';
import styles from './hubble-plot.module.scss';

class PointLabel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.label = React.createRef();
    this.offset = 5;

    this.state = {
      rectDims: getElDims(this.label.current),
    };
  }

  componentDidMount() {
    const { x, y } = this.props;

    if (x && y) {
      this.updateRectPos(this.label.current);
    }
  }

  componentDidUpdate(prevProps) {
    const { x: prevX, y: prevY } = prevProps;
    const { x, y } = this.props;

    if (x && y && (prevX !== x || prevY !== y)) {
      this.updateRectPos(this.label.current);
    }
  }

  updateRectPos($el) {
    this.setState(prevState => ({
      ...prevState,
      rectDims: getElDims($el),
    }));
  }

  render() {
    const { label, x, y, selected, hovered } = this.props;
    const { rectDims } = this.state;
    const labelClasses = classnames(styles.pointLabel, {
      [styles.activeLabel]: selected || hovered,
    });

    return (
      <>
        <rect
          width={rectDims.width + 2 * this.offset}
          height={rectDims.height + 2 * this.offset}
          x={x - this.offset}
          y={y - rectDims.height}
          fill="#ffffff"
          strokeWidth="2"
          stroke="#000000"
        ></rect>
        <text ref={this.label} x={x} y={y} className={labelClasses}>
          {label}
        </text>
      </>
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
