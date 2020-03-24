import React from 'react';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

class LargeScaleStructureScatterPlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getAxisOptions(name) {
    return {
      name,
      type: 'value',
      nameTextStyle: {
        fontFamily: 'Roboto',
      },
    };
  }

  getOption() {
    const { dataProp, altData, shouldTrim, maximum } = this.props;

    if (dataProp) {
      if (Object.keys(dataProp).length === 0 || altData === null) return {};
    }

    const isAltData = altData !== null && altData.length !== 0;
    const showData = isAltData ? altData : dataProp;

    return {
      grid3D: {},
      dataset: {
        source: showData,
        dimensions: ['RA', 'Dec', 'redshift'],
      },
      xAxis3D: this.getAxisOptions('RA'),
      zAxis3D: {
        max: 80,
        name: 'Dec',
        type: 'value',
        nameTextStyle: {
          fontFamily: 'Roboto',
        },
      },
      // visualMap: [
      //   {
      //     show: false,
      //     type: 'piecewise',
      //     dimension: 2,
      //     pieces: [
      //       { min: 0, max: 0.09, color: '#ffbaba' },
      //       { min: 0.09, max: 0.15, color: '#ff5252' },
      //       { min: 0.15, max: 0.2, color: ' #a70000' },
      //     ],
      //     outOfRange: {
      //       color: ['#000'],
      //     },
      //   },
      // ],
      yAxis3D: {
        max: maximum.toFixed(2),
        min: 0,
        name: 'Redshift',
        type: 'value',
        nameTextStyle: {
          fontFamily: 'Roboto',
        },
      },
      series: [
        {
          name: 'Big Dataset',
          type: 'scatter3D',
          encode: {
            x: 'RA',
            y: 'redshift',
            z: 'Dec',
          },
          data: shouldTrim ? [] : dataProp,
          symbolSize: 2.5,
          itemStyle: {
            color: '#ffbaba',
            borderColor: '#a70000',
            borderWidth: 0.01,
          },
        },
        {
          name: 'Highlight Dataset',
          type: 'scatter3D',
          encode: {
            x: 'RA',
            y: 'redshift',
            z: 'Dec',
          },
          symbolSize: 2.5,
          itemStyle: {
            color: '#A8D0E6',
            borderColor: '#374785',
            borderWidth: 0.01,
          },
        },
      ],
    };
  }

  render() {
    return (
      <ReactEcharts
        style={{ height: '400px', width: '100%' }}
        option={this.getOption()}
      />
    );
  }
}

LargeScaleStructureScatterPlot.propTypes = {
  shouldTrim: PropTypes.bool,
  dataProp: PropTypes.array,
  altData: PropTypes.array,
  maximum: PropTypes.number,
};

export default LargeScaleStructureScatterPlot;
