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

  getLayout(defaultLayout, layout) {
    if (layout) {
      const row = layout.row || defaultLayout.row;
      const col = layout.col || defaultLayout.col;

      return { row, col };
    }

    return defaultLayout;
  }

  render() {
    const {
      getRow,
      getCol,
      blocks,
      blockShared,
      defaultLayout,
      type,
    } = this.props;

    return blocks.map((block, i) => {
      const { layout } = block;
      const { row, col } = this.getLayout(defaultLayout, layout);

      if (getCol === col && getRow === row) {
        const BlockTag = this.blockTags[type];
        const key = `${type}_${i}`;

        return <BlockTag key={key} {...{ blockShared, block, row, col }} />;
      }
      return null;
    });
  }
}

Blocks.defaultProps = {
  defaultLayout: { col: 'right', row: 'bottom' },
};

Blocks.propTypes = {
  type: PropTypes.string,
  blocks: PropTypes.array,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  defaultLayout: PropTypes.object,
  getRow: PropTypes.string,
  getCol: PropTypes.string,
};

export default Blocks;
