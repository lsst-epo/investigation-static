import React from 'react';
import PropTypes from 'prop-types';
import Checkpoint from '../../site/checkpoint/index.jsx';

import {
  gridCheckpoint,
  gridCheckpointTop,
  gridCheckpointMiddle,
  gridCheckpointBottom,
} from '../page.module.scss';

class CheckpointBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gridClasses = {
      top: gridCheckpointTop,
      middle: gridCheckpointMiddle,
      bottom: gridCheckpointBottom,
    };
  }

  render() {
    const { row } = this.props;

    return (
      <div className={`${gridCheckpoint} ${this.gridClasses[row]}`}>
        <Checkpoint />
      </div>
    );
  }
}

CheckpointBlock.propTypes = {
  row: PropTypes.string,
};

export default CheckpointBlock;
