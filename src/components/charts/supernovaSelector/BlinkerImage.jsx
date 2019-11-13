import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';
import { getFluid } from './supernovaSelectorUtilities.js';
import styles from './styles.module.scss';

const BlinkerImage = ({ image, active, alertId }) => {
  const fluid = getFluid(image);
  const imageClasses = classnames(styles.blinkerImage, {
    [styles.active]: active,
  });

  return (
    <div className={styles.blinkImageContainer}>
      <Img
        className={imageClasses}
        alt={`Cutout image for alert ${alertId}`}
        fluid={fluid}
      />
    </div>
  );
};

BlinkerImage.propTypes = {
  image: PropTypes.object,
  alertId: PropTypes.string,
  active: PropTypes.bool,
};

export default BlinkerImage;
