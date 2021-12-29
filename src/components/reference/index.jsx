import React from 'react';
import PropTypes from 'prop-types';
import { getBlocksGroups, getContents } from '../../lib/utilities';
import Modal from '../site/modal';
import QuestionMark from '../site/icons/QuestionMark';
import BlocksColumn from '../page/blocks/BlocksColumn';

function Reference({ reference }) {
  const { title, images, content, contents, videos, tables } = reference;

  const openButtonOpts = {
    iconEl: <QuestionMark />,
    icon: true,
    primary: true,
    swapTheming: true,
  };

  const blocksGroups = [
    {
      type: 'image',
      blocks: images,
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

  const children = (
    <BlocksColumn
      col="left"
      {...{ blocksGroups: getBlocksGroups(blocksGroups), defaultLayout }}
    />
  );

  const classes = 'modal-lg';

  return (
    <div className="reference-container">
      <Modal
        {...{
          children,
          classes,
          openButtonOpts,
          title,
        }}
      />
    </div>
  );
}

Reference.propTypes = {
  reference: PropTypes.object,
};

export default Reference;
