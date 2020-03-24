import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import './large-scale-structure-plot.module.scss';
import { formatValue } from '../../../lib/utilities';

class LargeScaleStructure2DPlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.primaryColor = '#374785';
    this.secondaryColor = '#A8D0E6';
  }

  formatTooltipPoint = (color, string) => {
    return (
      "<span style='display:inline-block;width:10px;height:10px;border-radius:50%;background-color:" +
      color +
      ";margin-right:5px;'></span><span>" +
      string +
      '</span>'
    );
  };

  getTooltipFormat = params => {
    const data = params.value;

    if (Array.isArray(data)) {
      const [ra, dec] = data;
      return this.formatTooltipPoint(
        this.secondaryColor,
        `${ra.toFixed(2)}, ${dec.toFixed(2)}`
      );
    }

    const { RA, Dec, redshift } = data;
    return this.formatTooltipPoint(
      this.primaryColor,
      `${RA.toFixed(2)}, ${Dec.toFixed(2)}, ${redshift.toFixed(2)}`
    );
  };

  getLegend = () => {
    const { sliderVal, sliderIncrement } = this.props;
    const selectedRange = sliderVal
      ? `${sliderVal} - ${formatValue(sliderVal + sliderIncrement, 2)}`
      : '';
    return {
      orient: 'vertical',
      right: 5,
      data: [
        {
          name: 'Data Point',
          icon: 'circle',
        },
        {
          name: 'Selected Range: ' + selectedRange,
          icon: 'circle',
        },
      ],
    };
  };

  getAxisInfo(title) {
    return {
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      name: title,
      nameLocation: 'middle',
      nameGap: 25,
      axisLine: {
        lineStyle: {
          color: 'black',
          opacity: 1,
        },
      },
    };
  }

  getSeries(name, options) {
    return {
      name,
      symbolSize: 8,
      type: 'scatter',
      encode: {
        x: 'RA',
        y: 'Dec',
      },
      legendHoverLink: true,
      largeThreshold: 1000,
      ...options,
    };
  }

  getOption() {
    const { data, selectedData, largeBool, trimBool } = this.props;

    if (data) {
      if (Object.keys(data).length === 0 || data.length === 0) return {};
    }

    return {
      legend: this.getLegend(),
      dataset: {
        source: selectedData,
        dimensions: ['RA', 'Dec', 'redshift'],
      },
      tooltip: {
        borderColor: '#777',
        borderWidth: 2,
        formatter: this.getTooltipFormat,
      },
      xAxis: this.getAxisInfo('RA'),
      yAxis: this.getAxisInfo('Dec'),

      color: [this.secondaryColor, this.primaryColor],
      series: [
        this.getSeries('Data Point', {
          data,
          legendHoverLink: true,
          large: largeBool,
          itemStyle: {
            opacity: !trimBool ? 0.25 : 1,
          },
        }),
        this.getSeries('Highlighted Data Point', {
          large: largeBool,
          itemStyle: {
            color: !trimBool ? this.primaryColor : this.secondaryColor,
          },
        }),
      ],
      textStyle: {
        fontFamily: 'Roboto',
      },
      animation: false,
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
    return (
      <>
        <ReactEcharts style={{ height: '600px' }} option={this.getOption()} />
      </>
    );
  }
}

LargeScaleStructure2DPlot.defaultProps = {
  largeBool: true,
  trimBool: false,
};

LargeScaleStructure2DPlot.propTypes = {
  largeBool: PropTypes.bool,
  trimBool: PropTypes.bool,
  data: PropTypes.array,
  selectedData: PropTypes.array,
  sliderIncrement: PropTypes.number,
  sliderVal: PropTypes.number,
};

export default LargeScaleStructure2DPlot;
