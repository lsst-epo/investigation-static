import React from 'react';
import PropTypes from 'prop-types';
import WidgetBlock from './WidgetBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import TableBlock from './TableBlock';
import ContentBlock from './ContentBlock';
import CheckpointBlock from './CheckpointBlock';
import QuestionBlock from './QuestionBlock';

class Blocks extends React.PureComponent {
  constructor(props) {
    super(props);

    this.blockTags = {
      widget: WidgetBlock,
      image: ImageBlock,
      video: VideoBlock,
      table: TableBlock,
      content: ContentBlock,
      checkpoint: CheckpointBlock,
      question: QuestionBlock,
    };
  }

  render() {
    const { getRow, getCol, blocks, blockShared, type } = this.props;

    return blocks.map((block, i) => {
      const BlockTag = this.blockTags[type];
      const key = `${type}_${i}`;

      return (
        <BlockTag
          key={key}
          {...{ blockShared, block, row: getRow, col: getCol }}
        />
      );
    });
  }
}

Blocks.propTypes = {
  key: PropTypes.string,
  type: PropTypes.string,
  blocks: PropTypes.array,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  getRow: PropTypes.string,
  getCol: PropTypes.string,
};

export default Blocks;
