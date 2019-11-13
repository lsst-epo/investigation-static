import React from 'react';
import PropTypes from 'prop-types';
import { getNameFromImage } from './supernovaSelectorUtilities.js';
import BlinkerImage from './BlinkerImage';
import styles from './styles.module.scss';

const Blinker = ({ images, activeId }) => {
  return (
    <div className={styles.blinkContainer}>
      {images.map((image, i) => {
        const id = getNameFromImage(image);
        let active = activeId === id;
        if (!activeId && i === 0) active = true;

        return (
          <BlinkerImage key={id} image={image} alertId={id} active={active} />
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
