import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { activeImage, blinkerImage } from './blinker.module.scss';

const BlinkerImage = ({ image, active, alertId }) => {
  const imageClasses = classnames(blinkerImage, {
    [activeImage]: active,
  });

  return (
    <img
      className={imageClasses}
      alt={`Cutout for alert ${alertId}`}
      src={image}
    />
  );
};

BlinkerImage.propTypes = {
  image: PropTypes.string,
  alertId: PropTypes.number,
  active: PropTypes.bool,
};

export default BlinkerImage;
