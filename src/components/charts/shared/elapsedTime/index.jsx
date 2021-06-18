import React from 'react';
import PropTypes from 'prop-types';
import styles from './elapsedTime.module.scss';

const ElapsedTime = ({ days, hours }) => {
  return (
    <div className={styles.elapsedTimeContainer}>
      <div className={styles.header}>Elapsed Time</div>
      <div className={styles.panelContainer}>
        <div className={styles.leftPanel}>
          <span className={styles.number}>{days || 0}</span>
          <span className={styles.text}>Days</span>
        </div>
        <div className={styles.rightPanel}>
          <span className={styles.number}>{hours || 0}</span>
          <span className={styles.text}>Hours</span>
        </div>
      </div>
    </div>
  );
};

ElapsedTime.propTypes = {
  days: PropTypes.number,
  hours: PropTypes.number,
};

export default ElapsedTime;
