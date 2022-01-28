import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getBlocksGroups, getContents } from '../../../lib/utilities';
import Modal from '../../site/modal';
import CustomIcon from '../../site/icons/CustomIcon';

// eslint-disable-next-line import/no-cycle
import BlocksColumn from './BlocksColumn';

import {
  gridReferenceTop,
  gridReferenceMiddle,
  gridReferenceBottom,
} from '../page.module.scss';

function ReferenceBlock({ block, blockShared, row }) {
  const {
    title,
    button,
    images,
    content,
    contents,
    videos,
    tables,
    options,
  } = block;

  const { position } = options || 'left';
  const defaultIcon = 'lightbulb';
  const iconButton = button.icon && !button.text;

  const gridClasses = {
    top: gridReferenceTop,
    middle: gridReferenceMiddle,
    bottom: gridReferenceBottom,
  };

  const getSingleImageClasses = imageBlocks => {
    if (
      imageBlocks &&
      imageBlocks.length === 1 &&
      !videos &&
      !tables &&
      !content &&
      !contents
    ) {
      imageBlocks[0] = {
        ...imageBlocks[0],
        classes: 'single-modal-image',
      };
    }

    return imageBlocks;
  };

  const openButtonOpts = {
    iconEl: button.icon ? (
      <CustomIcon
        className="animate__animated animate__wobble animate__delay-1s animate__fast"
        name={button.iconEl || defaultIcon}
      />
    ) : null,
    icon: iconButton,
    flat: !iconButton,
    primary: true,
    swapTheming: true,
    text: button.text,
  };

  const blocksGroups = [
    {
      type: 'image',
      blocks: getSingleImageClasses(images),
    },
    {
      type: 'video',
      blocks: videos,
    },
    {
      type: 'content',
      blocks: getContents(content, contents),
    },
    {
      type: 'table',
      blocks: tables,
    },
  ];

  const defaultLayout = { col: 'left', row: 'top' };

  return (
    <div
      className={classnames(
        'reference-container',
        `reference-container-${position}`,
        gridClasses[row || 'top']
      )}
    >
      <Modal
        {...{
          openButtonOpts,
          title,
          size: 'lg',
        }}
      >
        <BlocksColumn
          col="left"
          {...{
            blocksGroups: getBlocksGroups(blocksGroups),
            blockShared,
            defaultLayout,
          }}
        />
      </Modal>
    </div>
  );
}

ReferenceBlock.propTypes = {
  block: PropTypes.object,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  row: PropTypes.string,
};

export default ReferenceBlock;
