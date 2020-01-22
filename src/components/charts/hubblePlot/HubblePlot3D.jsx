import React from 'react';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
// import 'echarts';

class HubblePlot3D extends React.PureComponent {
  componentDidMount() {
    const { data, options } = this.props;
    console.log('component did mount', data, options); // eslint-disable-line no-console
  }

  componentDidUpdate() {
    const { data, options } = this.props;
    console.log('component did update', data, options); // eslint-disable-line no-console
  }

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

  getOption(data) {
    return {
      grid3D: {},
      xAxis3D: this.getAxisInfo('Distance'),
      yAxis3D: this.getAxisInfo('Redshift'),
      zAxis3D: this.getAxisInfo('Velocity'),
      dataset: {
        source: data,
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
          label: {
            show: true,
            distance: 3,
            formatter: params => {
              return params.data.name;
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
            style={{ height: '500%', width: '125%' }}
            option={this.getOption(data)}
          />
        )}
      </>
    );
  }
}

HubblePlot3D.propTypes = {
  data: PropTypes.array,
  options: PropTypes.object,
};

export default HubblePlot3D;
