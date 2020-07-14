import React from 'react';
import PropTypes from 'prop-types';
import Histogram from '../histogram/index.jsx';

class OrbitalProperties extends React.PureComponent {
  callback = () => {
    return null;
  };

  render() {
    const {
      data,
      valueAccessor,
      domain,
      preSelected,
      yAxisLabel,
      xAxisLabel,
      tooltipLabels,
      tooltipAccessors,
      tooltipUnits,
      multiple,
      bins,
    } = this.props;

    return (
      <>
        {data && (
          <Histogram
            {...{
              data,
              valueAccessor,
              domain,
              preSelected,
              yAxisLabel,
              xAxisLabel,
              tooltipLabels,
              tooltipAccessors,
              tooltipUnits,
              multiple,
              bins,
            }}
            dataSelectionCallback={this.callback}
            domain={domain[0]}
          />
        )}
      </>
    );
  }
}

OrbitalProperties.defaultProps = {
  domain: [[0, 1000], null],
};

OrbitalProperties.propTypes = {
  data: PropTypes.array,
  valueAccessor: PropTypes.string,
  domain: PropTypes.array,
  dataSelectionCallback: PropTypes.func,
  xAxisLabel: PropTypes.node,
  yAxisLabel: PropTypes.string,
  preSelected: PropTypes.bool,
  tooltipAccessors: PropTypes.array,
  tooltipLabels: PropTypes.array,
  tooltipUnits: PropTypes.array,
  multiple: PropTypes.bool,
  bins: PropTypes.number,
};

export default OrbitalProperties;
