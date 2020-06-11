/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import ImageLoader from '../../site/imageLoader/index.jsx';
import { renderDef } from '../../../lib/utilities.js';

import {
  gridImage,
  gridImageTop,
  gridImageMiddle,
  gridImageBottom,
} from '../page.module.scss';

class ImageBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridImageTop,
      middle: gridImageMiddle,
      bottom: gridImageBottom,
    };
  }

  render() {
    const { block: image, row } = this.props;
    const { mediaPath, figText, altText } = image;

    return (
      <figure className={`${gridImage} ${this.gridClasses[row]}`}>
        <ImageLoader src={mediaPath} alt={altText || ''} />
        {figText && (
          <figcaption dangerouslySetInnerHTML={renderDef(figText)}></figcaption>
        )}
      </figure>
    );
  }
}

ImageBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ImageBlock;
