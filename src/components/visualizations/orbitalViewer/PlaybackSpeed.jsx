import React from 'react';
import PropTypes from 'prop-types';
import { playbackSpeed } from './orbital-viewer.module.scss';

function PlaybackSpeed({ dayPerVizSec }) {
  function pluralize(value, unit) {
    return `${unit}${value > 1 ? 's' : ''}`;
  }

  function getUnit(value) {
    return value < 1 ? 'hour' : 'day';
  }

  function daysToHours(days) {
    return days * 24;
  }

  const timeIncrement =
    dayPerVizSec < 1 ? daysToHours(dayPerVizSec) : dayPerVizSec;

  return (
    <div className={playbackSpeed}>
      1 second = {timeIncrement}{' '}
      {pluralize(timeIncrement, getUnit(dayPerVizSec))}
    </div>
  );
}

PlaybackSpeed.propTypes = {
  dayPerVizSec: PropTypes.number,
};

export default PlaybackSpeed;
