import React from 'react';
import PropTypes from 'prop-types';
import Block from './index.jsx';

function BlocksColumn({
  col,
  blocksGroups,
  defaultLayout,
  blockShared,
  blockRows,
}) {
  const getLayout = layout => {
    if (layout) {
      const blockRow = layout.row || defaultLayout.row;
      const blockCol = layout.col || defaultLayout.col;

      return { row: blockRow, col: blockCol };
    }

    return defaultLayout;
  };

  const isInLayout = (layout, row) => {
    const blockLayout = getLayout(layout);

    return blockLayout.col === col && blockLayout.row === row;
  };

  const getRowBlockGroups = row =>
    blocksGroups.reduce((result, blocksGroup) => {
      const { blocks } = blocksGroup;
      const filteredBlocksGroup = {
        ...blocksGroup,
        blocks: blocks.filter(block => isInLayout(block.layout, row)),
      };

      if (filteredBlocksGroup.blocks.length > 0) {
        result.push(filteredBlocksGroup);
      }

      return result;
    }, []);

  return blockRows.map(row => {
    const rowBlockGroups = getRowBlockGroups(row);

    return rowBlockGroups.map((rowBlockGroup, i) => {
      const { type, blocks } = rowBlockGroup;
      const key = `${type}-${row}-${col}-${i}`;

      return (
        blocks && (
          <Block key={key} {...{ blocks, type, blockShared, row, col }} />
        )
      );
    });
  });
}

BlocksColumn.propTypes = {
  col: PropTypes.string,
  blockShared: PropTypes.object,
  blockRows: PropTypes.array,
  blocksGroups: PropTypes.array,
  defaultLayout: PropTypes.object,
};

BlocksColumn.defaultProps = {
  blockRows: ['top', 'middle', 'bottom'],
  defaultLayout: { col: 'right', row: 'bottom' },
};

export default BlocksColumn;
