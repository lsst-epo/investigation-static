import React from 'react';
import svg from './checkpoint.svg';
import { checkpointContainer } from './checkpoint.module.scss';

const Checkpoint = () => {
  return (
    <div className={checkpointContainer}>
      <img className="checkpoint-svg" src={svg} alt="Checkpoint" />
    </div>
  );
};

export default Checkpoint;
