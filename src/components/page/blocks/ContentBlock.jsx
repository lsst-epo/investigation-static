/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'gatsby-plugin-react-i18next';

import {
  gridCopy,
  gridCopyTop,
  gridCopyMiddle,
  gridCopyBottom,
} from '../page.module.scss';
import i18nComponents from '../../../lib/i18nComponents';

class ContentBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridCopyTop,
      middle: gridCopyMiddle,
      bottom: gridCopyBottom,
    };
  }

  render() {
    const { block, row } = this.props;
    const { content } = block || {};

    return (
      <div className={`${gridCopy} ${this.gridClasses[row || 'top']}`}>
        <Trans components={i18nComponents}>{content}</Trans>
      </div>
    );
  }
}

ContentBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ContentBlock;
