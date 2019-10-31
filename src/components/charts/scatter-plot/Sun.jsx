import React from 'react';
import PropTypes from 'prop-types';
// import includes from 'lodash/includes';
import { select as d3Select } from 'd3-selection';
// import { easeElastic as d3EaseElastic } from 'd3-ease';
import { getSunValue } from '../../lib/utilities.js';

class Sun extends React.PureComponent {
  constructor(props) {
    super(props);

    this.baseSize = 30;
    this.sunData = getSunValue();
    // this.svgEl = React.createRef();
    this.pathEl = React.createRef();
  }

  componentDidMount() {
    d3Select(this.pathEl.current).datum(this.sunData);
  }

  // componentDidUpdate() {
  //   const { selectedData, hoveredData } = this.props;
  //   const selected = includes(selectedData, this.sunData);
  //   const hovered = includes(hoveredData, this.sunData);
  //   const $sun = d3Select(this.svgEl.current);

  //   if (selected || hovered) {
  //     $sun
  //       .raise()
  //       .transition()
  //       .duration(800)
  //       .ease(d3EaseElastic);
  //   }
  // }

  render() {
    const { xScale, yScale } = this.props;
    const { temperature, luminosity } = this.sunData;

    return (
      <svg
        ref={this.svgEl}
        x={xScale(temperature) - this.baseSize / 2}
        y={yScale(luminosity) - 4}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${this.baseSize} ${this.baseSize}`}
        height={this.baseSize}
        width={this.baseSize}
      >
        <path
          className="data-point sun"
          ref={this.pathEl}
          d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
          fill="#2B2E34"
        />
      </svg>
    );
  }
}

Sun.propTypes = {
  // selectedData: PropTypes.array,
  // hoveredData: PropTypes.array,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export default Sun;
