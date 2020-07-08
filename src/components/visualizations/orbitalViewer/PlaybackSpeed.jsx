import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  toSigFigs,
  formatValue,
  addTheCommas,
} from '../../../lib/utilities.js';
import { playbackSpeed } from './orbital-viewer.module.scss';

function PlaybackSpeed({ dayPerVizSec }) {
  function getModifier(value) {
    return formatValue(parseInt(toSigFigs(value * 86400, 3), 10), 3);
  }

  const [modifier, setModifier] = useState(1);

  useEffect(() => {
    setModifier(getModifier(dayPerVizSec));
  }, [dayPerVizSec]);

  return (
    <div className={playbackSpeed}>
      Playback is{' '}
      {modifier > 1 ? `${addTheCommas(modifier)} X ` : 'Actual Speed'}
    </div>
  );
}

PlaybackSpeed.propTypes = {
  dayPerVizSec: PropTypes.number,
};

export default PlaybackSpeed;
