import React from 'react';
import PropTypes from 'prop-types';
import BlinkerImage from './BlinkerImage';
import { blinkContainer } from './blinker.module.scss';

const Blinker = ({ images, activeId }) => {
  return (
    <div className={blinkContainer}>
      {images.map((image, i) => {
        const { id, name } = image;
        let active = activeId === id;
        if (!activeId && i === 0) active = true;

        return (
          <BlinkerImage key={id} image={name} alertId={id} active={active} />
        );
      })}
    </div>
  );
};

Blinker.propTypes = {
  images: PropTypes.array,
  activeId: PropTypes.string,
};

export default Blinker;
