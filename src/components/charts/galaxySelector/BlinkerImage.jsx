import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

const BlinkerImage = ({ image, active, alertId }) => {
  const imageClasses = classnames(styles.blinkerImage, {
    [styles.active]: active,
  });

  return (
    <div className={styles.blinkImageContainer}>
      <img
        className={imageClasses}
        alt={`Cutout for alert ${alertId}`}
        src={image}
      />
    </div>
  );
};

BlinkerImage.propTypes = {
  image: PropTypes.string,
  alertId: PropTypes.string,
  active: PropTypes.bool,
};

export default BlinkerImage;
