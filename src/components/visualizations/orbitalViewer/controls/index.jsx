import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../site/button';
import ButtonIcon from '../../../site/button/ButtonIcon';
import SkipBackward from '../../../site/icons/SkipBackward';
import SkipForward from '../../../site/icons/SkipForward';
import Pause from '../../../site/icons/Pause';
import Play from '../../../site/icons/Play';
import Replay from '../../../site/icons/Replay';

import { controls, buttonContainer, buttonLabel } from './controls.module.scss';

const OrbitViewerControls = ({
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
  handleReset,
}) => {
  const StartStopTag = playing ? Pause : Play;
  const StartStopText = playing ? 'Pause' : 'Play';

  return (
    <div className={controls} data-testid="orbit-viewer-controls">
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Step Back" Icon={SkipBackward} />}
          onClick={handlePrevious}
        />
        <span className={buttonLabel}>Skip Backward</span>
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
          iconEl={<ButtonIcon srText="Step Forward" Icon={SkipForward} />}
          onClick={handleNext}
        />
        <span className={buttonLabel}>Skip Forward</span>
      </div>
      <div className={buttonContainer}>
        <Button
          icon
          iconEl={<ButtonIcon srText="Reset" Icon={Replay} />}
          onClick={handleReset}
        />
        <span className={buttonLabel}>Reset</span>
      </div>
    </div>
  );
};

OrbitViewerControls.propTypes = {
  playing: PropTypes.bool,
  handleStartStop: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
  handleReset: PropTypes.func,
};

export default OrbitViewerControls;
