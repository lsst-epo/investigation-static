import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  activeImage,
  blinkImageContainer,
  blinkerImage,
} from './blinker.module.scss';

const BlinkerImage = ({ image, active, alertId }) => {
  const imageClasses = classnames(blinkerImage, {
    [activeImage]: active,
  });

  return (
    <div className={blinkImageContainer}>
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
