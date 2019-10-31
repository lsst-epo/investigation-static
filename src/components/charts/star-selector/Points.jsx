import React from 'react';
import PropTypes from 'prop-types';
import Point from './Point.jsx';

class Points extends React.PureComponent {
  checkId(data, id) {
    if (!data) return false;
    let selected = false;
    let i = 0;

    while (i < data.length) {
      if (id === data[i].source_id) {
        selected = true;
        i = data.length;
      }

      i += 1;
    }
    return selected;
  }

  render() {
    const {
      selectedData,
      data,
      xScale,
      yScale,
      xValueAccessor,
      yValueAccessor,
      pointClasses,
    } = this.props;

    return (
      <g className={`data-points ${pointClasses}`}>
        {data.map((d, i) => {
          const { source_id: id } = d;
          const key = `point-${id}-${i}`;
          const selected = this.checkId(selectedData, id);

          return (
            <Point
              key={key}
              classes={pointClasses}
              x={xScale(d[xValueAccessor])}
              y={yScale(d[yValueAccessor])}
              selected={selected}
              tabIndex="0"
            />
          );
        })}
      </g>
    );
  }
}

Points.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.bool,
  xValueAccessor: PropTypes.string,
  yValueAccessor: PropTypes.string,
  xScale: PropTypes.string,
  yScale: PropTypes.string,
  pointClasses: PropTypes.string,
};

export default Points;
