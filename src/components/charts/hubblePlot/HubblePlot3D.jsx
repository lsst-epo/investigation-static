import React from 'react';
import PropTypes from 'prop-types';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import partition from 'lodash/partition';
import { hubblePlot } from './hubble-plot.module.scss';

class HubblePlot3D extends React.PureComponent {
  // componentDidMount() {
  //   const { data, options } = this.props;
  //   console.log('component did mount', data, options); // eslint-disable-line no-console
  // }

  // componentDidUpdate() {
  //   const { data, options } = this.props;
  //   console.log('component did update', data, options); // eslint-disable-line no-console
  // }

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
        labelData.distance,
        labelData.redshift,
        labelData.velocity,
        labelData.label,
        labelData.color,
      ];
    });
  }

  getOption(data) {
    const [labels, noLabels] = partition(data, o => o.label);

    return {
      grid3D: {
        bottom: '20%',
        viewControl: {
          projection: 'perspective',
          distance: 220,
        },
      },
      xAxis3D: this.getAxisInfo('Distance'),
      yAxis3D: this.getAxisInfo('Redshift'),
      zAxis3D: this.getAxisInfo('Velocity'),
      dataset: {
        source: noLabels,
        dimensions: ['distance', 'redshift', 'velocity'],
      },
      series: [
        {
          type: 'scatter3D',
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
            className={hubblePlot}
            style={{ width: '100%', height: '80%' }}
            option={this.getOption(data)}
          />
        )}
      </>
    );
  }
}

HubblePlot3D.propTypes = {
  data: PropTypes.array,
  // options: PropTypes.object,
};

export default HubblePlot3D;
