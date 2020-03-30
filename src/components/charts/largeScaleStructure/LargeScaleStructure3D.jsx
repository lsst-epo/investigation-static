import React from 'react';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import {
  colorPrimary,
  colorSecondary,
} from './largeScaleStructureUtilities.js';

class LargeScaleStructure3D extends React.PureComponent {
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
    const { data, selectedData, max, min } = this.props;
    let showSelection = false;

    showSelection = selectedData && selectedData.length !== 0;

    return {
      grid3D: {},
      xAxis3D: this.getAxisOptions('RA'),
      zAxis3D: {
        max: 80,
        name: 'Dec',
        type: 'value',
        nameTextStyle: {
          fontFamily: 'Roboto',
        },
      },
      yAxis3D: {
        max,
        min,
        name: 'Redshift',
        type: 'value',
        nameTextStyle: {
          fontFamily: 'Roboto',
        },
      },
      series: [
        {
          name: 'Big Dataset',
          data,
          dimensions: ['RA', 'Dec', 'redshift'],
          type: 'scatter3D',
          encode: {
            x: 'RA',
            z: 'Dec',
            y: 'redshift',
          },
          symbolSize: 2.5,
          itemStyle: {
            color: colorSecondary,
            borderColor: colorPrimary,
            borderWidth: !showSelection ? 0.01 : 0,
            opacity: showSelection ? 0.2 : 1,
          },
        },
        {
          name: 'Highlight Dataset',
          data: selectedData,
          dimensions: ['RA', 'Dec', 'redshift'],
          type: 'scatter3D',
          encode: {
            x: 'RA',
            z: 'Dec',
            y: 'redshift',
          },
          symbolSize: 2.5,
          itemStyle: {
            color: colorSecondary,
            borderColor: colorPrimary,
            borderWidth: 0.01,
          },
        },
      ],
    };
  }

  render() {
    const { data } = this.props;

    return (
      <>
        {data && (
          <ReactEcharts
            style={{ height: '500px', width: '100%' }}
            option={this.getOption()}
          />
        )}
      </>
    );
  }
}

LargeScaleStructure3D.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
  max: PropTypes.number,
  min: PropTypes.number,
};

export default LargeScaleStructure3D;
