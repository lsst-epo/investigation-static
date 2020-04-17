import React from 'react';
import PropTypes from 'prop-types';

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
    const { mediaPath, figText, altText } = image;

    return (
      <figure className={`${gridImage} ${this.gridClasses[row]}`}>
        <img src={mediaPath} alt={altText || ''} />
        {figText && <figcaption>{figText}</figcaption>}
      </figure>
    );
  }
}

ImageBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ImageBlock;
