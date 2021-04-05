import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'react-md/lib//Progress/CircularProgress';
import Histogram from '../histogram/index.jsx';
import { loadingWrapper } from './orbital-properties.module.scss';

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
        {data ? (
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
        ) : (
          <div className={loadingWrapper}>
            <CircularProgress
              id="chart-loader"
              className="chart-loader"
              scale={3}
            />
          </div>
        )}
      </>
    );
  }
}

OrbitalProperties.defaultProps = {
  domain: [[0, 1000], null],
};

OrbitalProperties.propTypes = {
  data: PropTypes.object,
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
