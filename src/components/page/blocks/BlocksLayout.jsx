import React from 'react';
import PropTypes from 'prop-types';
import Blocks from './index.jsx';

function BlocksLayout({ layout, blocksGroups, defaultLayout, blockShared }) {
  return blocksGroups.map((blocksGroup, i) => {
    const { type, blocks } = blocksGroup;
    const { getRow, getCol } = layout;
    const key = `${type}-${getRow}-${getCol}-${i}`;

    return (
      blocks && (
        <Blocks
          {...{ key, blocks, type, defaultLayout, getRow, getCol, blockShared }}
        />
      )
    );
  });
}

BlocksLayout.propTypes = {
  layout: PropTypes.object,
  blocksGroups: PropTypes.array,
  defaultLayout: PropTypes.object,
  blockShared: PropTypes.object,
};

export default BlocksLayout;
