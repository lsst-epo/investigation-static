import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import {
  colorPrimary,
  formatTooltipPoint,
  getAxisInfo,
  getSeries,
} from './largeScaleStructureUtilities.js';

class LargeScaleStructure2D extends React.PureComponent {
  getTooltipFormat = params => {
    const data = params.value;

    if (Array.isArray(data)) {
      const [dec, ra] = data;
      return formatTooltipPoint(
        this.colorSecondary,
        `${ra.toFixed(2)}, ${dec.toFixed(2)}`
      );
    }

    const { RA, Dec, redshift } = data;
    return formatTooltipPoint(
      colorPrimary,
      `${RA.toFixed(2)}, ${Dec.toFixed(2)}, ${redshift.toFixed(2)}`
    );
  };

  getOption() {
    const { data, dec, ra } = this.props;

    return {
      blendMode: 'lighter',
      backgroundColor: '#000',
      xAxis: getAxisInfo({
        name: 'RA',
        min: ra.min,
        max: ra.max,
      }),
      yAxis: getAxisInfo({
        name: 'Dec',
        min: dec.min,
        max: dec.max,
      }),
      series: [
        getSeries('Data Point', {
          data,
          large: true,
          itemStyle: {
            color: colorPrimary,
            opacity: 0.8,
          },
          encode: {
            x: 'RA',
            y: 'Dec',
          },
          symbol: 'circle',
          symbolSize: 2,
        }),
      ],
      textStyle: {
        fontFamily: 'Roboto',
      },
    };
  }

  render() {
    const { data } = this.props;

    return (
      <>
        {data && (
          <ReactEcharts style={{ height: '550px' }} option={this.getOption()} />
        )}
      </>
    );
  }
}

LargeScaleStructure2D.propTypes = {
  data: PropTypes.array,
  dec: PropTypes.object,
  ra: PropTypes.object,
};

export default LargeScaleStructure2D;
