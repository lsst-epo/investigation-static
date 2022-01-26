/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import Reference from '../../reference';

function ReferenceBlock({ block, blockShared }) {
  return <Reference reference={block} {...{ blockShared }} />;
}

ReferenceBlock.propTypes = {
  block: PropTypes.object,
  blockShared: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ReferenceBlock;
