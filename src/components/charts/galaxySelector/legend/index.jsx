import React from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '../../../../lib/utilities.js';
import styles from './legend-styles.module.scss';

class Legend extends React.PureComponent {
  constructor(props) {
    super(props);

    this.boxes = [
      {
        id: 'galaxy',
        valueAccessor: 'velocity',
        label: 'Galaxy',
        unit: 'Velocity (km/s)',
      },
      {
        id: 'supernova',
        valueAccessor: 'distance',
        label: 'Supernova',
        unit: 'Distance (Mpc)',
      },
    ];
  }

  getValue(id, valueAccessor, selectedData, activeGalaxy) {
    if (!selectedData) return '';
    let selected = false;

    selectedData.forEach(datum => {
      if (datum.id === id) {
        selected = true;
      }
    });

    if (selected) {
      return formatValue(activeGalaxy[valueAccessor], 0);
    }

    return '';
  }

  render() {
    const { activeGalaxy, selectedData } = this.props;

    return (
      <>
        {activeGalaxy && (
          <div className={styles.legend}>
            {this.boxes.map(box => {
              const { name, color } = activeGalaxy;
              const { id, label, unit, valueAccessor } = box;
              const value = this.getValue(
                id,
                valueAccessor,
                selectedData,
                activeGalaxy
              );

              return (
                <div
                  key={`${id}-${name}`}
                  className={styles.legendBox}
                  style={{ backgroundColor: color }}
                >
                  <p className={styles.detail}>{label}</p>
                  <p className={styles.detail}>{unit}</p>
                  <p className={`${styles.detail} ${styles.output}`}>{value}</p>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}
export default Legend;

Legend.propTypes = {
  activeGalaxy: PropTypes.object,
  selectedData: PropTypes.array,
};
