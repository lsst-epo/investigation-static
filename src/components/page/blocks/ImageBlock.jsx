import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
import ImageLoader from '../../site/imageLoader/index.jsx';
import i18nComponents from '../../../lib/i18nComponents.jsx';

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
    const { block: image, row, t } = this.props;
    const { mediaPath, figText, altText, classes } = image;

    return (
      <figure className={classnames(gridImage, this.gridClasses[row], classes)}>
        <ImageLoader src={t(mediaPath)} alt={t(altText) || ''} />
        {figText && (
          <figcaption>
            <Trans components={i18nComponents}>{figText}</Trans>
          </figcaption>
        )}
      </figure>
    );
  }
}

ImageBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation()(ImageBlock);
