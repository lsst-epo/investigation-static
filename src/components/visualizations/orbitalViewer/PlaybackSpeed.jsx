import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  toSigFigs,
  formatValue,
  addTheCommas,
} from '../../../lib/utilities.js';
import { playbackSpeed } from './orbital-viewer.module.scss';

function PlaybackSpeed({ dayPerVizSec, elapsedTime }) {
  const [interval, setInterval] = useState(1);

  function getInterval(value) {
    let intVal = formatValue(value, 0);

    if (intVal >= 365) {
      intVal = `${addTheCommas(
        toSigFigs(formatValue(intVal / 365.25, 0), 3)
      )} year${intVal === 365 ? '' : 's'}`;
    } else if (intVal < 365 && intVal >= 1) {
      intVal = `${addTheCommas(toSigFigs(intVal, 3))} day${
        intVal === 1 ? '' : 's'
      }`;
    } else if (intVal < 1) {
      intVal = '1 second';
    }

    return intVal;
  }

  function formatElapsed() {
    const sign = elapsedTime < 0 ? '-' : '';
    const years = Math.abs(elapsedTime) / 365.256;
    const justYears = Math.floor(years);
    const justDays = 365.256 * (years - justYears);
    let formattedYears = '';
    let formattedDays = '';

    if (justYears >= 1) {
      formattedYears = `${formatValue(justYears)} year${
        justYears >= 2 ? 's' : ''
      } `;
    }

    if (justDays >= 1) {
      formattedDays = `${formatValue(justDays)} day${justDays >= 2 ? 's' : ''}`;
    }

    return `${sign}${formattedYears}${formattedDays}`;
  }

  useEffect(() => {
    setInterval(getInterval(dayPerVizSec));
  }, [dayPerVizSec]);

  return (
    <div className={playbackSpeed}>
      <div>Time Step: {interval}/second</div>
      <div>Elapsed Time: {formatElapsed()}</div>
    </div>
  );
}

PlaybackSpeed.propTypes = {
  dayPerVizSec: PropTypes.number,
  elapsedTime: PropTypes.number,
};

export default PlaybackSpeed;
