import React from 'react';
import PropTypes from 'prop-types';
import ImageLoader from '../../site/ImageLoader';

import { gridImage, gridImageTop, gridImageBottom } from '../page.module.scss';

class ImageBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridImageTop,
      bottom: gridImageBottom,
    };
  }

  render() {
    const { block: image, row } = this.props;

    return (
      <figure className={`${gridImage} ${this.gridClasses[row]}`}>
        <ImageLoader src={image.mediaPath} alt={image.altText} />
        <figcaption>{image.figText}</figcaption>
      </figure>
    );
  }
}

ImageBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ImageBlock;
