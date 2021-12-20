import React from 'react';
import PropTypes from 'prop-types';
import WidgetBlock from './WidgetBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import TableBlock from './TableBlock';
import ContentBlock from './ContentBlock';
import CheckpointBlock from './CheckpointBlock';
import QuestionBlock from './QuestionBlock';

function Blocks({ type, blocks, blockShared, row, col }) {
  const blockTags = {
    widget: WidgetBlock,
    image: ImageBlock,
    video: VideoBlock,
    table: TableBlock,
    content: ContentBlock,
    checkpoint: CheckpointBlock,
    question: QuestionBlock,
  };

  return blocks.map((block, i) => {
    const BlockTag = blockTags[type];
    const key = `${type}_${i}`;

    return <BlockTag key={key} {...{ key, blockShared, block, row, col }} />;
  });
}

Blocks.propTypes = {
  type: PropTypes.string,
  blocks: PropTypes.array,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  row: PropTypes.string,
  col: PropTypes.string,
};

export default Blocks;
