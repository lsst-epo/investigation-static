import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card/index.js';
import styles from './galactic-properties.module.scss';

class LegendMultiple extends React.PureComponent {
  render() {
    const { numOfSets, color } = this.props;

    return (
      <Card className={styles.legend}>
        {numOfSets &&
          Array.from(Array(numOfSets)).map((set, i) => {
            const isDefaultSet = i === 0;
            const setId = `set-${i}`;
            const pointClasses = classnames(
              styles.legendPoint,
              setId,
              styles.groupPoint,
              {
                [`color-${color || i}-background`]: i > 0,
                [styles.defaultPoint]: isDefaultSet,
              }
            );

            return (
              <div key={setId} className={styles.legendRow}>
                <span className={pointClasses}></span>
                <span>{`${
                  isDefaultSet ? 'Rubin Observatory Data' : 'Your Data'
                }`}</span>
              </div>
            );
          })}
      </Card>
    );
  }
}

LegendMultiple.propTypes = {
  numOfSets: PropTypes.number,
  color: PropTypes.string,
};

export default LegendMultiple;
