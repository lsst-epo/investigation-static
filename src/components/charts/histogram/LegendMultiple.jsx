import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '../../site/card/index.js';

import styles from './histogram.module.scss';

class LegendMultiple extends React.PureComponent {
  constructor(props) {
    super(props);

    this.objectTypes = {
      neo: 'NEO',
      comets: 'Comet',
      mba: 'MBA',
      tno: 'TNO',
    };
  }

  render() {
    const { data, label } = this.props;

    return (
      <Card className={styles.legend}>
        {data &&
          data.map((datum, i) => {
            const id = i + 1;
            const pointClasses = classnames(
              styles.legendBar,
              styles.groupPoint,
              styles[`colorSet${id}`]
            );

            return (
              <div key={id} className={styles.legendRow}>
                <span className={pointClasses}></span>
                <span>
                  {this.objectTypes[datum] || `Object`} {label}
                </span>
              </div>
            );
          })}
      </Card>
    );
  }
}

LegendMultiple.propTypes = {
  data: PropTypes.array,
  label: PropTypes.string,
};

export default LegendMultiple;
