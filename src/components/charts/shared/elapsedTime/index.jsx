import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';
import styles from './elapsedTime.module.scss';

const ElapsedTime = ({ days, hours }) => {
  const safeDays = days || 0;
  const safeHours = hours || 0;

  return (
    <div className={styles.elapsedTimeContainer}>
      <div className={styles.header}>
        <Trans>widgets::elapsed_time.title</Trans>
      </div>
      <div className={styles.panelContainer}>
        <div className={styles.leftPanel}>
          <span className={styles.number}>{safeDays}</span>
          <span className={styles.text}>
            <Trans count={safeDays}>widgets::elapsed_time.interval.day</Trans>
          </span>
        </div>
        <div className={styles.rightPanel}>
          <span className={styles.number}>{safeHours}</span>
          <span className={styles.text}>
            <Trans count={safeHours}>widgets::elapsed_time.interval.hour</Trans>
          </span>
        </div>
      </div>
    </div>
  );
};

ElapsedTime.defaultProps = {
  days: 0,
  hours: 0,
};

ElapsedTime.propTypes = {
  days: PropTypes.number,
  hours: PropTypes.number,
};

export default ElapsedTime;
