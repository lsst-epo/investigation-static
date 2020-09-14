import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  toSigFigs,
  formatValue,
  addTheCommas,
} from '../../../lib/utilities.js';
import { playbackSpeed } from './orbital-viewer.module.scss';

function PlaybackSpeed({ dayPerVizSec }) {
  // function getModifier(value) {
  //   return formatValue(parseInt(toSigFigs(value * 86400, 3), 10), 3);
  // }

  function getInterval(value) {
    let interval = formatValue(value, 0);

    if (interval >= 365) {
      interval = `${addTheCommas(
        toSigFigs(formatValue(interval / 365.25, 0), 3)
      )} year${interval === 365 ? '' : 's'}`;
    } else if (interval < 365 && interval >= 1) {
      interval = `${addTheCommas(toSigFigs(interval, 3))} day${
        interval === 1 ? '' : 's'
      }`;
    } else if (interval < 1) {
      interval = '1 second';
    }

    return interval;
  }

  const [interval, setInterval] = useState(1);

  useEffect(() => {
    setInterval(getInterval(dayPerVizSec));
  }, [dayPerVizSec]);

  return <div className={playbackSpeed}>Time Step is {interval}/second</div>;
}

PlaybackSpeed.propTypes = {
  dayPerVizSec: PropTypes.number,
};

export default PlaybackSpeed;
