import React from 'react';
import PropTypes from 'prop-types';
import { getBlocksGroups, getContents } from '../../lib/utilities';
import Modal from '../site/modal';
import CustomIcon from '../site/icons/CustomIcon';
import BlocksColumn from '../page/blocks/BlocksColumn';

function Reference({ reference }) {
  const {
    title,
    button,
    images,
    content,
    contents,
    videos,
    tables,
  } = reference;

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
    iconEl: button.icon ? <CustomIcon name={button.iconEl} /> : null,
    icon: button.icon,
    flat: !button.icon,
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
    <div className="reference-container">
      <Modal
        {...{
          openButtonOpts,
          title,
          size: 'lg',
        }}
      >
        <BlocksColumn
          col="left"
          {...{ blocksGroups: getBlocksGroups(blocksGroups), defaultLayout }}
        />
      </Modal>
    </div>
  );
}

Reference.propTypes = {
  reference: PropTypes.object,
};

export default Reference;
