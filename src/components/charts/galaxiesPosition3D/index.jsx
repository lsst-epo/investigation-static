import React from 'react';
import PropTypes from 'prop-types';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import partition from 'lodash/partition';
import { chart } from './galaxies-position-3D.module.scss';

class GalaxiesPosition3D extends React.PureComponent {
  getAxisInfo(axisName) {
    return {
      name: axisName,
      nameGap: 25,
      type: 'value',
      nameTextStyle: {
        fontSize: 12,
        fontFamily: 'Roboto',
      },
    };
  }

  arrayifyLabelsData(data) {
    return data.map(labelData => {
      return [
        labelData.x,
        labelData.y,
        labelData.z,
        labelData.label,
        labelData.color,
      ];
    });
  }

  getOption(data) {
    const [labels, noLabels] = partition(data, o => o.label);

    return {
      grid3D: {
        show: false,
        bottom: '20%',
        viewControl: {
          projection: 'perspective',
          distance: 220,
        },
      },
      xAxis3D: this.getAxisInfo('x'),
      yAxis3D: this.getAxisInfo('y'),
      zAxis3D: this.getAxisInfo('z'),
      dataset: {
        source: noLabels,
        dimensions: ['x', 'y', 'z'],
      },
      series: [
        {
          type: 'scatter3D',
          animation: false,
          symbolSize: 10,
          itemStyle: {
            color: params => {
              return params.data.color;
            },
          },
        },
        {
          type: 'scatter3D',
          name: 'Labeled Data',
          animation: false,
          data: this.arrayifyLabelsData(labels),
          symbolSize: 10,
          itemStyle: {
            color: params => {
              return params.data[4];
            },
          },
          label: {
            show: true,
            distance: 3,
            formatter: params => {
              return params.data[3];
            },
            textStyle: {
              fontSize: 10,
              fontFamily: 'Roboto',
            },
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
            className={chart}
            style={{ width: '100%', height: '80%' }}
            option={this.getOption(data)}
          />
        )}
      </>
    );
  }
}

GalaxiesPosition3D.propTypes = {
  data: PropTypes.array,
  // options: PropTypes.object,
};

export default GalaxiesPosition3D;
