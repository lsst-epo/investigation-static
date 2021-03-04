import React from 'react';
import PropTypes from 'prop-types';
import 'echarts-gl';
import filter from 'lodash/filter';
import ReactEcharts from 'echarts-for-react';
import partition from 'lodash/partition';
import { chart } from './galaxies-position-3D.module.scss';

const nodeSize = 10;
const originSize = nodeSize * 2;
const defaultNode = {
  type: 'scatter3D',
  animation: false,
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
      fontSize: 14,
      fontFamily: 'Roboto',
    },
  },
};

const defaultLine = {
  type: 'line3D',
  animation: false,
  lineStyle: {
    color: '#000000',
    opacity: 0.3,
    width: 1.5,
  },
};

class GalaxiesPosition3D extends React.PureComponent {
  getAxisInfo(axisName) {
    return {
      name: axisName,
      type: 'value',
    };
  }

  dataObjsToArray(data) {
    return data.map(datum => {
      return [datum.x, datum.y, datum.z, datum.label, datum.color];
    });
  }

  createLineData(node, origin) {
    return [
      [origin.x, origin.y, origin.z],
      [node.x, node.y, node.z],
    ];
  }

  getConnectingLines(nodes, activeGalaxy) {
    return nodes.map(node => {
      return {
        ...defaultLine,
        name: 'Distance Between Galaxies',
        data: this.createLineData(node, activeGalaxy),
      };
    });
  }

  getOrigin(activeGalaxy) {
    return {
      ...defaultNode,
      name: 'Origin Galaxy',
      data: this.dataObjsToArray([activeGalaxy]),
      symbolSize: originSize,
    };
  }

  getLabeledNodes(labeledNodes) {
    return {
      ...defaultNode,
      name: 'Labeled Galaxies',
      data: this.dataObjsToArray(labeledNodes),
      symbolSize: nodeSize,
    };
  }

  getOption(data, origin) {
    const dataWithoutOrigin = filter(data, item => {
      return item.id !== origin.id;
    });

    const [labeledNodes, unlabeledNodes] = partition(
      dataWithoutOrigin,
      o => o.label
    );

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
        source: unlabeledNodes,
        dimensions: ['x', 'y', 'z'],
      },
      series: [
        {
          type: 'scatter3D',
          animation: false,
          symbolSize: nodeSize,
          itemStyle: {
            color: params => {
              return params.data.color;
            },
          },
        },
        this.getLabeledNodes(labeledNodes),
        this.getOrigin(origin),
        ...this.getConnectingLines(dataWithoutOrigin, origin),
      ],
    };
  }

  render() {
    const { data, activeGalaxy } = this.props;

    return (
      <>
        {data && (
          <ReactEcharts
            className={chart}
            style={{ width: '100%', height: '80%' }}
            option={this.getOption(data, activeGalaxy)}
          />
        )}
      </>
    );
  }
}

GalaxiesPosition3D.propTypes = {
  data: PropTypes.array,
  activeGalaxy: PropTypes.object,
};

export default GalaxiesPosition3D;
