import React from 'react';
import PropTypes from 'prop-types';

function Images({ images, classname }) {
  return (
    images &&
    images.map((image, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className={classname} key={`${image.altText}_${i}`}>
        <img src={image.mediaPath} alt={image.altText} />
      </div>
    ))
  );
}

Images.propTypes = {
  images: PropTypes.array,
  classname: PropTypes.string,
};

export default Images;
