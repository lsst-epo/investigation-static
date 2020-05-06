import React from 'react';
import PropTypes from 'prop-types';
import BlinkerImage from './BlinkerImage';
import { blinkContainer } from './blinker.module.scss';

const BlinkerImages = ({ images, activeId }) => {
  return (
    <>
      <div className={blinkContainer} data-testid="blinker-images">
        {images.map((image, i) => {
          const { id, name } = image;
          let active = activeId === id;
          if (!activeId && i === 0) active = true;

          return (
            <BlinkerImage key={id} image={name} alertId={id} active={active} />
          );
        })}
      </div>
    </>
  );
};

BlinkerImages.propTypes = {
  images: PropTypes.array.isRequired,
  activeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BlinkerImages;
