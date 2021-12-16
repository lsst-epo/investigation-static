import React from 'react';
import PropTypes from 'prop-types';
import Blocks from './index.jsx';

function BlocksColumn({
  getCol,
  blocksGroups,
  defaultLayout,
  blockShared,
  blockRows,
}) {
  const getLayout = layout => {
    if (layout) {
      const row = layout.row || defaultLayout.row;
      const col = layout.col || defaultLayout.col;

      return { row, col };
    }

    return defaultLayout;
  };

  const isInLayout = (layout, getRow) => {
    const { row, col } = getLayout(layout);

    return getCol === col && getRow === row;
  };

  const getRowBlockGroups = getRow =>
    blocksGroups
      .reduce((result, blockGroup) => {
        if (blockGroup.blocks) {
          result.push({
            ...blockGroup,
            blocks: blockGroup.blocks.filter(block => {
              return isInLayout(block.layout, getRow);
            }),
          });
        }

        return result;
      }, [])
      .filter(blockGroup => blockGroup.blocks.length > 0);

  return blockRows.map(getRow => {
    const rowBlockGroups = getRowBlockGroups(getRow);

    return rowBlockGroups.map((rowBlockGroup, i) => {
      const { type, blocks } = rowBlockGroup;
      const key = `${type}-${getRow}-${getCol}-${i}`;

      return (
        blocks && (
          <Blocks {...{ key, blocks, type, blockShared, getRow, getCol }} />
        )
      );
    });
  });
}

BlocksColumn.propTypes = {
  getCol: PropTypes.string,
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
