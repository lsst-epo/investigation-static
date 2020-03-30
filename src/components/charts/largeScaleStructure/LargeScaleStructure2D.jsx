import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import {
  colorPrimary,
  colorSecondary,
  formatTooltipPoint,
  getAxisInfo,
  getSeries,
} from './largeScaleStructureUtilities.js';

class LargeScaleStructure2D extends React.PureComponent {
  getTooltipFormat = params => {
    const data = params.value;

    if (Array.isArray(data)) {
      const [ra, dec] = data;
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
    const { data, selectedData } = this.props;

    return {
      tooltip: {
        borderColor: '#777',
        borderWidth: 2,
        formatter: this.getTooltipFormat,
      },
      xAxis: getAxisInfo('RA'),
      yAxis: getAxisInfo('Dec'),
      series: [
        getSeries('Data Point', {
          data,
          large: true,
          itemStyle: {
            color: selectedData ? colorSecondary : colorPrimary,
            opacity: selectedData ? 0.2 : 1,
          },
        }),
        getSeries('Highlighted Data Point', {
          data: selectedData,
          large: true,
          itemStyle: {
            color: colorPrimary,
          },
        }),
      ],
      animation: false,
      textStyle: {
        fontFamily: 'Roboto',
      },
      dataZoom: [
        {
          type: 'slider',
          show: false,
          xAxisIndex: [0],
          minSpan: 60,
        },
        {
          type: 'slider',
          show: false,
          yAxisIndex: [0],
          minSpan: 60,
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          minSpan: 60,
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          minSpan: 60,
        },
      ],
    };
  }

  render() {
    const { data } = this.props;

    return (
      <>
        {data && (
          <ReactEcharts style={{ height: '600px' }} option={this.getOption()} />
        )}
      </>
    );
  }
}

LargeScaleStructure2D.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
};

export default LargeScaleStructure2D;
