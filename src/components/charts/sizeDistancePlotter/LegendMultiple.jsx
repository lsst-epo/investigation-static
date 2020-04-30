import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card/index.js';
import styles from './size-distance-plotter.module.scss';

class LegendMultiple extends React.PureComponent {
  render() {
    const { data } = this.props;

    return (
      <Card className={styles.legend}>
        {data &&
          data.map((datum, i) => {
            const setId = `set-${i}`;
            const pointClasses = classnames(
              styles.legendPoint,
              setId,
              styles.groupPoint,
              `color-${i + 1}-background`
            );

            return (
              <div key={setId} className={styles.legendRow}>
                <span className={pointClasses}></span>
                <span>{`${datum.group || 'Rubin Observatory Data'}`}</span>
              </div>
            );
          })}
      </Card>
    );
  }
}

LegendMultiple.propTypes = {
  data: PropTypes.array,
};

export default LegendMultiple;
