import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'gatsby-plugin-react-i18next';
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
  t,
}) => {
  const StartStopTag = playing ? Pause : Play;

  return (
    <div className={controls} data-testid="blinker-controls">
      <Button
        data-testid="blinker-rewind"
        icon
        iconEl={
          <ButtonIcon srText={t('actions.skip_backward')} Icon={Rewind} />
        }
        onClick={handlePrevious}
      />
      <Button
        data-testid="blinker-start-stop"
        icon
        iconEl={
          <ButtonIcon srText={t('actions.play_or_pause')} Icon={StartStopTag} />
        }
        onClick={handleStartStop}
      />
      <Button
        data-testid="blinker-forward"
        icon
        iconEl={
          <ButtonIcon srText={t('actions.skip_forward')} Icon={FastForward} />
        }
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
  t: PropTypes.func,
};

export default withTranslation()(BlinkerControls);
