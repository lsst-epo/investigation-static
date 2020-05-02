import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../site/button';
import ButtonIcon from '../../../site/button/ButtonIcon';
import Rewind from '../../../site/icons/Rewind';
import FastForward from '../../../site/icons/FastForward';
import Pause from '../../../site/icons/Pause';
import Play from '../../../site/icons/Play';
import Speed from '../../../site/icons/Speed';

import { controls } from './controls.module.scss';

const OrbitViewerControls = ({
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
  handleStepSelect,
}) => {
  const StartStopTag = playing ? Pause : Play;

  return (
    <div className={controls} data-testid="orbit-viewer-controls">
      <Button
        icon
        iconEl={<ButtonIcon srText="Step Back" Icon={Rewind} />}
        onClick={handlePrevious}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Start/Stop" Icon={StartStopTag} />}
        onClick={handleStartStop}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Step Forward" Icon={FastForward} />}
        onClick={handleNext}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Increment Playback Speed" Icon={Speed} />}
        onClick={handleStepSelect}
      />
    </div>
  );
};

OrbitViewerControls.propTypes = {
  playing: PropTypes.bool,
  handleStartStop: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
  handleStepSelect: PropTypes.func,
};

export default OrbitViewerControls;
