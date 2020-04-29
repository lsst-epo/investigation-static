import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card/index.js';
import { getFluxRgba } from './sizeDistancePlotterUtilities.js';
import styles from './size-distance-plotter.module.scss';

class LegendMultiple extends React.PureComponent {
  render() {
    const { yValueAccessor, numOfSets } = this.props;
    const useFluxColor = yValueAccessor === 'color';

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
                [`color-${i}-background`]: i > 0,
                [styles.defaultPoint]: isDefaultSet && !useFluxColor,
              }
            );

            return (
              <div key={setId} className={styles.legendRow}>
                <span
                  className={pointClasses}
                  style={
                    isDefaultSet && useFluxColor
                      ? { backgroundColor: getFluxRgba(0.76) }
                      : {}
                  }
                ></span>
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
  yValueAccessor: PropTypes.string,
  numOfSets: PropTypes.number,
};

export default LegendMultiple;
