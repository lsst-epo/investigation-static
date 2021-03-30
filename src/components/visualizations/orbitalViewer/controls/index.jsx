import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../site/button';
import ButtonIcon from '../../../site/button/ButtonIcon';
import Rewind from '../../../site/icons/Rewind';
import FastForward from '../../../site/icons/FastForward';
import Pause from '../../../site/icons/Pause';
import Play from '../../../site/icons/Play';
import Replay from '../../../site/icons/Replay';

import { controls, buttonContainer, buttonLabel } from './controls.module.scss';

const OrbitViewerControls = ({
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
  handleZoomReset,
}) => {
  const StartStopTag = playing ? Pause : Play;
  const StartStopText = playing ? 'Pause' : 'Play';

  return (
    <div className={controls} data-testid="orbit-viewer-controls">
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Step Back" Icon={Rewind} />}
          onClick={handlePrevious}
        />
        <span className={buttonLabel}>Skip</span>
      </div>
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Start/Stop" Icon={StartStopTag} />}
          onClick={handleStartStop}
        />
        <span className={buttonLabel}>{StartStopText}</span>
      </div>
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Step Forward" Icon={FastForward} />}
          onClick={handleNext}
        />
        <span className={buttonLabel}>Skip</span>
      </div>
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Reset" Icon={Replay} />}
          onClick={handleZoomReset}
        />
        <span className={buttonLabel}>
          <span>Reset</span>
        </span>
      </div>
    </div>
  );
};

OrbitViewerControls.propTypes = {
  playing: PropTypes.bool,
  handleStartStop: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
  handleZoomReset: PropTypes.func,
};

export default OrbitViewerControls;
