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
    const transComponents = {
      p: <p />,
      h1: <h1 />,
      h2: <h2 />,
      h3: <h3 />,
      h4: <h4 />,
      ul: <ul />,
      li: <li />,
      dl: <dl />,
      dt: <dt />,
      dd: <dd />,
      a: <a />,
      br: <br />,
      b: <b />,
    };

    return (
      <div className={`${gridCopy} ${this.gridClasses[row || 'top']}`}>
        <Trans components={transComponents}>{content}</Trans>
      </div>
    );
  }
}

ContentBlock.propTypes = {
  block: PropTypes.object,
  row: PropTypes.string,
};

export default ContentBlock;
