import React from 'react';
import PropTypes from 'prop-types';
import FilterValuesLine from './FilterValuesLine.jsx';
import Point from './Point.jsx';
import styles from './asteroid-class.module.scss';

class Summary extends React.PureComponent {
  render() {
    const {
      filters,
      means,
      mins,
      maxs,
      offsetTop,
      xScale,
      yScale,
    } = this.props;

    return (
      <>
        {filters.map(filter => {
          return (
            <g key={`${filter}-summary-points`}>
              <Point
                classes={styles.summaryPoint}
                x={xScale(filter)}
                y={yScale(mins[filter]) + offsetTop}
              />
              <Point
                classes={styles.summaryPoint}
                x={xScale(filter)}
                y={yScale(means[filter]) + offsetTop}
              />
              <Point
                classes={styles.summaryPoint}
                x={xScale(filter)}
                y={yScale(maxs[filter]) + offsetTop}
              />
            </g>
          );
        })}
        <FilterValuesLine
          lineClasses={styles.summaryLine}
          pointClasses={styles.summaryPoint}
          filters={filters}
          filterValues={means}
          {...{ xScale, yScale, offsetTop }}
        />
      </>
    );
  }
}

Summary.propTypes = {
  means: PropTypes.object,
  mins: PropTypes.object,
  maxs: PropTypes.object,
  filters: PropTypes.array,
  offsetTop: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  classes: PropTypes.string,
};

export default Summary;
