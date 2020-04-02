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
    const { data, selectedData } = this.props;
    let showSelection = false;

    showSelection = selectedData && selectedData.length !== 0;

    return {
      xAxis3D: this.getAxisOptions('X'),
      yAxis3D: this.getAxisOptions('Y'),
      zAxis3D: this.getAxisOptions('Z'),
      grid3D: {
        show: false,
        environment: '#000000',
        viewControl: {
          minDistance: 0,
          maxDistance: 100,
        },
        // postEffect: {
        // enable: true,
        // bloom: {
        //   enable: true,
        //   bloomIntensity: 1,
        // },
        // SSAO: {
        //   enable: true,
        //   quality: 'high',
        //   radius: 10,
        //   insensity: 0.5,
        // },
        // },
      },
      // visualMap: {
      //   show: false,
      // dimension: 1,
      // splitNumber: 100,
      // min: 0,
      // max: 3000,
      // inRange: {
      //   opacity: [0.05, 1],
      // },
      //   hoverlink: false,
      //   tooltip: {
      //     show: false,
      //   },
      // },
      series: [
        {
          name: 'Big Dataset',
          data,
          dimensions: ['x', 'y', 'z'],
          type: 'scatter3D',
          hoverlink: false,
          tooltip: {
            show: false,
          },
          blendMode: 'lighter',
          encode: {
            x: 'x',
            y: 'y',
            z: 'z',
          },
          hoverAnimation: false,
          symbolSize: 3,
          itemStyle: {
            color: colorPrimary,
            opacity: 0.2,
          },
        },
      ],
    };
  }

  onChartClick = params => {
    const ptArr = [params.value[0], params.value[1], params.value[2]];
    if (params.seriesIndex === 0) {
      console.log(ptArr);
      // this.setState(prevState => ({
      //   ...prevState,
      //   selectedPt: [...prevState.selectedPt, ptArr],
      //   clickedPt: params.value,
      // }));
    }
  };

  getEvent() {
    const onEvents = {
      click: this.onChartClick,
    };
    return onEvents;
  }

  render() {
    const { data } = this.props;

    return (
      <>
        {data && (
          <ReactEcharts
            onEvents={this.getEvent()}
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
