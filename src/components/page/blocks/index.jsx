import React from 'react';
import PropTypes from 'prop-types';
import { getLayout } from './blocksUtilities.js';
import WidgetBlock from './WidgetBlock';
import ImageBlock from './ImageBlock';
import TableBlock from './TableBlock';

class Blocks extends React.PureComponent {
  constructor(props) {
    super(props);

    this.blockTags = {
      widget: WidgetBlock,
      image: ImageBlock,
      table: TableBlock,
    };
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
      const { row, col } = getLayout(defaultLayout, layout);

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
