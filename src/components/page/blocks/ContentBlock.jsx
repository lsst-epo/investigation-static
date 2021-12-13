/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { renderDef } from '../../../lib/utilities';

import {
  gridCopy,
  gridCopyTop,
  gridCopyMiddle,
  gridCopyBottom,
} from '../page.module.scss';

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
      <div
        className={`${gridCopy} ${this.gridClasses[row || 'top']}`}
        dangerouslySetInnerHTML={renderDef(content)}
      />
    );
  }
}

ContentBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ContentBlock;
