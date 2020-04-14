import React from 'react';
import PropTypes from 'prop-types';
import {
  histogram as d3Histogram,
  thresholdScott as d3ThresholdScott,
} from 'd3-array';
// threshholdFreedmanDiaconis as d3ThresholdFreedmanDiaconis,
// thresholdSturges as d3ThresholdSturges,
// thresholdScott as d3ThresholdScott,
import Histogram from '../histogram/index.jsx';

class OrbitalProperties extends React.PureComponent {
  render() {
    const { data, domain, valueAccessor } = this.props;
    return (
      <>
        <h2>Orbital Properties</h2>
        <Histogram data={data} valueAccessor="i" domain={domain} />
      </>
    );
  }
}

// OrbitalProperties.defaultProps = {
//   width: 600,
//   height: 600,
//   padding: 80,
//   offsetTop: 7,
//   offsetRight: 7,
//   yAxisLabel: 'Number of Stars',
//   tooltipAccessors: ['temperature'],
// };

OrbitalProperties.propTypes = {
  data: PropTypes.array,
  // activeId: PropTypes.string,
  // activeData: PropTypes.any,
  // dataSelectionCallback: PropTypes.func,
  // width: PropTypes.number,
  // height: PropTypes.number,
  // padding: PropTypes.number,
  // offsetRight: PropTypes.number,
  // offsetTop: PropTypes.number,
  // xAxisLabel: PropTypes.node,
  // yAxisLabel: PropTypes.string,
  valueAccessor: PropTypes.string,
  domain: PropTypes.array,
  // preSelected: PropTypes.bool,
  // tooltipAccessors: PropTypes.array,
  // multiple: PropTypes.bool,
};

export default OrbitalProperties;
