import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import find from 'lodash/find';
import { select as d3Select } from 'd3-selection';
import { easeElastic as d3EaseElastic } from 'd3-ease';
import { neo, selected } from './time-domain-viewer.module.scss';
import chartColors from '../../../assets/stylesheets/_variables.scss';

class Point extends React.PureComponent {
  constructor(props) {
    super(props);

    this.svgEl = React.createRef();
  }

  componentDidUpdate() {
    const { active, selectedData } = this.props;
    const { id } = active;
    const $point = d3Select(this.svgEl.current);

    if (this.isSelected(selectedData, id)) {
      $point
        .transition()
        .duration(800)
        .ease(d3EaseElastic)
        .attr('r', 15);
    } else {
      $point
        .transition()
        .duration(400)
        .attr('r', 0);
    }
  }

  isSelected(data, id) {
    return !!find(data, { id });
  }

  getStroke(isSelected, color) {
    if (isSelected) {
      return color;
    }

    return 'transparent';
  }

  render() {
    const {
      selectedData,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
      active,
    } = this.props;

    const { id } = active;
    const isSelected = this.isSelected(selectedData, id);
    const pointClasses = classnames(neo, 'data-point', `${id}-point`, {
      [selected]: isSelected,
    });

    return (
      <circle
        ref={this.svgEl}
        className={pointClasses}
        cx={xScale(active[xValueAccessor])}
        cy={yScale(active[yValueAccessor])}
        r={0}
        fill="transparent"
        stroke={this.getStroke(isSelected, chartColors.chart1)}
        strokeWidth={1}
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
};

export default Point;
