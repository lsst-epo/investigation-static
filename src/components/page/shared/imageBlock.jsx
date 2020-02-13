import React from 'react';
import PropTypes from 'prop-types';

function ImageBlock({ image, classname }) {
  return (
    image && (
      <div className={classname}>
        <img src={image.mediaPath} alt={image.altText} />
      </div>
    )
  );
}

ImageBlock.propTypes = {
  image: PropTypes.object,
  classname: PropTypes.string,
};

export default ImageBlock;
