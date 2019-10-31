import React from 'react';
import PropTypes from 'prop-types';
import {
  line as d3Line,
  curveCardinalClosed as d3CurveCardinalClosed,
} from 'd3-shape';

class Region extends React.PureComponent {
  getD() {
    const {
      points,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
    } = this.props;

    const $line = d3Line()
      .x(d => {
        return xScale(d[xValueAccessor]);
      })
      .y(d => {
        return yScale(d[yValueAccessor]);
      })
      .curve(d3CurveCardinalClosed);

    return $line(points);
  }

  render() {
    const { type } = this.props;
    const classNames = 'region ' + type;
    return <path d={this.getD()} className={classNames} />;
  }
}

Region.propTypes = {
  type: PropTypes.string,
  points: PropTypes.array,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
};

export default Region;
