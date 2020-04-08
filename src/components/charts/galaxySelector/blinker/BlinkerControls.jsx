import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../site/button';
import ButtonIcon from '../../../site/button/ButtonIcon';
import Rewind from '../../../site/icons/Rewind';
import FastForward from '../../../site/icons/FastForward';
import Pause from '../../../site/icons/Pause';
import Play from '../../../site/icons/Play';

import { controls } from './blinker.module.scss';

const BlinkerControls = ({
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
}) => {
  const StartStopTag = playing ? Pause : Play;

  return (
    <div className={controls} data-testid="blinker-controls">
      <Button
        icon
        iconEl={<ButtonIcon srText="Backward" Icon={Rewind} />}
        onClick={handlePrevious}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Start/Stop" Icon={StartStopTag} />}
        onClick={handleStartStop}
      />
      <Button
        icon
        iconEl={<ButtonIcon srText="Forward" Icon={FastForward} />}
        onClick={handleNext}
      />
    </div>
  );
};

BlinkerControls.propTypes = {
  playing: PropTypes.bool,
  handleStartStop: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
};

export default BlinkerControls;
