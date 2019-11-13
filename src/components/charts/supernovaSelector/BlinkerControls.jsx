import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../site/button';
import Rewind from '../../site/icons/Rewind';
import FastForward from '../../site/icons/FastForward';
import Pause from '../../site/icons/Pause';
import Play from '../../site/icons/Play';
import styles from './styles.module.scss';

const BlinkerControls = ({
  playing,
  handleStartStop,
  handleNext,
  handlePrevious,
}) => {
  const StartStopTag = playing ? Pause : Play;

  return (
    <div className={styles.controls}>
      <Button icon iconEl={<Rewind />} onClick={handlePrevious} />
      <Button icon iconEl={<StartStopTag />} onClick={handleStartStop} />
      <Button icon iconEl={<FastForward />} onClick={handleNext} />
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
