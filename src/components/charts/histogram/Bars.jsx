import React from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar.jsx';

class Bars extends React.PureComponent {
  isMatch(testData, data) {
    return testData
      ? testData[0] === data[0] && testData[1] === data[1]
      : false;
  }

  render() {
    const {
      data,
      selectedData,
      hoveredData,
      xScale,
      yScale,
      offsetTop,
      graphHeight,
      padding,
      barClasses,
      colorClass,
    } = this.props;

    return (
      <g className="data-bars">
        {data.map((d, i) => {
          const key = `bar-${i}`;
          const barHeight = yScale(0) - yScale(d[2]);

          return (
            <Bar
              key={key}
              classes={barClasses}
              colorClass={colorClass}
              x={xScale(d[0])}
              y={yScale(d[2]) + offsetTop}
              absentY={offsetTop}
              width={xScale(d[1]) - xScale(d[0])}
              height={barHeight}
              absentHeight={graphHeight - padding - barHeight - 1}
              selected={this.isMatch(selectedData, d)}
              hovered={this.isMatch(hoveredData, d)}
            />
          );
        })}
      </g>
    );
  }
}

Bars.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.array,
  hoveredData: PropTypes.array,
  offsetTop: PropTypes.number,
  graphHeight: PropTypes.number,
  padding: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  barClasses: PropTypes.string,
  colorClass: PropTypes.string,
};

export default Bars;
