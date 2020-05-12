import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { activeImage, blinkerImage } from './blinker.module.scss';

const BlinkerImage = ({ image, active, alertId, loadCallback }) => {
  const imageClasses = classnames(blinkerImage, {
    [activeImage]: active,
  });

  return (
    <img
      className={imageClasses}
      alt={`Cutout for alert ${alertId}`}
      src={image}
      onLoad={loadCallback}
    />
  );
};

BlinkerImage.propTypes = {
  image: PropTypes.string,
  alertId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  active: PropTypes.bool,
  loadCallback: PropTypes.func,
};

export default BlinkerImage;
